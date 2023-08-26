import React, { createContext, useContext, useEffect, useState } from "react";
import OrganizationService, { Organization } from "../services/organization";
import UserService, { TAuthenticatedUser } from "../services/users";
import useAuth, { AuthContextType } from "./AuthProvider";
import { toast } from "react-toastify";

export type TUserContext = {
  user: TAuthenticatedUser | null;
  currentOrganization: Organization | null;
  changeOrganization: (orgId: number) => void;
  updateOrganization: (org: Organization) => void;
  updateUser: (user: TAuthenticatedUser) => void;
  updateUserProfile: (userId: number, user: TAuthenticatedUser) => void;
};

const UserContext = createContext<TUserContext | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useAuth() as AuthContextType;
  const [user, setUser] = useState<TAuthenticatedUser | null>(null);
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);

  const changeOrganization = (orgId: number) => {
    if (orgId === currentOrganization?.id) return;

    const org = user?.organizations.find((org) => org.id === orgId) || null;
    setCurrentOrganization(org);
  };

  const updateOrganization = (org: Organization) => {
    setCurrentOrganization(org);
  };

  const updateUser = (user: TAuthenticatedUser) => {
    setUser(user);
  };

  const updateUserProfile = (userId: number, user: TAuthenticatedUser) => {
    const { profile_pic, ...rest } = user;
    UserService.updateUser(userId, rest).then((updatedUser) => {
      setUser(updatedUser);
      toast.success("User successfully updated");
    });
  };

  useEffect(() => {
    if (auth) {
      Promise.all([
        UserService.me(),
        OrganizationService.getUserOrganizations(),
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
      value={{
        user,
        updateUser,
        currentOrganization,
        changeOrganization,
        updateOrganization,
        updateUserProfile,
      }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export default useUser;
