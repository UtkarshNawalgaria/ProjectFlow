import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const auth = { token: false };
  return auth.token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
