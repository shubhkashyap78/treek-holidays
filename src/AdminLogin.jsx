import { useState, useEffect } from "react";
import { login } from "./api.js";
import AdminPanel from "./AdminPanel.jsx";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      setIsLoggedIn(true);
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  }

  if (isLoggedIn) {
    return <AdminPanel onLogout={handleLogout} />;
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-box" onSubmit={handleSubmit}>
        <div className="brand" style={{ justifyContent: "center", marginBottom: 24 }}>
          <span className="brand-mark">AB</span>
          <div>
            <div className="brand-title">My Andaman Tour</div>
            <div className="brand-sub">Admin Portal</div>
          </div>
        </div>
        {error && <div className="admin-message" style={{ color: "#c0392b" }}>{error}</div>}
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="cta block" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
