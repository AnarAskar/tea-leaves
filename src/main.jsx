import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    {/* <AdminPanel /> */}
  </StrictMode>,
);
