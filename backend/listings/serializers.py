from rest_framework import serializers
from datetime import datetime
from .models import Category, JobPost

categories_options = [
    "Food & Beverages", "Accessories", "Stationery", "Clothing", "Toys",
    "Books", "Home Decor", "Art & Crafts", "Tech Gadgets",
    "Skincare & Beauty", "Plants", "Pet Supplies",
]


class JobPostSerializer(serializers.ModelSerializer):
    category_list = serializers.ListField(write_only=True, required=False)
    categories = serializers.SlugRelatedField(many=True, read_only=True, slug_field='value')
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    start_date = serializers.DateField(
        error_messages={'invalid': 'Enter a valid date in the format MM-DD-YYYY.', 'required': 'Start date is required.'}
    )
    end_date = serializers.DateField(
        error_messages={'invalid': 'Enter a valid date in the format MM-DD-YYYY.', 'required': 'End date is required.'}
    )
    start_time = serializers.TimeField(
        error_messages={'invalid': 'Enter a valid time.', 'required': 'Start time is required.'}
    )
    end_time = serializers.TimeField(
        error_messages={'invalid': 'Enter a valid time.', 'required': 'End time is required.'}
    )

    class Meta:
        model = JobPost
        fields = [
            'post_id', 'title', 'location', 'start_date', 'end_date',
            'start_time', 'end_time', 'remarks', 'commission',
            'attachment', 'author', 'categories', 'category_list', 'is_closed'
        ]

    def validate(self, data):
        if not data.get('title').strip():
            raise serializers.ValidationError({'title': 'Title cannot be blank.'})
        if not data.get('location').strip():
            raise serializers.ValidationError({'location': 'Location cannot be blank.'})

        start_date = data.get('start_date')
        end_date = data.get('end_date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        start_dt = datetime.combine(start_date, start_time)
        end_dt = datetime.combine(end_date, end_time)
        now = datetime.now()

        if start_date > end_date:
            raise serializers.ValidationError({'end_date': 'End date cannot be before start date.'})
        elif start_dt >= end_dt:
            raise serializers.ValidationError({'end_time': 'Start time cannot be after end time.'})

        if start_date < now.date():
            raise serializers.ValidationError({'start_date': 'Start date cannot be in the past.'})
        elif start_date == now.date() and start_dt < now:
            raise serializers.ValidationError({'start_time': 'Start time cannot be in the past.'})

        return data

    def create(self, validated_data):
        keyword_values = validated_data.pop('category_list', [])
        k = []
        for value in keyword_values:
            if value in categories_options:
                keyword_obj, _ = Category.objects.get_or_create(value=value)
                k.append(keyword_obj)
            else:
                raise serializers.ValidationError({'category_list': 'Category not in specified list.'})
        post = JobPost.objects.create(**validated_data)
        post.categories.set(k)
        return post

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['author'] = {
            'id': instance.author.id,
            'username': instance.author.username,
            'email': instance.author.email,
        }
        return rep


class ClosePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = ['is_closed']
        read_only_fields = []
