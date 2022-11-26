import useClient from "./client";

export type Organization = {
  id: number;
  title: number;
};

export type TMember = {
  name: string;
  email: string;
  role: "admin" | "member";
  invitation_status: "ACCEPTED" | "PENDING";
};

export default {
  getUserOrganizations: () => {
    return useClient<Organization[]>("organization/");
  },
  getMembers: (organizationId: string) => {
    return useClient<TMember[]>(`organization/${organizationId}/members`);
  },
};
