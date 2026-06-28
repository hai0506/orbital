from rest_framework import serializers
from .models import JobOffer
from listings.models import JobPost, Category
from listings.serializers import JobPostSerializer, categories_options


class CharBooleanSerializer(serializers.BooleanField):
    def to_internal_value(self, data):
        if data == 'Yes':
            return True
        elif data == 'No':
            return False
        else:
            raise serializers.ValidationError({'char_boolean': 'This field can only be Yes or No.'})

    def to_representation(self, value):
        return 'Yes' if value else 'No'


class JobOfferSerializer(serializers.ModelSerializer):
    category_list = serializers.ListField(write_only=True, required=False)
    selectedCategories = serializers.SlugRelatedField(many=True, read_only=True, slug_field='value')
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
            self.fields.pop('status')

    def create(self, validated_data):
        keyword_values = validated_data.pop('category_list', [])
        validated_data['status'] = 'pending'
        k = []
        for value in keyword_values:
            if value in categories_options:
                keyword_obj, _ = Category.objects.get_or_create(value=value)
            else:
                keyword_obj, _ = Category.objects.get_or_create(value=value.lower().capitalize())
            k.append(keyword_obj)
        offer = JobOffer.objects.create(**validated_data)
        offer.selectedCategories.set(k)
        return offer

    def validate(self, data):
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
                'id': vendor.id,
                'username': vendor.username,
                'email': vendor.email,
            }
        return rep


class OfferStatusSerializer(serializers.ModelSerializer):
    agreement = serializers.BooleanField(write_only=True)
    inventory = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = JobOffer
        fields = ['status', 'agreement', 'inventory']
