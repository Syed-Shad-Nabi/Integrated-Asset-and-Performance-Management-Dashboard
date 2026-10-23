import React, { useState } from "react";
import { API_BASE_URL } from "../config";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.token) {
        // ✅ SAVES TOKEN CORRECTLY
        localStorage.setItem("admin_token", data.token);
        alert("Login successful! 🎉 Redirecting to dashboard...");

        // Redirect to machinery admin
        window.location.href = "/admin/dashboard";
      } else {
        alert("Login failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Login error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 400, margin: "100px auto", padding: 30,
      border: "1px solid #ddd", borderRadius: 10, textAlign: "center"
    }}>
      <h2>🔐 Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          style={{ width: "100%", padding: 12, margin: "10px 0", borderRadius: 5, border: "1px solid #ddd" }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          style={{ width: "100%", padding: 12, margin: "10px 0", borderRadius: 5, border: "1px solid #ddd" }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", padding: 12, background: "#007bff",
            color: "white", border: "none", borderRadius: 5, fontSize: 16
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

    </div>
  );
};

export default AdminLogin;