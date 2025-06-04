from django.db import models
from django.contrib.auth.models import User

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_user')

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='vendor_user')

class JobPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField(max_length=2000)
    time_created = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(upload_to='post_attachments/', blank=True, null=True) # TODO: add security
    keywords = models.JSONField(default=list, blank=True)
    author = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="job_posts")

    def __str__(self):
        return self.title