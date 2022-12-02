from django.utils import timezone
from django.utils.crypto import get_random_string

from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.decorators import (
    api_view,
    permission_classes,
    parser_classes,
)
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

from .models import OrganizationInvitation, User
from .serializers import (
    OrganizationSendInvitationSerializer,
    AcceptUserInvitationSerializer,
)

from .serializers import (
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


class OrganizationSendInvitationView(CreateAPIView):
    model = OrganizationInvitation
    serializer_class = OrganizationSendInvitationSerializer

    def perform_create(self, serializer):
        invitation_code = get_random_string(length=256)
        serializer.save(sent_at=timezone.now(), invitation_code=invitation_code)


@api_view(["GET"])
def user_details(request):
    serializer = UserDetailSerializer(instance=request.user)
    return Response(data=serializer.data)


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
            return Response("Invitation has already been accepted.")
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
        return Response("User has accepted invitation and is already registered.")

    serializer = AcceptUserInvitationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(code=code)

    # Set `accepted_at` for the invitation
    invitation.accepted_at = timezone.now()
    invitation.save(update_fields=["accepted_at"])

    return Response("")
