import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, signIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // If still checking auth, show loading
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#1b3a2d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#fff" }}>Loading...</div>
      </div>
    );
  }

  // If already logged in, redirect to admin panel
  if (session) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1b3a2d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#1e3d2f",
          padding: 30,
          borderRadius: 12,
          width: "100%",
          maxWidth: 400,
          color: "#fff",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          {error && (
            <p style={{ color: "#e63946", marginBottom: 10 }}>{error}</p>
          )}
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px 12px",
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #2d5a42",
  background: "#243f30",
  color: "#fff",
  fontSize: 14,
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#40916c",
  border: "none",
  borderRadius: 6,
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};
