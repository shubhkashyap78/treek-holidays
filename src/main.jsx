import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminPanel from "./AdminPanel.jsx";
import HoneymoonDetail from "./HoneymoonDetail.jsx";
import FamilyDetail from "./FamilyDetail.jsx";
import LtcDetail from "./LtcDetail.jsx";
import GroupDetail from "./GroupDetail.jsx";
import "./styles.css";

function Root() {
  const [token, setToken] = useState(localStorage.getItem("admin_token"));
  const path = window.location.pathname;

  if (path.startsWith("/admin")) {
    if (!token) return <AdminLogin onLogin={() => setToken(localStorage.getItem("admin_token"))} />;
    return <AdminPanel onLogout={() => setToken(null)} />;
  }

  const honeymoonMatch = path.match(/^\/honeymoon\/([a-f0-9]{24})$/i);
  if (honeymoonMatch) return <HoneymoonDetail id={honeymoonMatch[1]} />;

  const familyMatch = path.match(/^\/family\/([a-f0-9]{24})$/i);
  if (familyMatch) return <FamilyDetail id={familyMatch[1]} />;

  const ltcMatch = path.match(/^\/ltc\/([a-f0-9]{24})$/i);
  if (ltcMatch) return <LtcDetail id={ltcMatch[1]} />;

  const groupMatch = path.match(/^\/group\/([a-f0-9]{24})$/i);
  if (groupMatch) return <GroupDetail id={groupMatch[1]} />;

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
