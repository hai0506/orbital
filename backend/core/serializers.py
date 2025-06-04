from rest_framework import serializers
from .models import *
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError


class UserSerializer(serializers.ModelSerializer):
    user_type = serializers.ChoiceField(choices=['Organization', 'Vendor'], write_only=True)

    class Meta:
        model = User
        fields = ['id','username', 'password', 'email', 'user_type']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def create(self, validated_data):
        user_type = validated_data.pop('user_type')
        user = User.objects.create_user(**validated_data)
        if user_type == 'Organization':
            Student.objects.create(user=user)
        elif user_type == 'Vendor':
            Vendor.objects.create(user=user)
        return user
    
class JobPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = ['id','title', 'content', 'time_created', 'attachment', 'keywords', 'author']
        extra_kwargs = {"author": {"read_only": True}}