from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *
from itertools import chain

from datetime import datetime
import asyncio
from typing import AsyncGenerator
from django.http import HttpRequest, StreamingHttpResponse, HttpResponse
import json
import random

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
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        author = get_or_none(Student, user=self.request.user)
        if author:
            return JobPost.filter(author=author)
        else: return JobPost.objects.none()
        # return JobPost.objects.none()

    def perform_create(self, serializer):
        # student = Student.objects.get(user_id=1)
        # serializer.save(author=student)

        author = get_or_none(Student, user=self.request.user)
        if author:
            serializer.save(author=author)
        else:
            raise PermissionError('User cannot create posts')

class PostListView(generics.ListAPIView): # view others posts and filters.
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): # to filter: http://127.0.0.1:8000/core/posts/?keywords=whatever1&keywords=whatever2&...
        keyword_values = self.request.query_params.getlist('keywords')
        combined_queryset = None
        if len(keyword_values) > 0:
            for v in keyword_values:
                value = v.strip().lower()
                keyword = get_or_none(Keyword, value = value)
                if keyword:
                    if combined_queryset is None: combined_queryset = keyword.jobpost_set.all()
                    else: combined_queryset = combined_queryset.union(keyword.jobpost_set.all())
            return combined_queryset
        else: return JobPost.objects.all()

class CreateMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # serializer.validated_data['sender'] = self.request.user
        serializer.validated_data['sender'] = User.objects.get(id=1)
        receiver = self.request.data.get('receiver', '')

        try:
            receiver_user = User.objects.get(id=receiver)
            serializer.validated_data['receiver'] = receiver_user
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'Receiver does not exist'}, status=status.HTTP_400_BAD_REQUEST)


