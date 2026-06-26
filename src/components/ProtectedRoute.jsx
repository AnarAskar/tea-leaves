import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ADMIN_PATH } from "../constants/config";
import "../styles/admin.css";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  return session ? children : <Navigate to={`/${ADMIN_PATH}/login`} replace />;
}
