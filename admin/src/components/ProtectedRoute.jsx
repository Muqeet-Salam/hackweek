import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/adminAuthService";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login page but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
