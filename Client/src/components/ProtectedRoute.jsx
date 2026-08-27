import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, mcaOnly = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (mcaOnly && user.department !== "MCA") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;