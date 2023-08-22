import useClient from "./client";

export type Organization = {
  id: number;
  title: string;
};

export type TMember = {
  name?: string;
  email: string;
  role: "admin" | "member";
  invited_at?: string;
};

export type MemberList = {
  members: TMember[];
  invitations: TMember[];
};

export default {
  getUserOrganizations: () => {
    return useClient<Organization[]>("organization/");
  },
  updateOrganization: (
    orgId: number,
    update_data: Record<string, string | number | null>
  ) => {
    return useClient<Organization>(`organization/${orgId}/`, {
      method: "PATCH",
      body: JSON.stringify(update_data),
    });
  },
  getMembers: (organizationId: string) => {
    return useClient<MemberList>(`organization/${organizationId}/members/`);
  },
};
