from django.utils.crypto import get_random_string

from rest_framework import permissions, response, status
from rest_framework.authtoken.models import Token
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.decorators import renderer_classes, api_view, permission_classes

from .serializers import (
    UserRegistrationSerializer,
    LoginSerializer,
    TokenSerializer,
    UserDetailSerializer,
)


class UserRegistrationView(CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return response.Response(
            data="User registered successfully",
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

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

        return response.Response(
            data={"access_token": serializer.data["key"]}, status=status.HTTP_200_OK
        )


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
@renderer_classes([JSONRenderer, BrowsableAPIRenderer])
def user_details(request):
    serializer = UserDetailSerializer(instance=request.user)
    return response.Response(data=serializer.data)
