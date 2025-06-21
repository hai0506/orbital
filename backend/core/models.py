from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Organization(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='organization_user')

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='vendor_user')
    
class Keyword(models.Model):
    value = models.CharField(max_length=20, primary_key=True)

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
    content = models.TextField(max_length=2000)
    commission = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    time_created = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(upload_to='post_attachments/', blank=True, null=True) # TODO: add security
    keywords = models.ManyToManyField(Keyword, blank=True)
    author = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="job_posts")

    def __str__(self):
        return self.title

