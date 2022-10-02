import { createContext, useContext, useState } from "react";
import client, { authTokenKey } from "../services/client";

const encodeFormData = (data: { [key: string]: string }) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

export type TAuth = {
  email?: string;
  accessToken: string;
};

export type AuthContextType = {
  auth: TAuth | null;
  redirectUrl: string;
  login: (username: string, password: string) => void;
  verifyToken: () => void;
  setAuth: (auth: TAuth | null, logout?: boolean) => void;
  logout?: () => void;
};

type Props = {
  children: JSX.Element;
  redirectUrl: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

// eslint-disable-next-line react/prop-types
export const AuthProvider: React.FC<Props> = ({ children, redirectUrl }) => {
  const [value, setValue] = useState<AuthContextType["auth"] | null>(() => {
    const accessToken = window.localStorage.getItem(authTokenKey);
    return accessToken ? { accessToken } : null;
  });

  function setAuth(auth: TAuth | null, logout = false) {
    setValue(auth);

    if (logout) {
      window.localStorage.removeItem(authTokenKey);
      window.location.assign("/");
    }
  }

  function verifyToken() {
    client<{ access_token: string } | null>("auth/verify_access_token/", {
      method: "POST",
    });
  }

  function login(email: string, password: string): void {
    client<{
      access_token: string;
      token_type: string;
    }>("auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: encodeFormData({ username: email, password: password }),
    }).then(
      (data) => {
        window.localStorage.setItem(authTokenKey, data.access_token);
        setValue({
          email,
          accessToken: data.access_token,
        });
        window.location.assign(redirectUrl);
      },
      (error) => console.error(error)
    );
  }

  function logout(): void {
    setAuth(null, true);
    window.localStorage.removeItem(authTokenKey);
  }

  return (
    <AuthContext.Provider
      value={{ auth: value, redirectUrl, setAuth, login, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
