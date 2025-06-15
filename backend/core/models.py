from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_user')

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='vendor_user')
    
class Keyword(models.Model):
    value = models.CharField(max_length=20, primary_key=True)

    def __str__(self):
        return self.value
    

def filesize_valid(value):
    lim = 5
    max_size = lim * 1024 * 1024
    if value.size > max_size:
        raise ValidationError(f"File size must be under {lim}MB.")

class JobPost(models.Model):
    post_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    content = models.TextField(max_length=2000)
    time_created = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(upload_to='post_attachments/', blank=True, null=True, validators=[filesize_valid])
    keywords = models.ManyToManyField(Keyword, blank=True)
    author = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="job_posts")

    def __str__(self):
        return self.title

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    quantity = models.IntegerField(validators=[MinValueValidator(0)])
    price = models.FloatField(validators=[MinValueValidator(0)])
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="products")



