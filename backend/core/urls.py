from django.urls import path
from .views import *

urlpatterns = [
    path("create-post/", CreatePostView.as_view(), name="create-post"),
    path("posts/", PostListView.as_view(), name="post-list"),
    path('user/profile/', get_user_profile, name='user-profile'),
    path("create-message/", CreateMessageView.as_view(), name="create-message"),
]
