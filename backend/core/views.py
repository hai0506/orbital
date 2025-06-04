from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import *


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CreatePost(generics.ListCreateAPIView):
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return JobPost.objects.filter(author=user)

    def perform_create(self, serializer):
        try:
            Student.objects.get(user=self.request.user)
            if serializer.is_valid():
                serializer.save(author=self.request.user)
            else:
                print(serializer.errors)
        except Student.DoesNotExist:
            raise PermissionError('User cannot create posts')

