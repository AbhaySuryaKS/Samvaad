import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user ? children : <Navigate to="/auth" />;
};

export default ProtectedRoute;
