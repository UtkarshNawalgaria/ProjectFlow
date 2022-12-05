from django.contrib import admin


from .models import Organization, OrganizationUsers


class OrganizationAdmin(admin.ModelAdmin):
    model = Organization
    list_display = (
        "id",
        "title",
        "slug",
    )
    fields = ("title",)
    readonly_fields = ("slug",)


class OrganizationUsersAdmin(admin.ModelAdmin):
    model = OrganizationUsers
    list_display = (
        "user",
        "organization",
        "role",
    )


admin.site.register(Organization, OrganizationAdmin)
admin.site.register(OrganizationUsers, OrganizationUsersAdmin)
