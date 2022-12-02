from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from apps.users.models import OrganizationInvitation

from .models import Organization, OrganizationUsers
from .serializers import OrganizationListSerializer


class OrganizationListView(ListAPIView):
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


@api_view(["GET"])
@permission_classes([])
def organization_members(request, pk):
    """
    Get all the members of the organization as well as all of the
    pending invitations.
    """

    organization = Organization.objects.filter(id=pk).first()

    if not organization:
        raise ValidationError("Organization does not exist")

    org_members = organization.members

    # Get all the accepted organization members
    members = []
    for user in org_members:
        members.append(
            {
                "name": user.name,
                "email": user.email,
                "role": organization.get_role(user).upper(),
            }
        )

    # Get all pending invitations
    invitations = []
    for invite in OrganizationInvitation.objects.filter(
        organization=organization, accepted_at=None
    ):
        invitations.append(
            {
                "name": "",
                "email": invite.email,
                "role": OrganizationUsers.MEMBER.upper(),
                "invited_at": invite.sent_at,
            }
        )

    return Response({"members": members, "invitations": invitations})
