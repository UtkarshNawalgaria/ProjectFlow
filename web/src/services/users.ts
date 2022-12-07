import useClient from "./client";
import { Organization } from "./organization";

export type UserCreate = {
  name?: string;
  email: string;
  password: string;
};

export type TAuthenticatedUser = {
  id: number;
  name: string;
  email: string;
  organizations: Organization[];
};

export type InvitedUser = Required<UserCreate & { organization_name: string }>;

export default {
  login: (email: string, password: string) => {
    return useClient<{ access_token: string }>("users/login/", {
      method: "POST",
      body: JSON.stringify({ email, password: password }),
    });
  },
  register: (user: UserCreate) => {
    return useClient("users/signup/", {
      method: "POST",
      body: JSON.stringify(user),
    });
  },
  me: () => {
    return useClient<TAuthenticatedUser>("users/me");
  },
  invite: (email: string, organizationId: number, invited_by: number) => {
    return useClient("users/send-invite/", {
      method: "POST",
      body: JSON.stringify({ email, organization: organizationId, invited_by }),
    });
  },
  acceptInvite: (invitationCode: string) => {
    return useClient<{
      email: string;
      user_exists: boolean;
    }>(`users/accept-invite/${invitationCode}/`);
  },
  verifyEmail: (email: string, code: string) => {
    return useClient<{ message: string }>("users/verify_email/", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  },
  addInvitedUser: (invitationCode: string, data: InvitedUser) => {
    return useClient(`users/join/${invitationCode}/`, {
      method: "POST",
      body: JSON.stringify({ ...data }),
    });
  },
};
