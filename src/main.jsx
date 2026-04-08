import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminPanel from "./AdminPanel.jsx";
import HoneymoonDetail from "./HoneymoonDetail.jsx";
import FamilyDetail from "./FamilyDetail.jsx";
import "./styles.css";

function Root() {
  const path = window.location.pathname;
  const [token, setToken] = useState(localStorage.getItem("admin_token"));

  if (path.startsWith("/admin")) {
    if (!token) return <AdminLogin onLogin={() => setToken(localStorage.getItem("admin_token"))} />;
    return <AdminPanel onLogout={() => setToken(null)} />;
  }

  const honeymoonMatch = path.match(/^\/honeymoon\/([a-f\d]{24})$/i);
  if (honeymoonMatch) return <HoneymoonDetail id={honeymoonMatch[1]} />;

  const familyMatch = path.match(/^\/family\/([a-f\d]{24})$/i);
  if (familyMatch) return <FamilyDetail id={familyMatch[1]} />;

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
