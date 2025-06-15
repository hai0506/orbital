from django.urls import path
from .views import *

urlpatterns = [
    path("create-post/", CreatePostView.as_view(), name="create-post"),
    path("posts/", PostListView.as_view(), name="post-list"),
    path("create-product/", CreateProductView.as_view(), name="create-product"),
    path("mass-create-product/", MassProductUploadView.as_view(), name="mass-create-product"),
    path('edit-product/<int:product_id>/', ProductEditView.as_view(), name='edit-product'),
]
