from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime
from accounts.models import filesize_valid


class Fundraiser(models.Model):
    fundraiser_id = models.AutoField(primary_key=True)
    listing = models.OneToOneField(
        'listings.JobPost', on_delete=models.CASCADE, related_name='fundraiser'
    )
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
    offer = models.OneToOneField(
        'offers.JobOffer', on_delete=models.CASCADE, related_name='vendor_fundraiser'
    )
    org_fundraiser = models.ForeignKey(
        Fundraiser, on_delete=models.CASCADE, related_name='vendors'
    )


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
    image = models.ImageField(
        upload_to='product_images/', blank=True, null=True, validators=[filesize_valid]
    )
    vendor = models.ForeignKey(VendorFundraiser, on_delete=models.CASCADE, related_name='products')
    remarks = models.TextField(max_length=1000, blank=True)


class Transaction(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    payment = models.CharField(max_length=20, choices=PaymentMethod.choices)
    vendor = models.ForeignKey(
        VendorFundraiser, on_delete=models.CASCADE, related_name='transactions'
    )
    time_created = models.DateTimeField(auto_now_add=True)


class TransactionItem(models.Model):
    transaction = models.ForeignKey(
        Transaction, on_delete=models.CASCADE, related_name='items'
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def total_price(self):
        return self.quantity * self.product.price


class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    vendor_fundraiser = models.ForeignKey(
        VendorFundraiser, on_delete=models.CASCADE, related_name='review'
    )
    reviewer = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='given_reviews'
    )
    reviewee = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='reviews'
    )
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(max_length=2000, blank=True)
    time_created = models.DateTimeField(auto_now_add=True)
