import useClient from "./client";
import { Organization } from "./organization";

export type UserCreate = {
  name: string;
  email: string;
  password: string;
};

export type TAuthenticatedUser = {
  id: number;
  name: string;
  email: string;
  profile_pic: string;
  organizations: Organization[];
};

export type AssociatedUsersList = {
  role: string;
  user: Pick<TAuthenticatedUser, "id" | "profile_pic" | "name">;
}[];

export type InvitedUser = Required<UserCreate & { organization_name: string }>;

export default {
  login: (email: string, password: string) => {
    return useClient<{ access_token: string }>("users/login/", {
      method: "POST",
      body: JSON.stringify({ email, password: password }),
    });
  },
  register: (user: UserCreate) => {
    return useClient<Omit<UserCreate, "password">>("users/signup/", {
      method: "POST",
      body: JSON.stringify(user),
    });
  },
  me: () => {
    return useClient<TAuthenticatedUser>("users/me/");
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
  verifyAccount: (code: string) => {
    return useClient(`users/verify/${code}/`);
  },
  addInvitedUser: (invitationCode: string, data: InvitedUser) => {
    return useClient<null>(`users/join/${invitationCode}/`, {
      method: "POST",
      body: JSON.stringify({ ...data }),
    });
  },
  updateUser: (
    userId: number,
    user: Omit<TAuthenticatedUser, "profile_pic">
  ) => {
    return useClient<TAuthenticatedUser>(`users/${userId}/`, {
      method: "PATCH",
      body: JSON.stringify({ ...user }),
    });
  },
};
