import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ color: "#fff", textAlign: "center", padding: 50 }}>
        Loading...
      </div>
    );
  }

  return session ? children : <Navigate to="/admin/login" replace />;
}
