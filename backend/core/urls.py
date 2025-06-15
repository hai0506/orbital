from django.urls import path
from .views import *

urlpatterns = [
    path("create-post/", CreatePostView.as_view(), name="create-post"),
    path("posts/", PostListView.as_view(), name="post-list"),
    path("create-product/", CreateProductView.as_view(), name="create-product"),
]
