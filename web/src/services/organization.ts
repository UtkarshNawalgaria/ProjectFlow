import useClient from "./client";

export type Organization = {
  id: number;
  title: number;
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
  getMembers: (organizationId: string) => {
    return useClient<MemberList>(`organization/${organizationId}/members`);
  },
};
