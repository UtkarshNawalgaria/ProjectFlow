from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.crypto import get_random_string

from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.generics import CreateAPIView, GenericAPIView, UpdateAPIView
from rest_framework.decorators import (
    api_view,
    permission_classes,
    parser_classes,
)
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.exceptions import ValidationError

from libs.response import TextJSONResponse

from .models import OrganizationInvitation, User
from .serializers import (
    OrganizationSendInvitationSerializer,
    AcceptUserInvitationSerializer,
    ResetPasswordSerializer,
    UpdateUserProfilePictureUpdateSerializer,
    UserRegistrationSerializer,
    LoginSerializer,
    TokenSerializer,
    UserDetailSerializer,
)


class UserRegistrationView(CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = (permissions.AllowAny,)

    def perform_create(self, serializer):
        verification_code = get_random_string(length=256)
        user = serializer.save(verification_code=verification_code)
        return user


class UserLoginView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer

    def login(self):
        self.user = self.serializer.validated_data["user"]
        self.token, _ = Token.objects.get_or_create(user=self.user)

    def post(self, request, *args, **kwargs):
        self.request = request
        self.serializer = self.get_serializer(data=self.request.data)
        self.serializer.is_valid(raise_exception=True)
        self.login()
        serializer = TokenSerializer(self.token)

        return Response(
            data={"access_token": serializer.data["key"]}, status=status.HTTP_200_OK
        )


class UserUpdateView(UpdateAPIView):
    model = User
    serializer_class = UserDetailSerializer

    def get_queryset(self):
        return User.objects.filter(email_verified_at__isnull=False)

    def get_serializer_context(self):
        return {"request": self.request}


class OrganizationSendInvitationView(CreateAPIView):
    model = OrganizationInvitation
    serializer_class = OrganizationSendInvitationSerializer

    def perform_create(self, serializer):
        invitation_code = get_random_string(length=256)
        serializer.save(sent_at=timezone.now(), invitation_code=invitation_code)


@api_view(["GET"])
def user_details(request):
    serializer = UserDetailSerializer(
        instance=request.user, context={"request": request}
    )
    return Response(data=serializer.data)


@api_view(["POST"])
def update_user_profile_picture(request, pk=None):
    profile_pic = request.FILES.get("profile_pic")
    user = get_object_or_404(User, id=pk)

    if not profile_pic:
        raise ValidationError(
            detail={"message": "Pls upload an Image to update profile picture"}
        )

    serializer = UpdateUserProfilePictureUpdateSerializer(
        user, data={"profile_pic": profile_pic}, context={"request": request}
    )

    if serializer.is_valid():
        serializer.save()
        return Response(data=serializer.data, status=201)

    return Response(data={"message": "Unable to upload Image"}, status=400)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def accept_user_invitation(request, code: str):
    """
    Accept invitation.
    """

    existing_user = None

    try:
        invitation = OrganizationInvitation.objects.get(invitation_code=code)
        existing_user = User.objects.filter(email=invitation.email).last()

        if invitation.accepted_at and existing_user:
            return TextJSONResponse("Invitation has already been accepted.")
    except OrganizationInvitation.DoesNotExist:
        raise ValueError({"message": "Invalid Invitation"})

    invitation.accepted_at = timezone.now()
    invitation.save(update_fields=["accepted_at"])
    existing_user = User.objects.filter(email=invitation.email).last()

    return Response(
        {
            "user_exists": bool(existing_user),
            "email": existing_user.email if existing_user else invitation.email,
        }
    )


@api_view(["POST"])
@parser_classes([JSONParser])
@permission_classes([permissions.AllowAny])
def invited_user_join(request, code):
    """
    Create new `User` object for the user, create new organization for the
    user and also add the user to the invitations organization as a member.
    """

    invitation = OrganizationInvitation.objects.filter(invitation_code=code).first()

    if not invitation:
        raise ValueError("Invalid Invitation")

    user = User.objects.filter(email=invitation.email)

    if user.exists():
        return TextJSONResponse(
            "User has accepted invitation and is already registered."
        )

    serializer = AcceptUserInvitationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(code=code)

    # Set `accepted_at` for the invitation
    invitation.accepted_at = timezone.now()
    invitation.save(update_fields=["accepted_at"])

    return TextJSONResponse()


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def verify_account(request, code: str = None):
    """
    Verify users account when they click on the account verification
    email.
    """

    try:
        user = User.objects.get(verification_code=code)
    except User.DoesNotExist:
        raise ValidationError("Activation Token is Invalid")

    if user.email_verified_at:
        return TextJSONResponse("Account has already been activated")

    user.email_verified_at = timezone.now()
    user.save(update_fields=["email_verified_at"])

    return TextJSONResponse("Your account has been activated")


@api_view(["POST"])
def reset_password(request):
    """
    Reset user password.
    """

    serializer = ResetPasswordSerializer(
        data=request.data, context={"request": request}
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return TextJSONResponse({"message": "Password Reset Succesfully."})
