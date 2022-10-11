import { Navigate, Outlet } from "react-router-dom";
import useAuth, { AuthContextType } from "../context/AuthProvider";
import Layout from "./layout";

const ProtectedRoute = () => {
  const { auth } = useAuth() as AuthContextType;

  return auth?.accessToken ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
