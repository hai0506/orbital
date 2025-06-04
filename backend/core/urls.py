from django.urls import path
from .views import *

urlpatterns = [
    path("posts/", CreatePost.as_view(), name="posts"),
    # path("posts/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
]
