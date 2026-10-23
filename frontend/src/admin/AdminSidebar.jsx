import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const linkStyle = ({ isActive }) => ({
    padding: "12px",
    color: isActive ? "#ff4444" : "#fff",
    textDecoration: "none",
    display: "block"
  });

  return (
    <div style={{ width: "240px", background: "#000" }}>
      <h3 style={{ padding: "15px", color: "#ff4444" }}>ONGC Admin</h3>

      <NavLink to="/admin/machinery" style={linkStyle}>Machinery</NavLink>
      <NavLink to="/admin/budget" style={linkStyle}>Budget</NavLink>
      <NavLink to="/admin/procurement" style={linkStyle}>Procurement</NavLink>
      <NavLink to="/admin/performance" style={linkStyle}>Performance</NavLink>
      <NavLink to="/admin/rate-contracts" style={linkStyle}>Rate Contracts</NavLink>

      <button
        onClick={logout}
        style={{ margin: "20px", padding: "10px", width: "80%" }}
      >
        Logout
      </button>
    </div>
  );
}