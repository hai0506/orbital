from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import ArrayField

class Organization(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='organization_user')

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='vendor_user')
    
class Category(models.Model):
    value = models.CharField(max_length=50, primary_key=True)

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
    location = models.CharField(max_length=500)
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    remarks = models.TextField(max_length=2000, blank=True)
    commission = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    time_created = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(upload_to='post_attachments/', blank=True, null=True, validators=[filesize_valid])
    categories = models.ManyToManyField(Category, blank=True)
    author = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="job_posts")

    def delete(self, *args, **kwargs):
        self.categories.clear()
        super().delete(*args, **kwargs)

class JobOffer(models.Model):
    offer_id = models.AutoField(primary_key=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="vendor_offers")
    listing = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name="post_offers")
    allDays = models.BooleanField()
    selectedDays = ArrayField(base_field=models.DateField(), blank=True, default=list)
    selectedCategories = models.ManyToManyField(Category, blank=True)
    commission = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    remarks = models.TextField(max_length=2000, blank=True)
    status = models.CharField()
    time_created = models.DateTimeField(auto_now_add=True)
    inventory_file = models.FileField(null=True, blank=True,upload_to='inventory_file/')

    def delete(self, *args, **kwargs):
        self.selectedCategories.clear()
        super().delete(*args, **kwargs)

class Fundraiser(models.Model):
    fundraiser_id = models.AutoField(primary_key=True)
    vendors = models.ManyToManyField(JobOffer, related_name='vendors')
    listing = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name='job_listings')