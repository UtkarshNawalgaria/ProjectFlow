import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/AuthProvider";
import Layout from "./layout";

const ProtectedRoute = () => {
  const { auth } = useAuth();
  return auth?.accessToken ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
