import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import useClient, { TError, authTokenKey } from "../services/client";
import UserService from "../services/users";

export type TAuth = {
  email?: string;
  accessToken: string;
};

export type TAuthData = {
  name: string;
  email: string;
  password: string;
};

export type AuthContextType = {
  auth: TAuth | null;
  redirectUrl: string;
  login: (
    username: string,
    password: string,
    onError: (error: TError) => void
  ) => void;
  register: (
    data: TAuthData,
    onSuccess: (msg: string) => void,
    onError: (error: TError) => void
  ) => void;
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
    useClient<{ access_token: string } | null>("auth/verify_access_token/", {
      method: "POST",
    });
  }

  function register(
    data: TAuthData,
    onSuccess: (msg: string) => void,
    onError: (error: TError) => void
  ) {
    UserService.register(data)
      .then(() => {
        toast.success("You have registered successfuly", {
          position: toast.POSITION.TOP_RIGHT,
        });
        onSuccess(
          "User registered successully. Account verification email has been sent to you"
        );
      })
      .catch((error) => {
        onError(error);
        toast.error(`${error.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  }

  function login(
    email: string,
    password: string,
    onError: (error: TError) => void
  ): void {
    UserService.login(email, password).then(
      (data) => {
        setValue({
          email,
          accessToken: data.access_token,
        });
        window.localStorage.setItem(authTokenKey, data.access_token);
        window.location.assign(redirectUrl);
      },
      (error) => {
        onError(error);
      }
    );
  }

  function logout(): void {
    setAuth(null, false);
    window.localStorage.removeItem(authTokenKey);
    window.location.assign("/");
  }

  return (
    <AuthContext.Provider
      value={{
        auth: value,
        redirectUrl,
        setAuth,
        register,
        login,
        logout,
        verifyToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
