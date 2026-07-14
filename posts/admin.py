from django.contrib import admin
from .models import Post, Category, Tag
from django.utils.html import format_html

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'status', 'published_at', 'category')
    list_filter = ('status', 'category', 'tags')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}  # Auto-fills slug when you type title
    raw_id_fields = ('author',)  # Makes selecting the author easier

    # Show a small image preview in the admin list
    def featured_image_preview(self, obj):
        if obj.featured_image:
            return format_html('<img src="{}" style="width: 50px; height: auto;" />', obj.featured_image.url)
        return "-"
    featured_image_preview.short_description = 'Image'

    # Add a custom admin action to quickly publish posts
    actions = ['publish_selected']

    def publish_selected(self, request, queryset):
        queryset.update(status='published')
    publish_selected.short_description = "Publish selected posts"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'slug')


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'slug')