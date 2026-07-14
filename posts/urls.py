from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PostViewSet,
    CategoryViewSet,
    TagViewSet,
    CommentViewSet
)

router = DefaultRouter()
router.register(r'api/posts', PostViewSet, basename='post')
router.register(r'api/categories', CategoryViewSet, basename='category')
router.register(r'api/tags', TagViewSet, basename='tag')
router.register(r'api/comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
]