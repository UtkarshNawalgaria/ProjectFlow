import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./context/AuthProvider";

const ProtectedRoute = () => {
  const { auth } = useAuth();
  return auth?.accessToken ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
