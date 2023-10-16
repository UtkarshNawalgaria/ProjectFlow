from django.contrib.auth import authenticate, get_user_model
from django.utils import timezone

from rest_framework import serializers
from rest_framework.authtoken.models import Token

from apps.organization.serializers import OrganizationListSerializer
from apps.organization.models import OrganizationUsers

from .models import OrganizationInvitation

User = get_user_model()


class UserRegistrationSerializer(serializers.Serializer):
    name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        fields = ("name", "email", "password")

    def validate_email(self, email):
        same_email_user_exists = User.objects.filter(email=email).exists()

        if same_email_user_exists:
            raise serializers.ValidationError("User with email already exists")

        return email

    def save(self, **kwargs):
        new_user = User.objects.create_user(**self.validated_data, **kwargs)
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


class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        password = attrs.get("password")
        confirm_password = attrs.get("confirm_password")

        if password != confirm_password:
            raise serializers.ValidationError({"message": "Passwords do not match."})

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        user.set_password(validated_data.get("password"))
        user.save()

        return user


class TokenSerializer(serializers.ModelSerializer):
    """
    Serializer for Token model.
    """

    class Meta:
        model = Token
        fields = ("key",)


class UserDetailSerializer(serializers.ModelSerializer):
    organizations = OrganizationListSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "email",
            "profile_pic",
            "organizations",
        )


class LimitedUserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "profile_pic",
        )


class UpdateUserProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["profile_pic"]


class OrganizationSendInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationInvitation
        fields = ("id", "email", "invited_by", "organization")
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=OrganizationInvitation.objects.all(),
                fields=("email", "invited_by", "organization"),
                message="This user has already been invited to the organization.",
            )
        ]

    def save(self, **kwargs):
        obj = super().save(**kwargs)
        obj.send_invitation_email()
        return obj


class AcceptUserInvitationSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    organization_name = serializers.CharField()

    class Meta:
        fields = ("name", "email", "password", "organization_name")

    def save(self, **kwargs):
        invitation_code: str = kwargs.get("code")
        name: str = self.validated_data.get("name")
        organization_name = self.validated_data.get("organization_name")
        invitation = OrganizationInvitation.objects.get(invitation_code=invitation_code)

        # Create user and verify their email
        user_data = {
            "email": self.validated_data.get("email"),
            "password": self.validated_data.get("password"),
            "name": name.strip(),
            "email_verified_at": timezone.now(),
        }
        user = User.objects.create_user(**user_data)
        user._organization_name = organization_name
        user.save()

        # Add user to the invitation organizer
        organization = invitation.organization
        organization.title = organization_name
        organization.save()

        OrganizationUsers.objects.create(
            organization=organization, user=user, role=OrganizationUsers.MEMBER
        )
