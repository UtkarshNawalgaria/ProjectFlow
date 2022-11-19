import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import OrganizationService, { Organization } from "../services/organization";
import UserService, { TAuthenticatedUser } from "../services/users";
import useAuth, { AuthContextType } from "./AuthProvider";

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
    if (!user || (user && user.name.length == 0)) return "";

    const name = user.name.split(" ");
    const init = name.length > 1 ? name[0][0] + name[1][0] : name[0][0];
    return init.toUpperCase();
  }, [user?.name]);

  const changeOrganization = (orgId: number) => {
    if (orgId === currentOrganization?.id) return;

    const org = user?.organizations.find((org) => org.id === orgId) || null;
    setCurrentOrganization(org);
  };

  useEffect(() => {
    if (auth) {
      Promise.all([
        UserService.me(),
        OrganizationService.getOrganizationList(),
      ]).then((values) => {
        const userData = values[0] as Omit<TAuthenticatedUser, "organizations">;
        const orgData = values[1];
        setUser({
          ...userData,
          organizations: orgData,
        });
        setCurrentOrganization(values[1][0]);
      });
    }
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
