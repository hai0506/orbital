from rest_framework import serializers
from .models import *
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from datetime import datetime

class UserSerializer(serializers.ModelSerializer):
    user_type = serializers.ChoiceField(choices=['Organization','Vendor'], write_only=True)

    class Meta:
        model = User
        fields = ['id','username','password','email','user_type']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def create(self, validated_data):
        user_type = validated_data.pop('user_type')
        user = User.objects.create_user(**validated_data)
        if user_type == 'Organization':
            Organization.objects.create(user=user)
        elif user_type == 'Vendor':
            Vendor.objects.create(user=user)
        return user
    

categories_options = ["Food & Beverages",
            "Accessories",
            "Stationery",
            "Clothing",
            "Toys",
            "Books",
            "Home Decor",
            "Art & Crafts",
            "Tech Gadgets",
            "Skincare & Beauty",
            "Plants",
            "Pet Supplies",]

class JobPostSerializer(serializers.ModelSerializer):
    category_list = serializers.ListField(write_only=True, required=False)
    categories = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='value'
    )
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    start_date = serializers.DateField(
        error_messages={
            'invalid': 'Enter a valid date in the format MM-DD-YYYY.',
            'required': 'Start date is required.'
        }
    )
    end_date = serializers.DateField(
        error_messages={
            'invalid': 'Enter a valid date in the format MM-DD-YYYY.',
            'required': 'End date is required.'
        }
    )
    start_time = serializers.TimeField(
        error_messages={
            'invalid': 'Enter a valid time.',
            'required': 'Start time is required.'
        }
    )
    end_time = serializers.TimeField(
        error_messages={
            'invalid': 'Enter a valid time.',
            'required': 'End time is required.'
        }
    )

    class Meta:
        model = JobPost
        fields = [
            'post_id', 'title', 'location', 'start_date', 'end_date',
            'start_time', 'end_time', 'remarks', 'commission',
            'attachment', 'author', 'categories', 'category_list'
        ]

    def validate(self, data):
        # title
        if not data.get('title').strip():
            raise serializers.ValidationError({'title': 'Title cannot be blank.'})
        # location
        # earlier it said 'title'
        if not data.get('location').strip():
            raise serializers.ValidationError({'location': 'Location cannot be blank.'})
        # time
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        start_time = data.get('start_time')
        end_time =data.get('end_time')
        
        start_dt = datetime.combine(start_date, start_time)
        end_dt = datetime.combine(end_date, end_time)
        now=datetime.now()

        if start_date > end_date:
            raise serializers.ValidationError({'end_date': 'End date cannot be before start date.'})
        else:
            if start_dt >= end_dt:
                raise serializers.ValidationError({'end_time': 'Start time cannot be after end time.'})
        
        if start_date < now.date():
            raise serializers.ValidationError({'start_date': 'Start date cannot be in the past.'})
        elif start_date == now.date() and start_dt < now:
            raise serializers.ValidationError({'start_time': 'Start time cannot be in the past.'})
    
        return data 

    def create(self, validated_data):
        keyword_values = validated_data.pop('category_list', []) 
        
        k = []
        
    
        for value in keyword_values:
            if value in categories_options:
                keyword_obj, _ = Category.objects.get_or_create(value=value)
                k.append(keyword_obj)
            else:
                raise serializers.ValidationError({'category_list': 'Category not in specified list.'})
        post = JobPost.objects.create(**validated_data)
        post.categories.set(k)
        return post
    
class CharBooleanSerializer(serializers.BooleanField):
    def to_internal_value(self, data):
        if data == 'Yes': return True
        elif data == 'No': return False
        else: raise ValidationError({'char_boolean':'This field can only be Yes or No.'})

    def to_representation(self, value):
        return 'Yes' if value else 'No'

class JobOfferSerializer(serializers.ModelSerializer):
    category_list = serializers.ListField(write_only=True, required=False)
    selectedCategories = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='value'
    )

    vendor = serializers.PrimaryKeyRelatedField(read_only=True)
    listing = serializers.PrimaryKeyRelatedField(queryset=JobPost.objects.all())
    allDays = CharBooleanSerializer()

    class Meta:
        model = JobOffer
        fields = [
            'offer_id', 'vendor', 'listing', 'allDays', 'selectedDays',
            'selectedCategories', 'category_list', 'remarks', 'commission',
            'status', 'time_created','inventory_file'
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance is None:
            self.fields.pop('status') # dont query status on creation

    def create(self, validated_data):
        keyword_values = validated_data.pop('category_list', []) 
        validated_data['status'] = 'pending' # set default status
        k = []
        for value in keyword_values:
            if value in categories_options:
                keyword_obj, _ = Category.objects.get_or_create(value=value)
                k.append(keyword_obj)
            else:
                keyword_obj, _ = Category.objects.get_or_create(value=value.lower().capitalize())
                k.append(keyword_obj)
        offer = JobOffer.objects.create(**validated_data)
        offer.selectedCategories.set(k)
        return offer
    
    def validate(self, data):
        # if not all days must select some days off
        all_days = data.get('allDays')
        selected_days = data.get('selectedDays') or []
        if not all_days and not selected_days:
            raise serializers.ValidationError({'selectedDays': 'You must select at least one unavailable day.'})
        elif all_days and selected_days:
            raise serializers.ValidationError({'selectedDays': 'Are you available for every day of the event?'})
            
        return data
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['listing'] = JobPostSerializer(instance.listing).data
        vendor = instance.vendor
        if vendor:
            rep['vendor'] = {
                "id": vendor.id,
                "username": vendor.user.username,
                "email": vendor.user.email,
            }
        return rep

class OfferStatusSerializer(serializers.ModelSerializer):
    agreement = serializers.BooleanField(write_only=True)
    class Meta:
        model = JobOffer
        fields = ['status','inventory_file','agreement']

    def validate(self, data):
        value = data.get('status')
        file = data.get('inventory_file')
        if value not in ['pending', 'approved', 'rejected','confirmed','cancelled']:
            raise serializers.ValidationError({'status': 'Invalid status.'})
        if value == 'confirmed':
            if not file:
                raise serializers.ValidationError({'inventory_list': 'Please upload product inventory.'})
            elif (not file.name.endswith('.xlsx')) and (not file.name.endswith('.csv')):
                raise serializers.ValidationError({'inventory_list': 'Please ensure file format is either .xlsx or .csv.'})
            if not data.get('agreement'):
                raise serializers.ValidationError({'agreement': 'Please agree to the Terms and Conditions.'})
        return data
    
class FundraiserSerializer(serializers.ModelSerializer):
    listing = serializers.PrimaryKeyRelatedField(read_only=True)
    vendors = serializers.PrimaryKeyRelatedField(many=True, queryset=JobOffer.objects.all())
    class Meta:
        model = Fundraiser
        fields = ['fundraiser_id','vendors','listing']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['listing'] = JobPostSerializer(instance.listing).data
        rep['vendors'] = JobOfferSerializer(instance.vendors.all(), many=True).data
        return rep