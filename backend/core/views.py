from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *

def get_or_none(classmodel, **kwargs):
    try:
        return classmodel.objects.get(**kwargs)
    except classmodel.DoesNotExist:
        return None

class CreateUserView(generics.CreateAPIView): # register
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CreatePostView(generics.ListCreateAPIView): # create and view own posts
    serializer_class = JobPostSerializer
    permission_classes = [AllowAny] # TODO: change back after testing
    
    def get_queryset(self): # TODO: change back after testing
        # author = get_or_none(Student, user=self.request.user)
        # if author:
        #     return JobPost.filter(author=author)
        # else: return JobPost.objects.none()
        return JobPost.objects.none()

    def perform_create(self, serializer):  # TODO: change back after testing
        student = Student.objects.get(user_id=1)
        serializer.save(author=student)

        # author = get_or_none(Student, user=self.request.user)
        # if author:
        #     serializer.save(author=author)
        # else:
        #     raise PermissionError('User cannot create posts')

class PostListView(generics.ListAPIView): # view others posts and filters.
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): # TODO: finish the filter
        keywords = self.request.data.get('keywords', [])
        return JobPost.objects.filter(keywords)


