from django.contrib.auth import authenticate, get_user_model

from rest_framework import serializers
from rest_framework.authtoken.models import Token

from apps.organization.serializers import OrganizationListSerializer

User = get_user_model()


class UserRegistrationSerializer(serializers.Serializer):
    name = serializers.CharField(required=False)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        fields = ("name", "email", "password")

    def validate(self, data):
        email = data["email"]
        same_email_user_exists = User.objects.filter(email=email).exists()

        if same_email_user_exists:
            raise serializers.ValidationError("User with email already exists")

        return data

    def save(self, **kwargs):
        email = self.validated_data["email"]
        password = self.validated_data["password"]

        new_user = User.objects.create_user(email, password, **kwargs)
        new_user.is_active = True
        new_user.save()

        return new_user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def get_auth_user(self, email, password):
        if not email or not password:
            raise serializers.ValidationError("Both email and password are required")

        user = authenticate(email=email, password=password)

        if user and not user.is_active:
            raise serializers.ValidationError("This account is currently inactive")

        if user and not user.email_verified_at:
            raise serializers.ValidationError("E-mail is not verified")

        return user

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        user = self.get_auth_user(email, password)

        if not user:
            raise serializers.ValidationError("Wrong credentials provided for login")

        attrs["user"] = user
        return attrs


class TokenSerializer(serializers.ModelSerializer):
    """
    Serializer for Token model.
    """

    class Meta:
        model = Token
        fields = ("key",)


class UserDetailSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    organizations = OrganizationListSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = ("id", "name", "email", "organizations")

    def get_name(self, obj):
        return obj.get_full_name()
