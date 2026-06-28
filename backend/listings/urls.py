from django.urls import path
from .views import CreatePostView, PostListView, DeletePostView, ClosePostView

urlpatterns = [
    path('create-post/', CreatePostView.as_view(), name='create-post'),
    path('posts/', PostListView.as_view(), name='post-list'),
    path('delete-post/<int:post_id>/', DeletePostView.as_view(), name='delete-post'),
    path('close-post/<int:post_id>/', ClosePostView.as_view(), name='close-post'),
]
