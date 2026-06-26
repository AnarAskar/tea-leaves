import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SplashPage from "./pages/SplashPage";
import MenuPage from "./pages/TeaLeaves";

// Admin code (and its @dnd-kit deps) is split out so customers loading the
// menu don't download it.
const AdminLogin = lazy(() => import("./components/AdminLogin"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function AdminFallback() {
  return (
    <div className="admin-loading">
      <div className="admin-spinner" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminFallback />}>
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
