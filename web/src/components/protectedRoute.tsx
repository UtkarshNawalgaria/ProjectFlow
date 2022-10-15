import { Navigate, Outlet } from "react-router-dom";
import useAuth, { AuthContextType } from "../context/AuthProvider";
import AuthenticatedLayout from "./layouts/authenticated";

const ProtectedRoute = () => {
  const { auth } = useAuth() as AuthContextType;

  return auth?.accessToken ? (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
