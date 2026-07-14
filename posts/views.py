from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Post, Category, Tag, Comment
from .serializers import (
    PostSerializer,
    CategorySerializer,
    TagSerializer,
    CommentSerializer
)


# ==============================================
# POST ViewSet
# ==============================================
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'tags__slug', 'status']
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['published_at', 'created_at', 'title']
    ordering = ['-published_at']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(status='published')
        return queryset


# ==============================================
# CATEGORY ViewSet
# ==============================================
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    ordering = ['name']


# ==============================================
# TAG ViewSet
# ==============================================
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    ordering = ['name']


# ==============================================
# COMMENT ViewSet
# ==============================================
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Comment.objects.filter(is_approved=True)
        post_slug = self.request.query_params.get('post_slug')
        if post_slug:
            queryset = queryset.filter(post__slug=post_slug)
        return queryset

    def perform_create(self, serializer):
        post_slug = self.request.data.get('post_slug')
        if not post_slug:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"post_slug": "This field is required."})
        
        try:
            post = Post.objects.get(slug=post_slug, status='published')
            serializer.save(author=self.request.user, post=post)
        except Post.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound(detail="Post not found.")