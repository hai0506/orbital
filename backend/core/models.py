from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import ArrayField
from datetime import datetime


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
    attachment = models.FileField(upload_to='post_attachments/', blank=True, null=True, validators=[filesize_valid])
    categories = models.ManyToManyField(Category, blank=True)
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='job_posts',
        limit_choices_to={'role': 'organization'}
    )
    is_closed = models.BooleanField(default=False)


class OfferStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'
    CONFIRMED = 'confirmed', 'Confirmed'
    CANCELLED = 'cancelled', 'Cancelled'


class JobOffer(models.Model):
    offer_id = models.AutoField(primary_key=True)
    vendor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='vendor_offers',
        limit_choices_to={'role': 'vendor'}
    )
    listing = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name='post_offers')
    allDays = models.BooleanField()
    selectedDays = ArrayField(base_field=models.DateField(), blank=True, default=list)
    selectedCategories = models.ManyToManyField(Category, blank=True)
    commission = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    remarks = models.TextField(max_length=2000, blank=True)
    status = models.CharField(max_length=20, choices=OfferStatus.choices, default=OfferStatus.PENDING)
    time_created = models.DateTimeField(auto_now_add=True)


class Fundraiser(models.Model):
    fundraiser_id = models.AutoField(primary_key=True)
    listing = models.OneToOneField(JobPost, on_delete=models.CASCADE, related_name='fundraiser')
    status = models.CharField(max_length=20, default='yet to start')

    def compute_status(self):
        now = datetime.now()
        start_dt = datetime.combine(self.listing.start_date, self.listing.start_time)
        end_dt = datetime.combine(self.listing.end_date, self.listing.end_time)
        if now < start_dt:
            return 'yet to start'
        elif start_dt <= now <= end_dt:
            return 'ongoing'
        else:
            return 'concluded'

    def refresh_status(self):
        new_status = self.compute_status()
        if self.status != new_status:
            self.status = new_status
            self.save(update_fields=['status'])


class VendorFundraiser(models.Model):
    fundraiser_id = models.AutoField(primary_key=True)
    offer = models.OneToOneField(JobOffer, on_delete=models.CASCADE, related_name='vendor_fundraiser')
    org_fundraiser = models.ForeignKey(Fundraiser, on_delete=models.CASCADE, related_name='vendors')


class PaymentMethod(models.TextChoices):
    PAYLAH = 'PayLah', 'PayLah'
    PAYNOW = 'PayNow', 'PayNow'
    CASH = 'Cash', 'Cash'
    NETS = 'NETS', 'NETS'
    CARD = 'Card', 'Card'
    OTHERS = 'Others', 'Others'


class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    quantity = models.IntegerField(validators=[MinValueValidator(0)])
    price = models.FloatField(validators=[MinValueValidator(0)])
    image = models.ImageField(upload_to='product_images/', blank=True, null=True, validators=[filesize_valid])
    vendor = models.ForeignKey(VendorFundraiser, on_delete=models.CASCADE, related_name='products')
    remarks = models.TextField(max_length=1000, blank=True)


class Transaction(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    payment = models.CharField(max_length=20, choices=PaymentMethod.choices)
    vendor = models.ForeignKey(VendorFundraiser, on_delete=models.CASCADE, related_name='transactions')
    time_created = models.DateTimeField(auto_now_add=True)


class TransactionItem(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def total_price(self):
        return self.quantity * self.product.price


class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    time_created = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)


class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    vendor_fundraiser = models.ForeignKey(VendorFundraiser, on_delete=models.CASCADE, related_name='review')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_reviews')
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(max_length=2000, blank=True)
    time_created = models.DateTimeField(auto_now_add=True)
