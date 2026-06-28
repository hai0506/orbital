from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.postgres.fields import ArrayField


class OfferStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'
    CONFIRMED = 'confirmed', 'Confirmed'
    CANCELLED = 'cancelled', 'Cancelled'


class JobOffer(models.Model):
    offer_id = models.AutoField(primary_key=True)
    vendor = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='vendor_offers',
        limit_choices_to={'role': 'vendor'}
    )
    listing = models.ForeignKey(
        'listings.JobPost', on_delete=models.CASCADE, related_name='post_offers'
    )
    allDays = models.BooleanField()
    selectedDays = ArrayField(base_field=models.DateField(), blank=True, default=list)
    selectedCategories = models.ManyToManyField('listings.Category', blank=True)
    commission = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    remarks = models.TextField(max_length=2000, blank=True)
    status = models.CharField(
        max_length=20, choices=OfferStatus.choices, default=OfferStatus.PENDING
    )
    time_created = models.DateTimeField(auto_now_add=True)
