from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from accounts.models import filesize_valid


class Category(models.Model):
    value = models.CharField(max_length=50, primary_key=True)

    def __str__(self):
        return self.value


class JobPost(models.Model):
    post_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=500)
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    remarks = models.TextField(max_length=2000, blank=True)
    commission = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    time_created = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(
        upload_to='post_attachments/', blank=True, null=True, validators=[filesize_valid]
    )
    categories = models.ManyToManyField(Category, blank=True)
    author = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='job_posts',
        limit_choices_to={'role': 'organization'}
    )
    is_closed = models.BooleanField(default=False)
