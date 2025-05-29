from rest_framework import serializers
from .models import *
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError


class UserProfileSerializer(serializers.ModelSerializer):
    user_type = serializers.BooleanField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'user_type']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def create(self, validated_data):
        user_type = validated_data.pop('user_type')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, user_type=user_type)
        return user