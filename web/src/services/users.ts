import client from "./client";

const encodeFormData = (data: { [key: string]: string }) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

export type UserCreate = {
  name?: string;
  email: string;
  password: string;
};

export type UserProfile = {
  id: number;
  user: {
    id: number;
    name: string;
    email: number;
  };
};

export default {
  login: (email: string, password: string) => {
    return client<{ access_token: string; token_type: string }>("auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: encodeFormData({ username: email, password: password }),
    });
  },
  register: (user: UserCreate) => {
    return client<{ message: string }>("auth/register/", {
      method: "POST",
      body: JSON.stringify(user),
    });
  },
  me: () => {
    return client<UserProfile>("user/me/");
  },
};
