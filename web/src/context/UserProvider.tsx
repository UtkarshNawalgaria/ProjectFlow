import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import UserService, { TAuthenticatedUser } from "../services/users";
import useAuth, { AuthContextType } from "./AuthProvider";

type Organization = {
  id: number;
  title: string;
};

export type TUserContext = {
  user: TAuthenticatedUser | null;
  initials: string;
  currentOrganization: Organization | null;
  changeOrganization: (orgId: number) => void;
};

const UserContext = createContext<TUserContext | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useAuth() as AuthContextType;
  const [user, setUser] = useState<TAuthenticatedUser | null>(null);
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);

  const initials = useMemo(() => {
    if (!user) return "";

    const name = user.name.split(" ");
    const init = name.length > 1 ? name[0][0] + name[1][0] : name[0][0];
    return init.toUpperCase();
  }, [user?.name]);

  const getCurrentUser = () => {
    UserService.me().then((user) => {
      setUser(user);
      setCurrentOrganization(user.organizations ? user.organizations[0] : null);
    });
  };

  const changeOrganization = (orgId: number) => {
    if (orgId === currentOrganization?.id) return;

    const org = user?.organizations.find((org) => org.id === orgId) || null;
    setCurrentOrganization(org);
  };

  useEffect(() => {
    if (auth) getCurrentUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, initials, currentOrganization, changeOrganization }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export default useUser;
