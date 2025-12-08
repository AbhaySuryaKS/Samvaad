import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth"; 

const RedirectIfAuth = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;
    return user ? <Navigate to="/chat" replace /> : children;
};

export default RedirectIfAuth;