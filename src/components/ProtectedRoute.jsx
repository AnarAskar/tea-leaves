import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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

  return session ? children : <Navigate to="/admin/login" replace />;
}
