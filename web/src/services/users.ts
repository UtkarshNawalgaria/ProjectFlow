import useClient from "./client";
import { Organization } from "./organization";

const encodeFormData = (data: Record<string, string>) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

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

export default {
  login: (email: string, password: string) => {
    return useClient<{ access_token: string }>("users/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: encodeFormData({ email, password: password }),
    });
  },
  register: (user: UserCreate) => {
    return useClient<{ message: string }>("users/signup/", {
      method: "POST",
      body: JSON.stringify(user),
    });
  },
  me: () => {
    return useClient<TAuthenticatedUser>("users/me");
  },
  invite: (email: string, organization_id: number | undefined) => {
    return useClient<{ message: string }>("users/send-invite/", {
      method: "POST",
      body: JSON.stringify({ email, organization_id }),
    });
  },
  acceptInvite: (invitationCode: string) => {
    return useClient<{
      message: string;
      email: string;
      add_new_user: boolean;
    }>("users/accept-invite/", {
      method: "POST",
      body: JSON.stringify({ code: invitationCode }),
    });
  },
  verifyEmail: (email: string, code: string) => {
    return useClient<{ message: string }>("users/verify_email/", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  },
};
