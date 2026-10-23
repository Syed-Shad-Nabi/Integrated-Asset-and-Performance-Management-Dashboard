import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ExcelSyncTest from "./admin/pages/ExcelSyncTest";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* EXISTING HOME — UNCHANGED */}
        <Route path="/" element={<Home />} />

        {/* ADMIN ROUTES — NEW */}
        <Route
          path="/admin/login"
          element={<AdminLogin onSuccess={() => window.location.href = "/admin/dashboard"} />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/excel-sync"
          element={<ExcelSyncTest />}
        />

      </Routes>
    </BrowserRouter>
  );
}