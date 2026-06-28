from rest_framework import serializers
from .models import Fundraiser, VendorFundraiser, Product, Transaction, TransactionItem, Review
from listings.serializers import JobPostSerializer
from offers.serializers import JobOfferSerializer


class ProductSerializer(serializers.ModelSerializer):
    vendor = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Product
        fields = ['product_id', 'name', 'quantity', 'price', 'image', 'vendor', 'remarks']


class ProductUpdateSerializer(serializers.ModelSerializer):
    item = serializers.CharField(source='name')
    maxQuantity = serializers.IntegerField(source='quantity', read_only=True)

    class Meta:
        model = Product
        fields = ['product_id', 'item', 'quantity', 'price', 'remarks', 'maxQuantity']


class ReviewSerializer(serializers.ModelSerializer):
    vendor_fundraiser = serializers.PrimaryKeyRelatedField(read_only=True)
    reviewer = serializers.PrimaryKeyRelatedField(read_only=True)
    reviewee = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['review_id', 'vendor_fundraiser', 'reviewer', 'reviewee', 'time_created', 'rating', 'comment']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['reviewer'] = {'username': instance.reviewer.username}
        if instance.reviewee:
            rep['reviewee'] = {'username': instance.reviewee.username}
        return rep


class TransactionItemSerializer(serializers.ModelSerializer):
    transaction = serializers.PrimaryKeyRelatedField(read_only=True)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = TransactionItem
        fields = ['transaction', 'product', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.quantity * obj.product.price

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['product'] = ProductSerializer(instance.product).data
        return rep


class TransactionSerializer(serializers.ModelSerializer):
    vendor = serializers.PrimaryKeyRelatedField(read_only=True)
    items = TransactionItemSerializer(many=True, write_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ['transaction_id', 'name', 'phone', 'email', 'payment', 'vendor', 'items', 'time_created', 'total_price']

    def get_total_price(self, obj):
        return sum(item.total_price() for item in obj.items.all())

    def validate(self, data):
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
            TransactionItem.objects.create(transaction=transaction, product=product, quantity=quantity)
        return transaction

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['items'] = TransactionItemSerializer(instance.items, many=True).data
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
        fields = [
            'fundraiser_id', 'offer', 'revenue', 'inventory',
            'org_fundraiser', 'transactions', 'status', 'review_sent', 'review_received'
        ]

    def get_inventory(self, obj):
        return ProductSerializer(Product.objects.filter(vendor=obj), many=True).data

    def get_transactions(self, obj):
        return TransactionSerializer(Transaction.objects.filter(vendor=obj), many=True).data

    def get_revenue(self, obj):
        total = 0
        for transaction in obj.transactions.all():
            for item in transaction.items.all():
                total += item.product.price * item.quantity
        return total

    def get_review_sent(self, obj):
        reviews = Review.objects.filter(vendor_fundraiser=obj, reviewer=obj.offer.vendor)
        if reviews.exists():
            return ReviewSerializer(reviews.first()).data

    def get_review_received(self, obj):
        reviews = Review.objects.filter(vendor_fundraiser=obj, reviewee=obj.offer.vendor)
        if reviews.exists():
            return ReviewSerializer(reviews.first()).data


class FundraiserSerializer(serializers.ModelSerializer):
    listing = JobPostSerializer(read_only=True)
    vendors = serializers.SerializerMethodField()
    status = serializers.CharField(read_only=True)
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = Fundraiser
        fields = ['fundraiser_id', 'vendors', 'listing', 'status', 'reviews']

    def get_vendors(self, obj):
        vendors = VendorFundraiser.objects.filter(org_fundraiser=obj)
        return VendorFundraiserSerializer(vendors, many=True).data

    def get_reviews(self, obj):
        reviews = Review.objects.filter(
            vendor_fundraiser__org_fundraiser=obj,
            reviewee=obj.listing.author
        )
        return ReviewSerializer(reviews, many=True).data

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['vendors'] = VendorFundraiserSerializer(instance.vendors.all(), context=self.context, many=True).data
        return rep
