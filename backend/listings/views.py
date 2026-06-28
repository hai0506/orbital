from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from datetime import datetime
from django.shortcuts import get_object_or_404
from .models import JobPost, Category
from .serializers import JobPostSerializer, ClosePostSerializer


def get_or_none(classmodel, **kwargs):
    try:
        return classmodel.objects.get(**kwargs)
    except Exception:
        return None


def update_post_is_closed():
    for post in JobPost.objects.filter(is_closed=False):
        end_dt = datetime.combine(post.end_date, post.end_time)
        if datetime.now() > end_dt:
            post.is_closed = True
            post.save(update_fields=['is_closed'])


class CreatePostView(generics.ListCreateAPIView):
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'organization':
            update_post_is_closed()
            return JobPost.objects.filter(author=self.request.user, is_closed=False)
        return JobPost.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role == 'organization':
            serializer.save(author=self.request.user)
        else:
            raise PermissionError('User cannot create posts')


class PostListView(generics.ListAPIView):
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        sort_field = self.request.query_params.get('sortby')
        category_values = self.request.query_params.getlist('categories')

        update_post_is_closed()
        qs = JobPost.objects.filter(is_closed=False)

        if category_values:
            filters = Q()
            valid = False
            for value in category_values:
                category = get_or_none(Category, value=value)
                if category:
                    filters |= Q(categories=category)
                    valid = True
            if valid:
                qs = qs.filter(filters).distinct()
            else:
                qs = qs.none()

        if sort_field == 'start_date':
            qs = qs.order_by(sort_field, 'start_time')
        else:
            qs = qs.order_by('-time_created')

        if self.request.user.role == 'vendor':
            offered_posts = JobPost.objects.filter(post_offers__vendor=self.request.user)
            qs = qs.exclude(post_id__in=offered_posts.values_list('post_id', flat=True))

        return qs


class DeletePostView(generics.RetrieveDestroyAPIView):
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'organization':
            return JobPost.objects.filter(author=self.request.user)
        raise PermissionError('User cannot delete posts.')

    lookup_field = 'post_id'


class ClosePostView(generics.UpdateAPIView):
    serializer_class = ClosePostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'organization':
            raise PermissionError('User cannot close posts.')
        return JobPost.objects.filter(author=self.request.user)

    lookup_field = 'post_id'
