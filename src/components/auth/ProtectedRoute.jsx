import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authstore";

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <div className="p-6 font-bold">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
