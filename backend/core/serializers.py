from rest_framework import serializers
from .models import *
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from datetime import datetime

class UserSerializer(serializers.ModelSerializer):
    user_type = serializers.ChoiceField(choices=['Organization','Vendor'], write_only=True)
    rating = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id','username','password','email','user_type','rating']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value
    
    def get_rating(self, obj):
        reviews = obj.reviews.all()
        if len(reviews) == 0: return 0
        return sum([review.rating for review in reviews]) / len(reviews)

    def create(self, validated_data):
        user_type = validated_data.pop('user_type')
        user = User.objects.create_user(**validated_data)
        if user_type == 'Organization':
            Organization.objects.create(user=user)
            Profile.objects.create(user=user, user_type='Organization')
        elif user_type == 'Vendor':
            Vendor.objects.create(user=user)
            Profile.objects.create(user=user, user_type='Vendor')
        return user
    
class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    user_type = serializers.CharField(read_only=True)
    pfp = serializers.ImageField(required=False)
    class Meta:
        model = Profile
        fields = ['user','description','pfp','user_type','username','email']

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
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['author'] = {
            'id': instance.author.user.id,
            'username': instance.author.user.username,
            'email': instance.author.user.email
        }
        return rep
    
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
            'status', 'time_created'
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
                'username': vendor.user.username,
                'email': vendor.user.email,
                'id': vendor.user.id
            }
        return rep

class OfferStatusSerializer(serializers.ModelSerializer):
    agreement = serializers.BooleanField(write_only=True)
    inventory = serializers.ListField(write_only=True, required=False)
    class Meta:
        model = JobOffer
        fields = ['status','agreement','inventory']
    
class ProductSerializer(serializers.ModelSerializer):
    vendor=serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Product
        fields = ['product_id','name', 'quantity', 'price', 'image', 'vendor','remarks']
    
class ProductUpdateSerializer(serializers.ModelSerializer):
    item = serializers.CharField(source='name')
    maxQuantity = serializers.IntegerField(source='quantity', read_only=True)

    class Meta:
        model = Product
        fields = ['product_id', 'item', 'quantity', 'price', 'remarks', 'maxQuantity']

class FundraiserSerializer(serializers.ModelSerializer):
    listing = JobPostSerializer(read_only=True)
    vendors = serializers.SerializerMethodField()
    status = serializers.CharField(read_only=True)
    reviews = serializers.SerializerMethodField()
    class Meta:
        model = Fundraiser
        fields = ['fundraiser_id','vendors','listing','status','reviews']

    def get_vendors(self, obj):
        vendors = VendorFundraiser.objects.filter(org_fundraiser=obj)
        return VendorFundraiserSerializer(vendors, many=True).data
    
    def get_reviews(self, obj):
        reviews = Review.objects.filter(vendor_fundraiser__org_fundraiser=obj,reviewee=obj.listing.author.user)
        return ReviewSerializer(reviews, many=True).data

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['vendors'] = VendorFundraiserSerializer(instance.vendors.all(), context=self.context, many=True).data
        return rep
    
class VendorFundraiserSerializer(serializers.ModelSerializer):
    offer = JobOfferSerializer(read_only=True)
    inventory = serializers.SerializerMethodField()
    org_fundraiser = serializers.PrimaryKeyRelatedField(read_only=True)
    transactions = serializers.SerializerMethodField()
    status = serializers.CharField(source='org_fundraiser.status', read_only=True)
    revenue = serializers.SerializerMethodField()
    review_sent = serializers.SerializerMethodField()
    review_received = serializers.SerializerMethodField()
    class Meta:
        model = VendorFundraiser
        fields = ['fundraiser_id','offer','revenue','inventory','org_fundraiser','transactions','status','review_sent','review_received']

    def get_inventory(self, obj):
        products = Product.objects.filter(vendor=obj)
        return ProductSerializer(products, many=True).data
    
    def get_transactions(self, obj):
        trs = Transaction.objects.filter(vendor=obj)
        return TransactionSerializer(trs, many=True).data
    
    def get_revenue(self, obj):
        transactions = obj.transactions.all()
        total = 0
        for transaction in transactions:
            for item in transaction.items.all():
                total += item.product.price * item.quantity
        return total
    
    def get_review_sent(self, obj):
        reviews = Review.objects.filter(vendor_fundraiser=obj, reviewer=obj.offer.vendor.user)
        if len(reviews)>0: return ReviewSerializer(reviews.first()).data

    def get_review_received(self, obj):
        reviews = Review.objects.filter(vendor_fundraiser=obj, reviewee=obj.offer.vendor.user)
        if len(reviews)>0: return ReviewSerializer(reviews.first()).data
    
class TransactionItemSerializer(serializers.ModelSerializer):
    transaction = serializers.PrimaryKeyRelatedField(read_only=True)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    total_price = serializers.SerializerMethodField()
    class Meta:
        model = TransactionItem
        fields = ['transaction','product','quantity','total_price']

    def get_total_price(self, obj):
        return obj.quantity * obj.product.price
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['product'] = ProductSerializer(instance.product).data
        return rep
    
class TransactionSerializer(serializers.ModelSerializer):
    vendor = serializers.PrimaryKeyRelatedField(read_only=True)
    items = TransactionItemSerializer(many=True,write_only=True)
    total_price = serializers.SerializerMethodField()
    class Meta:
        model = Transaction
        fields = ['transaction_id','name','phone','email','payment','vendor','items','time_created','total_price']

    def get_total_price(self, obj):
        return sum(item.total_price() for item in obj.items.all())

    def validate(self, data):
        payment = data.get('payment')
        if payment not in ['PayLah','PayNow','Cash','NETS','Card','Others']:
            raise serializers.ValidationError({'payment': 'Invalid payment type.'})
        items = data.get('items')
        for item in items:
            product = item['product']
            quantity = item['quantity']
            if quantity <= 0:
                raise serializers.ValidationError({'quantity': 'Quantity cannot be 0.'})
            elif product.quantity < quantity:
                raise serializers.ValidationError({'quantity': f'Not enough stock for {product.name}.'})
        return data
    
    def create(self, validated_data):
        items = validated_data.pop('items')
        transaction = Transaction.objects.create(**validated_data)
        for item in items:
            product = item['product']
            quantity = item['quantity']
            product.quantity -= quantity
            product.save()
            TransactionItem.objects.create(transaction=transaction,product=product,quantity=quantity)

        return transaction
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['items']=TransactionItemSerializer(instance.items, many=True).data
        return rep
    
class MessageSerializer(serializers.ModelSerializer):
    sender=UserSerializer(read_only=True)
    receiver=UserSerializer(read_only=True)
    class Meta:
        model = Message
        fields = ['message_id','sender','receiver','content','time_created','read']

class ChatSerializer(serializers.Serializer):
    chat_history = MessageSerializer(many=True)
    me = UserSerializer()
    other = UserSerializer()
    received = serializers.SerializerMethodField()
    preview = serializers.SerializerMethodField()

    def get_received(self, obj):
        chat = obj['chat_history']
        if not chat or len(chat) < 1:
            return False
        return chat[len(chat)-1].sender != obj['me']
    
    def get_preview(self, obj):
        chat = obj['chat_history']
        if not chat:
            return ''
        content = chat[len(chat)-1].content
        return content if len(content) <= 30 else content[:27] + '...'
    
class ReviewSerializer(serializers.ModelSerializer):
    vendor_fundraiser = serializers.PrimaryKeyRelatedField(read_only=True)
    reviewer = serializers.PrimaryKeyRelatedField(read_only=True)
    reviewee = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = Review
        fields = ['review_id','vendor_fundraiser','reviewer','reviewee','time_created','rating','comment']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['reviewer'] = {'username': instance.reviewer.username}
        reviewee = instance.reviewee
        if reviewee:
            rep['reviewee'] = {'username': reviewee.username}
        return rep