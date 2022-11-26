from rest_framework import generics
from rest_framework.response import Response


from .models import Organization
from .serializers import OrganizationListSerializer


class OrganizationListView(generics.ListAPIView):
    model = Organization
    serializer_class = OrganizationListSerializer

    def get_serializer_context(self):
        return {"request": self.request, "user": self.request.user}

    def get_queryset(self):
        return self.request.user.organizations.all()

    def list(self, request, *args, **kwargs):
        user_organizations = self.get_queryset()
        serializer = OrganizationListSerializer(user_organizations, many=True)
        return Response(serializer.data)
