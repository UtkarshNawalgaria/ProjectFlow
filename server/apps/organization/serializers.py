from rest_framework import serializers

from .models import Organization, OrganizationUsers


class OrganizationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ("id", "title")


class OrganizationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ("id", "title", "users")
