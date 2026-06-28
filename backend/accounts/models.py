from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError


def filesize_valid(value):
    lim = 5
    max_size = lim * 1024 * 1024
    if value.size > max_size:
        raise ValidationError(f'File size must be under {lim}MB.')


class User(AbstractUser):
    ROLE_CHOICES = [('organization', 'Organization'), ('vendor', 'Vendor')]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, blank=True)
    description = models.TextField(max_length=2000, blank=True)
    pfp = models.ImageField(upload_to='pfp/', blank=True, null=True, validators=[filesize_valid])
