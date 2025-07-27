from django.test import TestCase
from rest_framework.test import APITestCase
from .models import *
from django.urls import reverse
from rest_framework import status
from django.utils import timezone
from datetime import timedelta, time
import json

# Create your tests here.
class AuthTest(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('get_token')
        self.user_data = {
            'username': 'user',
            'password': 'fhsjhd353',
            'email': 'a@a.com'
        }
        user = User.objects.create_user(**self.user_data)
        self.user_profile = Organization.objects.create(user=user) # org type

    def test_register(self):
        response = self.client.post(self.register_url, {
            'username': 'user',
            'password': 'gdhfjsad35',
            'email': 'u@u.com',
            'user_type': 'Vendor'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) # duplicate username
        response = self.client.post(self.register_url, {
            'username': 'user2',
            'password': 'password',
            'email': 'u@u.com',
            'user_type': 'Vendor'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) # bad password
        response = self.client.post(self.register_url, {
            'username': 'user2',
            'password': '1',
            'email': 'u@u.com',
            'user_type': 'Vendor'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) # bad password
        response = self.client.post(self.register_url, {
            'username': 'user2',
            'password': 'gdhfjsad35',
            'email': 'u@u.com',
            'user_type': 'Vendor'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) # register successful
        user = User.objects.get(username='user2')
        self.assertTrue(Vendor.objects.filter(user=user).exists()) # check correct user type (vendor)

        response = self.client.post(self.register_url, {
            'username': 'user3',
            'password': 'adghdge542',
            'email': 's@s.com',
            'user_type': 'Organization'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) # register successful
        user = User.objects.get(username='user3')
        self.assertTrue(Organization.objects.filter(user=user).exists()) # check correct user type (student)


    def test_login(self):
        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK) # login successful
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        user = User.objects.get(username=self.user_data['username'])
        self.assertTrue(Organization.objects.filter(user=user).exists()) # check user type (student)
        self.assertFalse(Vendor.objects.filter(user=user).exists()) 

        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED) # wrong password

class JobPostTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='orguser', password='orguser123', email='org@org.com')
        self.org = Organization.objects.create(user=self.user)
        response = self.client.post(reverse('get_token'), {
            'username': 'orguser',
            'password': 'orguser123'
        })
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)

        self.url = reverse('create-post')

        self.valid_data = {
            'title': 'Project 1',
            'location': 'Room 1',
            'start_date': (timezone.now() + timedelta(days=2)).date().strftime('%Y-%m-%d'),
            'end_date': (timezone.now() + timedelta(days=3)).date().strftime('%Y-%m-%d'),
            'start_time': '10:00',
            'end_time': '18:00',
            'commission': 20,
            'remarks': 'pls pls pls',
            'category_list': ['Food & Beverages', 'Art & Crafts']
        }

    def post_data(self, overrides={}):
        data = self.valid_data.copy()
        data.update(overrides)
        return self.client.post(self.url, data)

    def test_title_lcoation_blank(self):
        res = self.post_data({'title': ''})
        self.assertEqual(res.status_code, 400)
        self.assertIn('title', res.data)

        res = self.post_data({'location': '         '})
        self.assertEqual(res.status_code, 400)
        self.assertIn('location', res.data)

    def test_datetime_empty(self):
        res = self.post_data({'start_date': '', 'end_date': ''})
        self.assertEqual(res.status_code, 400)
        self.assertIn('start_date', res.data)
        self.assertIn('end_date', res.data)

        res = self.post_data({'start_time': '', 'end_time': ''})
        self.assertEqual(res.status_code, 400)
        self.assertIn('start_time', res.data)
        self.assertIn('end_time', res.data)

    def test_startdate_after_enddate(self):
        res = self.post_data({
            'start_date': (timezone.now() + timedelta(days=5)).date().strftime('%Y-%m-%d'),
            'end_date': (timezone.now() + timedelta(days=2)).date().strftime('%Y-%m-%d'),
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn('end_date', res.data)
        self.assertEqual(res.data['end_date'][0], 'End date cannot be before start date.')

    def test_starttime_after_endtime(self):
        date = (timezone.now() + timedelta(days=2)).date().strftime('%Y-%m-%d')
        res = self.post_data({
            'start_date': date,
            'end_date': date,
            'start_time': '18:00:00',
            'end_time': '10:00:00',
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn('end_time', res.data)
        self.assertEqual(res.data['end_time'][0], 'Start time cannot be after end time.')

    def test_startdate_past(self):
        res = self.post_data({
            'start_date': (timezone.now() - timedelta(days=1)).date().strftime('%Y-%m-%d')
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn('start_date', res.data)
        self.assertEqual(res.data['start_date'][0], 'Start date cannot be in the past.')

    def test_starttime_past(self):
        now = timezone.localtime()
        today = now.date().strftime('%Y-%m-%d')
        time_in_past = (now - timedelta(hours=1)).time().strftime('%H:%M:%S')
        time_future = (now + timedelta(hours=1)).time().strftime('%H:%M:%S')

        res = self.post_data({
            'start_date': today,
            'start_time': time_in_past,
            'end_time': time_future,
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn('start_time', res.data)
        self.assertEqual(res.data['start_time'][0], 'Start time cannot be in the past.')

    def test_commission(self):
        res = self.post_data({'commission': -10})
        self.assertEqual(res.status_code, 400)
        self.assertIn('commission', res.data)

        res = self.post_data({'commission': 150})
        self.assertEqual(res.status_code, 400)
        self.assertIn('commission', res.data)

        res = self.post_data({'commission': 'abc'})
        self.assertEqual(res.status_code, 400)
        self.assertIn('commission', res.data)

    def test_field_too_long(self):
        long_remarks = 'a' * 3000
        res = self.post_data({'remarks': long_remarks})
        self.assertEqual(res.status_code, 400)
        self.assertIn('remarks', res.data)
        self.assertTrue('Ensure this field has no more than' in res.data['remarks'][0])

    def test_successful_post_creation(self):
        res = self.post_data()
        self.assertEqual(res.status_code, 201)
        self.assertIn('post_id', res.data)
        self.assertEqual(res.data['title'], self.valid_data['title'])

class JobOfferTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='vendor1', password='vendor123')
        self.vendor = Vendor.objects.create(user=self.user)

        response = self.client.post(reverse('get_token'), {
            'username': 'vendor1',
            'password': 'vendor123'
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        org_user = User.objects.create_user(username='org1', password='org123')
        org = Organization.objects.create(user=org_user)
        self.job_post = JobPost.objects.create(
            title= 'Project 1',
            location= 'Room 1',
            start_date= (timezone.now() + timedelta(days=2)).date().strftime('%Y-%m-%d'),
            end_date= (timezone.now() + timedelta(days=3)).date().strftime('%Y-%m-%d'),
            start_time= '10:00',
            end_time= '18:00',
            commission= 20,
            remarks= 'pls pls pls',
            author=org
        )
        Category.objects.create(value='Food & Beverages')
        Category.objects.create(value='Art & Crafts')
        self.job_post.categories.set(['Food & Beverages', 'Art & Crafts'])
        self.url = reverse('create-offer')

    def test_create_offer(self):
        data = {
            'listing': self.job_post.post_id,
            'allDays': 'Yes',
            'selectedDays': [],
            'category_list': ['Food & Beverages'],
            'remarks': 'hi',
            'commission': 10,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobOffer.objects.count(), 1)
        self.assertEqual(JobOffer.objects.first().status, 'pending')

    def test_missing_days(self):
        data = {
            'listing': self.job_post.post_id,
            'allDays': 'No',
            'selectedDays': [],
            'category_list': ['Food & Beverages'],
            'remarks': '',
            'commission': 10,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('selectedDays', response.data)

    def test_allDays_selected(self):
        data = {
            'listing': self.job_post.post_id,
            'allDays': 'Yes',
            'selectedDays': ['2099-12-02'],
            'category_list': ['Food & Beverages'],
            'remarks': '',
            'commission': 10,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('selectedDays', response.data)

    def test_invalid_commission(self):
        data = {
            'listing': self.job_post.post_id,
            'allDays': 'Yes',
            'selectedDays': [],
            'category_list': ['Food & Beverages'],
            'remarks': '',
            'commission': 500,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('commission', response.data)

    def test_category(self):
        data = {
            'listing': self.job_post.post_id,
            'allDays': 'Yes',
            'selectedDays': [],
            'category_list': ['new category'],
            'remarks': '',
            'commission': 10,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        offer = JobOffer.objects.first()
        self.assertTrue(offer.selectedCategories.filter(value='New category').exists())

class JobOfferStatusTest(APITestCase):
    def setUp(self):
        self.org_user = User.objects.create_user(username='orguser', password='orguser123')
        self.org = Organization.objects.create(user=self.org_user)
        self.vendor_user = User.objects.create_user(username='vendoruser', password='vendor123')
        self.vendor = Vendor.objects.create(user=self.vendor_user)

        self.job_post = JobPost.objects.create(
            title= 'Project 1',
            location= 'Room 1',
            start_date= (timezone.now() + timedelta(days=2)).date().strftime('%Y-%m-%d'),
            end_date= (timezone.now() + timedelta(days=3)).date().strftime('%Y-%m-%d'),
            start_time= '10:00',
            end_time= '18:00',
            commission= 20,
            remarks= 'pls pls pls',
            author=self.org
        )
        Category.objects.create(value='Food & Beverages')
        Category.objects.create(value='Art & Crafts')
        self.job_post.categories.set(['Food & Beverages', 'Art & Crafts'])

        vendor_token = self.client.post(reverse('get_token'), {
            'username': 'vendoruser',
            'password': 'vendor123'
        }).data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + vendor_token)

        self.offer_response = self.client.post('/core/create-offer/', {
            'listing': self.job_post.post_id,
            'allDays': 'Yes',
            'selectedDays': [],
            'category_list': [],
            'remarks': 'gimme',
            'commission': 15,
        }, format='json')
        self.offer_id = self.offer_response.data['offer_id']

        self.client.credentials()
        token = self.client.post(reverse('get_token'), {
            'username': 'vendoruser',
            'password': 'vendor123'
        }).data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    def test_confirm_offer_valid(self):
        data = {
            'status': 'confirmed',
            'agreement': 'true'
        }
        response = self.client.patch(f'/core/edit-offer-status/{self.offer_id}/', data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(JobOffer.objects.get(offer_id=self.offer_id).status, 'confirmed')
        self.assertTrue(Fundraiser.objects.filter(listing=self.job_post).exists()) # test fundraiser creation
        self.assertTrue(VendorFundraiser.objects.filter(offer__offer_id=self.offer_id).exists()) # test vendorfundraiser creation

    def test_confirm_offer_no_agreement(self):
        data = {
            'status': 'confirmed',
            'agreement': 'false'
        }
        response = self.client.patch(f'/core/edit-offer-status/{self.offer_id}/', data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('agreement', response.data)

    def test_other_statuses(self):
        for status_val in ['pending', 'approved', 'rejected','confirmed','cancelled']:
            data = {
                'status': status_val
            }
            response = self.client.patch(f'/core/edit-offer-status/{self.offer_id}/', data, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(JobOffer.objects.get(offer_id=self.offer_id).status, status_val)

    def test_invalid_status(self):
        data = {
            'status': 'invalid-status'
        }
        response = self.client.patch(f'/core/edit-offer-status/{self.offer_id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('status', response.data)

class FundraiserTest(APITestCase):
    def setUp(self):
        self.org_user = User.objects.create_user(username='orguser', password='orguser123')
        self.org = Organization.objects.create(user=self.org_user)      
        self.job_post = JobPost.objects.create(
            title= 'Project 1',
            location= 'Room 1',
            start_date= (timezone.now() + timedelta(days=2)),
            end_date= (timezone.now() + timedelta(days=3)),
            start_time=time(10, 0),
            end_time=time(18, 0),
            commission= 20,
            remarks= 'pls pls pls',
            author=self.org
        )
        self.fundraiser = Fundraiser.objects.create(listing=self.job_post)

    def test_status_yet_to_start(self):
        self.assertEqual(self.fundraiser.status, 'yet to start')

    def test_status_ongoing(self):
        self.job_post.start_date = timezone.now().date() - timedelta(days=1)
        self.job_post.end_date = timezone.now().date() + timedelta(days=1)
        self.job_post.save()
        self.assertEqual(self.fundraiser.status, 'ongoing')

    def test_status_concluded(self):
        self.job_post.start_date = timezone.now().date() - timedelta(days=2)
        self.job_post.end_date = timezone.now().date() - timedelta(days=1)
        self.job_post.save()
        self.assertEqual(self.fundraiser.status, 'concluded')

class ProductTest(APITestCase):
    def setUp(self):
        self.org_user = User.objects.create_user(username='orguser', password='orguser123')
        self.org = Organization.objects.create(user=self.org_user)      
        self.vendor_user = User.objects.create_user(username='vendoruser', password='vendor123')
        self.vendor = Vendor.objects.create(user=self.vendor_user)

        self.job_post = JobPost.objects.create(
            title= 'Project 1',
            location= 'Room 1',
            start_date= (timezone.now() - timedelta(days=2)),
            end_date= (timezone.now() + timedelta(days=3)),
            start_time=time(10, 0),
            end_time=time(18, 0),
            commission= 20,
            remarks= 'pls pls pls',
            author=self.org
        )
        offer = JobOffer.objects.create(
            vendor=self.vendor, listing=self.job_post,
            allDays=True, commission=10, status='accepted'
        )

        response = self.client.post(reverse('get_token'), {
            'username': 'vendoruser',
            'password': 'vendor123'
        })
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)

        self.url = reverse('edit-offer-status',args=[offer.offer_id])

    def test_create_valid_product(self):
        data = {
            "status":"confirmed",
            "agreement":"true",
            "inventory": json.dumps([
                {
                    "Item": "Water",
                    "Price": 2.4,
                    "Quantity": 20,
                    "Remarks":""
                }
            ])
        }
        response = self.client.patch(self.url,data=data)
        self.assertEqual(response.status_code, 200)
        review = Product.objects.first()
        self.assertEqual(review.name, 'Water')
        self.assertEqual(review.price, 2.4)
        self.assertEqual(review.quantity, 20)
        self.assertEqual(review.vendor.offer.vendor, self.vendor)

    def test_invalid_name(self):
        data = {
            "status":"confirmed",
            "agreement":"true",
            "inventory": json.dumps([
                {
                    "Item": "    ",
                    "Price": 2.4,
                    "Quantity": 20,
                    "Remarks":""
                }
            ])
        }
        response = self.client.patch(self.url,data=data)
        self.assertEqual(response.status_code, 400)

    def test_invalid_price(self):
        data = {
            "status":"confirmed",
            "agreement":"true",
            "inventory": json.dumps([
                {
                    "Item": "Water",
                    "Price": -2.4,
                    "Quantity": 20,
                    "Remarks":""
                }
            ])
        }
        response = self.client.patch(self.url,data=data)
        self.assertEqual(response.status_code, 400)

    def test_negative_quantity(self):
        data = {
            "status":"confirmed",
            "agreement":"true",
            "inventory": json.dumps([
                {
                    "Item": "Water",
                    "Price": 2.4,
                    "Quantity": -20,
                    "Remarks":""
                }
            ])
        }
        response = self.client.patch(self.url,data=data)
        self.assertEqual(response.status_code, 400)

    def test_invalid_quantity(self):
        data = {
            "status":"confirmed",
            "agreement":"true",
            "inventory": json.dumps([
                {
                    "Item": "Water",
                    "Price": 2.4,
                    "Quantity": 2.6,
                    "Remarks":""
                }
            ])
        }
        response = self.client.patch(self.url,data=data)
        self.assertEqual(response.status_code, 400)

class TransactionTest(APITestCase):
    def setUp(self):
        self.org_user = User.objects.create_user(username='orguser', password='orguser123')
        self.org = Organization.objects.create(user=self.org_user)      
        self.vendor_user = User.objects.create_user(username='vendoruser', password='vendor123')
        self.vendor = Vendor.objects.create(user=self.vendor_user)

        self.job_post = JobPost.objects.create(
            title= 'Project 1',
            location= 'Room 1',
            start_date= (timezone.now() - timedelta(days=2)),
            end_date= (timezone.now() + timedelta(days=3)),
            start_time=time(10, 0),
            end_time=time(18, 0),
            commission= 20,
            remarks= 'pls pls pls',
            author=self.org
        )
        offer = JobOffer.objects.create(
            vendor=self.vendor, listing=self.job_post,
            allDays=True, commission=10, status='accepted'
        )
        self.fundraiser = Fundraiser.objects.create(listing=self.job_post)
        self.vf = VendorFundraiser.objects.create(offer=offer, org_fundraiser=self.fundraiser)
        self.product1 = Product.objects.create(name='Water', quantity=20, price=2, vendor=self.vf)
        self.product2 = Product.objects.create(name='Gold', quantity=1, price=999, vendor=self.vf)

        response = self.client.post(reverse('get_token'), {
            'username': 'vendoruser',
            'password': 'vendor123'
        })
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)

        self.url = reverse('create-transaction', args=[self.vf.fundraiser_id])

    def test_create_valid_transaction(self):
        data = {
            'name':'me',
            'payment':'Cash',
            'items':[
                {
                    'product':self.product1.product_id,
                    'quantity':3
                },
                {
                    'product':self.product2.product_id,
                    'quantity':1
                }
            ]
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.data['total_price'], 1005)

    def test_out_of_stock_transaction(self):
        data = {
            'name':'me',
            'payment':'Cash',
            'items':[
                {
                    'product':self.product1.product_id,
                    'quantity':1
                },
                {
                    'product':self.product2.product_id,
                    'quantity':2
                }
            ]
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 400)

    def test_missing_name_transaction(self):
        data = {
            'name':'',
            'payment':'Cash',
            'items':[
                {
                    'product':self.product1.product_id,
                    'quantity':1
                },
                {
                    'product':self.product2.product_id,
                    'quantity':1
                }
            ]
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 400)

    def test_invalid_payment_transaction(self):
        data = {
            'name':'me',
            'payment':'money',
            'items':[
                {
                    'product':self.product1.product_id,
                    'quantity':1
                },
                {
                    'product':self.product2.product_id,
                    'quantity':1
                }
            ]
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 400)

class ReviewTest(APITestCase):
    def setUp(self):
        self.org_user = User.objects.create_user(username='orguser', password='orguser123')
        self.org = Organization.objects.create(user=self.org_user)      
        self.vendor_user = User.objects.create_user(username='vendoruser', password='vendor123')
        self.vendor = Vendor.objects.create(user=self.vendor_user)

        self.job_post = JobPost.objects.create(
            title= 'Project 1',
            location= 'Room 1',
            start_date= (timezone.now() - timedelta(days=2)),
            end_date= (timezone.now() + timedelta(days=3)),
            start_time=time(10, 0),
            end_time=time(18, 0),
            commission= 20,
            remarks= 'pls pls pls',
            author=self.org
        )
        offer = JobOffer.objects.create(
            vendor=self.vendor, listing=self.job_post,
            allDays=True, commission=10, status='accepted'
        )
        self.fundraiser = Fundraiser.objects.create(listing=self.job_post)
        self.vf = VendorFundraiser.objects.create(offer=offer, org_fundraiser=self.fundraiser)

        response = self.client.post(reverse('get_token'), {
            'username': 'vendoruser',
            'password': 'vendor123'
        })
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)

        self.url = reverse('create-review', args=[self.vf.fundraiser_id])

    def test_create_valid_review(self):
        data = {
            'rating': 5,
            'comment': 'nice',
            'reviewee': self.org_user.id
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 201)
        review = Review.objects.first()
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.comment, 'nice')
        self.assertEqual(review.reviewer, self.vendor_user)
        self.assertEqual(review.reviewee, self.org_user)

    def test_invalid_rating(self):
        data = {
            'rating': 10,
            'comment': '',
            'reviewee': self.org_user.id
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)