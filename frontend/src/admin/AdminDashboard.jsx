import React, { useState } from "react";
import MachineryAdmin from "./pages/MachineryAdmin";
import TemplatesAdmin from "./pages/TemplatesAdmin";
import BudgetAdmin from "./pages/BudgetAdmin";
import ProcurementAdmin from "./pages/ProcurementAdmin";
import RateContractAdmin from "./pages/RateContractAdmin";
import PerformanceAdmin from "./pages/PerformanceAdmin";

import DrillSitesAdmin from "./pages/DrillSitesAdmin";
import InitiativesAdmin from "./pages/InitiativesAdmin";
import AwardsAdmin from "./pages/AwardsAdmin";
import AuditStatusAdmin from "./pages/AuditStatusAdmin";
import CertificationsAdmin from "./pages/CertificationsAdmin";
import UpcomingEventsAdmin from "./pages/UpcomingEventsAdmin";
import ArchiveAdmin from "./pages/ArchiveAdmin";
import ExcelSyncTest from "./pages/ExcelSyncTest";

const AdminDashboard = () => {
  const [active, setActive] = useState("machinery");

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div style={{ width: 250, background: "#111", color: "#fff", padding: 20, overflowY: "auto" }}>
        <h3 style={{ borderBottom: "1px solid #444", paddingBottom: 10 }}>ONGC Admin</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ cursor: "pointer" }} onClick={() => setActive("machinery")}>Machinery</p>
          <p style={{ cursor: "pointer" }} onClick={() => setActive("templates")}>Manage Templates</p>
          <p style={{ cursor: "pointer" }} onClick={() => setActive("budget")}>Manage Budget</p>
          <p style={{ cursor: "pointer" }} onClick={() => setActive("procurement")}>Manage Procurement</p>
          <p style={{ cursor: "pointer" }} onClick={() => setActive("rate_contracts")}>Rate Contracts</p>
          <p style={{ cursor: "pointer" }} onClick={() => setActive("performance")}>Performance</p>


          <hr style={{ width: "100%", borderColor: "#444" }} />

          <p style={{ cursor: "pointer" }} onClick={() => setActive("drill_sites")}>Drill Sites Status</p>
          <p style={{ cursor: "pointer" }} onClick={() => setActive("initiatives")}>New Initiatives</p>
          <p style={{ cursor: "pointer" }} onClick={() => setActive("awards")}>Awards</p>
          <p style={{ cursor: "pointer" }} onClick={() => setActive("audit")}>Audit Status</p>
          <p style={{ cursor: "pointer" }} onClick={() => setActive("certs")}>Certifications</p>
          <p style={{ cursor: "pointer" }} onClick={() => setActive("events")}>Upcoming Events</p>
          <p style={{ cursor: "pointer" }} onClick={() => setActive("archive")}>Drilling References</p>
          <hr style={{ width: "100%", borderColor: "#444" }} />
          <p style={{ cursor: "pointer", color: "#4caf50" }} onClick={() => setActive("excel_sync")}>Excel Sync Test (All)</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
        {active === "machinery" && <MachineryAdmin />}
        {active === "templates" && <TemplatesAdmin />}
        {active === "budget" && <BudgetAdmin />}
        {active === "procurement" && <ProcurementAdmin />}
        {active === "rate_contracts" && <RateContractAdmin />}
        {active === "performance" && <PerformanceAdmin />}


        {active === "drill_sites" && <DrillSitesAdmin />}
        {active === "initiatives" && <InitiativesAdmin />}
        {active === "awards" && <AwardsAdmin />}
        {active === "audit" && <AuditStatusAdmin />}
        {active === "certs" && <CertificationsAdmin />}
        {active === "events" && <UpcomingEventsAdmin />}
        {active === "archive" && <ArchiveAdmin />}
        {active === "excel_sync" && <ExcelSyncTest />}
      </div>
    </div>
  );
};

export default AdminDashboard;
