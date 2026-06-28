from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta, time
import json
from accounts.models import User
from listings.models import JobPost
from offers.models import JobOffer
from .models import Fundraiser, VendorFundraiser, Product, Transaction


class FundraiserStatusTest(APITestCase):
    def setUp(self):
        self.org_user = User.objects.create_user(
            username='orguser', password='orguser123', role='organization'
        )
        self.job_post = JobPost.objects.create(
            title='Project 1', location='Room 1',
            start_date=(timezone.now() + timedelta(days=2)).date(),
            end_date=(timezone.now() + timedelta(days=3)).date(),
            start_time=time(10, 0), end_time=time(18, 0),
            commission=20, author=self.org_user
        )
        self.fundraiser = Fundraiser.objects.create(listing=self.job_post)

    def test_status_yet_to_start(self):
        self.assertEqual(self.fundraiser.compute_status(), 'yet to start')

    def test_status_ongoing(self):
        self.job_post.start_date = timezone.now().date() - timedelta(days=1)
        self.job_post.end_date = timezone.now().date() + timedelta(days=1)
        self.job_post.save()
        self.assertEqual(self.fundraiser.compute_status(), 'ongoing')

    def test_status_concluded(self):
        self.job_post.start_date = timezone.now().date() - timedelta(days=2)
        self.job_post.end_date = timezone.now().date() - timedelta(days=1)
        self.job_post.save()
        self.assertEqual(self.fundraiser.compute_status(), 'concluded')


class ProductTest(APITestCase):
    def setUp(self):
        self.org_user = User.objects.create_user(
            username='orguser', password='orguser123', role='organization'
        )
        self.vendor_user = User.objects.create_user(
            username='vendoruser', password='vendor123', role='vendor'
        )
        self.job_post = JobPost.objects.create(
            title='Project 1', location='Room 1',
            start_date=(timezone.now() - timedelta(days=2)).date(),
            end_date=(timezone.now() + timedelta(days=3)).date(),
            start_time=time(10, 0), end_time=time(18, 0),
            commission=20, author=self.org_user
        )
        offer = JobOffer.objects.create(
            vendor=self.vendor_user, listing=self.job_post, allDays=True, commission=10, status='approved'
        )
        response = self.client.post(reverse('get_token'), {
            'username': 'vendoruser', 'password': 'vendor123'
        })
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + response.data['access'])
        self.url = reverse('edit-offer-status', args=[offer.offer_id])

    def test_create_valid_product(self):
        data = {
            'status': 'confirmed', 'agreement': 'true',
            'inventory': json.dumps([{'Item': 'Water', 'Price': 2.4, 'Quantity': 20, 'Remarks': ''}])
        }
        response = self.client.patch(self.url, data=data)
        self.assertEqual(response.status_code, 200)
        product = Product.objects.first()
        self.assertEqual(product.name, 'Water')
        self.assertEqual(product.price, 2.4)
        self.assertEqual(product.quantity, 20)

    def test_invalid_name(self):
        data = {
            'status': 'confirmed', 'agreement': 'true',
            'inventory': json.dumps([{'Item': '    ', 'Price': 2.4, 'Quantity': 20, 'Remarks': ''}])
        }
        self.assertEqual(self.client.patch(self.url, data=data).status_code, 400)

    def test_invalid_price(self):
        data = {
            'status': 'confirmed', 'agreement': 'true',
            'inventory': json.dumps([{'Item': 'Water', 'Price': -2.4, 'Quantity': 20, 'Remarks': ''}])
        }
        self.assertEqual(self.client.patch(self.url, data=data).status_code, 400)

    def test_negative_quantity(self):
        data = {
            'status': 'confirmed', 'agreement': 'true',
            'inventory': json.dumps([{'Item': 'Water', 'Price': 2.4, 'Quantity': -20, 'Remarks': ''}])
        }
        self.assertEqual(self.client.patch(self.url, data=data).status_code, 400)

    def test_non_integer_quantity(self):
        data = {
            'status': 'confirmed', 'agreement': 'true',
            'inventory': json.dumps([{'Item': 'Water', 'Price': 2.4, 'Quantity': 2.6, 'Remarks': ''}])
        }
        self.assertEqual(self.client.patch(self.url, data=data).status_code, 400)


class TransactionTest(APITestCase):
    def setUp(self):
        org_user = User.objects.create_user(
            username='orguser', password='orguser123', role='organization'
        )
        self.vendor_user = User.objects.create_user(
            username='vendoruser', password='vendor123', role='vendor'
        )
        job_post = JobPost.objects.create(
            title='Project 1', location='Room 1',
            start_date=(timezone.now() - timedelta(days=2)).date(),
            end_date=(timezone.now() + timedelta(days=3)).date(),
            start_time=time(10, 0), end_time=time(18, 0),
            commission=20, author=org_user
        )
        offer = JobOffer.objects.create(
            vendor=self.vendor_user, listing=job_post, allDays=True, commission=10, status='confirmed'
        )
        fundraiser = Fundraiser.objects.create(listing=job_post)
        self.vf = VendorFundraiser.objects.create(offer=offer, org_fundraiser=fundraiser)
        self.product1 = Product.objects.create(name='Water', quantity=20, price=2, vendor=self.vf)
        self.product2 = Product.objects.create(name='Gold', quantity=1, price=999, vendor=self.vf)

        response = self.client.post(reverse('get_token'), {
            'username': 'vendoruser', 'password': 'vendor123'
        })
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + response.data['access'])
        self.url = reverse('create-transaction', args=[self.vf.fundraiser_id])

    def test_create_valid_transaction(self):
        data = {
            'name': 'me', 'payment': 'Cash',
            'items': [
                {'product': self.product1.product_id, 'quantity': 3},
                {'product': self.product2.product_id, 'quantity': 1},
            ]
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.data['total_price'], 1005)

    def test_out_of_stock(self):
        data = {
            'name': 'me', 'payment': 'Cash',
            'items': [
                {'product': self.product1.product_id, 'quantity': 1},
                {'product': self.product2.product_id, 'quantity': 2},
            ]
        }
        self.assertEqual(self.client.post(self.url, data, format='json').status_code, 400)

    def test_missing_name(self):
        data = {
            'name': '', 'payment': 'Cash',
            'items': [{'product': self.product1.product_id, 'quantity': 1}]
        }
        self.assertEqual(self.client.post(self.url, data, format='json').status_code, 400)

    def test_invalid_payment(self):
        data = {
            'name': 'me', 'payment': 'money',
            'items': [{'product': self.product1.product_id, 'quantity': 1}]
        }
        self.assertEqual(self.client.post(self.url, data, format='json').status_code, 400)


class ReviewTest(APITestCase):
    def setUp(self):
        org_user = User.objects.create_user(
            username='orguser', password='orguser123', role='organization'
        )
        self.vendor_user = User.objects.create_user(
            username='vendoruser', password='vendor123', role='vendor'
        )
        self.org_user = org_user
        job_post = JobPost.objects.create(
            title='Project 1', location='Room 1',
            start_date=(timezone.now() - timedelta(days=2)).date(),
            end_date=(timezone.now() + timedelta(days=3)).date(),
            start_time=time(10, 0), end_time=time(18, 0),
            commission=20, author=org_user
        )
        offer = JobOffer.objects.create(
            vendor=self.vendor_user, listing=job_post, allDays=True, commission=10, status='confirmed'
        )
        fundraiser = Fundraiser.objects.create(listing=job_post)
        self.vf = VendorFundraiser.objects.create(offer=offer, org_fundraiser=fundraiser)

        response = self.client.post(reverse('get_token'), {
            'username': 'vendoruser', 'password': 'vendor123'
        })
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + response.data['access'])
        self.url = reverse('create-review', args=[self.vf.fundraiser_id])

    def test_create_valid_review(self):
        response = self.client.post(self.url, {'rating': 5, 'comment': 'nice'})
        self.assertEqual(response.status_code, 201)
        from .models import Review
        review = Review.objects.first()
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.reviewer, self.vendor_user)
        self.assertEqual(review.reviewee, self.org_user)

    def test_invalid_rating(self):
        response = self.client.post(self.url, {'rating': 10, 'comment': ''})
        self.assertEqual(response.status_code, 400)
