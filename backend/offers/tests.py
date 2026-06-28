from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from accounts.models import User
from listings.models import JobPost, Category
from .models import JobOffer
from fundraisers.models import Fundraiser, VendorFundraiser


class JobOfferTest(APITestCase):
    def setUp(self):
        self.vendor_user = User.objects.create_user(
            username='vendor1', password='vendor123', role='vendor'
        )
        response = self.client.post(reverse('get_token'), {
            'username': 'vendor1', 'password': 'vendor123'
        })
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + response.data['access'])

        org_user = User.objects.create_user(
            username='org1', password='org123', role='organization'
        )
        self.job_post = JobPost.objects.create(
            title='Project 1', location='Room 1',
            start_date=(timezone.now() + timedelta(days=2)).date(),
            end_date=(timezone.now() + timedelta(days=3)).date(),
            start_time='10:00', end_time='18:00',
            commission=20, remarks='pls pls pls', author=org_user
        )
        Category.objects.get_or_create(value='Food & Beverages')
        self.url = reverse('create-offer')

    def test_create_offer(self):
        data = {
            'listing': self.job_post.post_id,
            'allDays': 'Yes', 'selectedDays': [],
            'category_list': ['Food & Beverages'],
            'remarks': 'hi', 'commission': 10,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobOffer.objects.count(), 1)
        self.assertEqual(JobOffer.objects.first().status, 'pending')

    def test_missing_days(self):
        data = {
            'listing': self.job_post.post_id,
            'allDays': 'No', 'selectedDays': [],
            'category_list': ['Food & Beverages'],
            'remarks': '', 'commission': 10,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('selectedDays', response.data)

    def test_allDays_and_selectedDays(self):
        data = {
            'listing': self.job_post.post_id,
            'allDays': 'Yes', 'selectedDays': ['2099-12-02'],
            'category_list': ['Food & Beverages'],
            'remarks': '', 'commission': 10,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('selectedDays', response.data)

    def test_invalid_commission(self):
        data = {
            'listing': self.job_post.post_id,
            'allDays': 'Yes', 'selectedDays': [],
            'category_list': ['Food & Beverages'],
            'remarks': '', 'commission': 500,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('commission', response.data)

    def test_category_normalised(self):
        data = {
            'listing': self.job_post.post_id,
            'allDays': 'Yes', 'selectedDays': [],
            'category_list': ['new category'],
            'remarks': '', 'commission': 10,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        offer = JobOffer.objects.first()
        self.assertTrue(offer.selectedCategories.filter(value='New category').exists())


class JobOfferStatusTest(APITestCase):
    def setUp(self):
        self.org_user = User.objects.create_user(
            username='orguser', password='orguser123', role='organization'
        )
        self.vendor_user = User.objects.create_user(
            username='vendoruser', password='vendor123', role='vendor'
        )
        self.job_post = JobPost.objects.create(
            title='Project 1', location='Room 1',
            start_date=(timezone.now() + timedelta(days=2)).date(),
            end_date=(timezone.now() + timedelta(days=3)).date(),
            start_time='10:00', end_time='18:00',
            commission=20, remarks='pls pls pls', author=self.org_user
        )

        vendor_token = self.client.post(reverse('get_token'), {
            'username': 'vendoruser', 'password': 'vendor123'
        }).data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + vendor_token)

        offer_res = self.client.post('/core/create-offer/', {
            'listing': self.job_post.post_id,
            'allDays': 'Yes', 'selectedDays': [],
            'category_list': [], 'remarks': 'gimme', 'commission': 15,
        }, format='json')
        self.offer_id = offer_res.data['offer_id']

    def test_confirm_offer_valid(self):
        response = self.client.patch(
            f'/core/edit-offer-status/{self.offer_id}/',
            {'status': 'confirmed', 'agreement': 'true'},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(JobOffer.objects.get(offer_id=self.offer_id).status, 'confirmed')
        self.assertTrue(Fundraiser.objects.filter(listing=self.job_post).exists())
        self.assertTrue(VendorFundraiser.objects.filter(offer__offer_id=self.offer_id).exists())

    def test_confirm_offer_no_agreement(self):
        response = self.client.patch(
            f'/core/edit-offer-status/{self.offer_id}/',
            {'status': 'confirmed', 'agreement': 'false'},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('agreement', response.data)

    def test_invalid_status(self):
        response = self.client.patch(
            f'/core/edit-offer-status/{self.offer_id}/',
            {'status': 'invalid-status'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('status', response.data)
