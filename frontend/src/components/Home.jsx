import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
export default function Home() {
  const [screen, setScreen] = useState("HOME");
  // HOME | MACHINERY | DETAILS | OTHER
  const [machinery, setMachinery] = useState([]);
  const [budget, setBudget] = useState([]);
  const [procurement, setProcurement] = useState([]); // NEW STATE
  const [performance, setPerformance] = useState([]); // NEW STATE

  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [otherTitle, setOtherTitle] = useState("");

  useEffect(() => {
    if (screen === "BUDGET") {
      setBudgetLoading(true);
      fetch(`${API_BASE_URL}/public/budget`)
        .then((res) => res.json())
        .then((data) => {
          setBudget(data);
          setBudgetLoading(false);
        })
        .catch(err => {
          console.error(err);
          setBudgetLoading(false);
        });
    }
  }, [screen]);

  // ================= FETCH MACHINERY =================
  useEffect(() => {
    if (screen === "MACHINERY") {
      setLoading(true);
      fetch(`${API_BASE_URL}/public/machinery`)
        .then((res) => res.json())
        .then((data) => {
          setMachinery(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [screen]);

  // ================= FETCH PROCUREMENT =================
  useEffect(() => {
    if (screen === "PROCUREMENT") {
      setLoading(true);
      fetch(`${API_BASE_URL}/public/procurement`)
        .then((res) => res.json())
        .then((data) => {
          setProcurement(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [screen]);

  // ================= FETCH PERFORMANCE =================
  useEffect(() => {
    if (screen === "PERFORMANCE") {
      setLoading(true);
      fetch(`${API_BASE_URL}/public/performance`)
        .then((res) => res.json())
        .then((data) => {
          setPerformance(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [screen]);



  const [showInfo, setShowInfo] = useState(false);

  // ================= NEW TEMPLATES STATE =================
  const [drillSites, setDrillSites] = useState([]);
  const [initiatives, setInitiatives] = useState([]);
  const [awards, setAwards] = useState([]);
  const [audit, setAudit] = useState([]);
  const [certs, setCerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [archive, setArchive] = useState([]);

  // ================= FETCHING NEW DATA =================
  useEffect(() => {
    if (screen === "DRILL_SITES") fetchGeneric("drill-sites", setDrillSites);
    if (screen === "INITIATIVES") fetchGeneric("initiatives", setInitiatives);
    if (screen === "AWARDS") fetchGeneric("awards", setAwards);
    if (screen === "AUDIT") fetchGeneric("audit-status", setAudit);
    if (screen === "CERTS") fetchGeneric("certifications", setCerts);
    if (screen === "EVENTS") fetchGeneric("upcoming-events", setEvents);
    if (screen === "ARCHIVE") fetchGeneric("drilling-references", setArchive);
  }, [screen]);

  const fetchGeneric = (endpoint, setState) => {
    setLoading(true);
    fetch(`${API_BASE_URL}/public/${endpoint}`)
      .then(res => res.json())
      .then(data => { setState(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  if (screen === "HOME") {
    return (
      <div className="h-screen overflow-hidden bg-no-repeat flex flex-col" style={{
        backgroundImage: "url('/drill_rig_tall.png'), linear-gradient(135deg, #7f1d1d 0%, #111827 100%)",
        backgroundSize: "contain, cover",
        backgroundPosition: "center center, center center",
        backgroundBlendMode: "normal"
      }}>

        <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-800 text-white px-8 py-5 flex justify-between items-center shadow-2xl relative z-50 border-b-4 border-yellow-500 shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black tracking-[0.1em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-200" style={{ fontFamily: 'sans-serif' }}>
                DRILLING SERVICES FRONTIER BASINS, ONGC DEHRADUN
              </h1>
              <img src="/ongc_logo.png" alt="ONGC Logo" className="h-16 w-auto object-contain drop-shadow-md bg-white rounded-md p-1" />
            </div>
            <span className="text-xs text-yellow-300 tracking-[0.3em] uppercase font-bold mt-1 pl-1 border-l-2 border-yellow-400 ml-1 px-2 drop-shadow-md">
              Integrated Asset & Performance Management
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* INFO DROPDOWN */}
            <div className="relative">
              <button onClick={() => setShowInfo(!showInfo)} className="flex items-center gap-2 bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full transition text-sm font-medium focus:outline-none backdrop-blur-md border border-white/10">
                ℹ️ About
              </button>
              {showInfo && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white text-gray-800 p-5 rounded-lg shadow-2xl border border-gray-200 z-50 animate-fade-in" style={{ textAlign: "left" }}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-red-700 border-b border-gray-200 pb-1 w-full">Frontier Basins</h3>
                    <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-red-600 ml-2">✕</button>
                  </div>
                  <div className="text-sm leading-relaxed mb-3 space-y-2 text-gray-700">
                    <p><strong>Frontier Basins</strong> is a strategic asset of ONGC, entrusted with the critical responsibility of upgrading prognosticated resources to established reserves.</p>
                    <p>Dedicated to exploration in geologically complex and logistically challenging terrains (Cat-I, II & III basins) to ensure India's energy security.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 relative z-20 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full max-w-7xl mx-auto">
            <TemplateCard index={4} title="Performance" subtitle="KPIs & Targets" icon="/performance.jpg" onClick={() => setScreen("PERFORMANCE")} />
            <TemplateCard index={5} title="Drill Sites Status" subtitle="Active Rigs & Locations" icon="/drill.png" onClick={() => setScreen("DRILL_SITES")} />

            {/* SPACER FOR BACKGROUND */}
            <div className="hidden lg:block"></div>

            <TemplateCard index={0} title="Machinery & Equipment" subtitle="View equipment inventory" icon="/machinery.png" onClick={() => setScreen("MACHINERY")} />
            <TemplateCard index={1} title="Budget & Utilization" subtitle="Financial Overview" icon="/budget.png" onClick={() => setScreen("BUDGET")} />

            <TemplateCard index={6} title="New Initiatives" subtitle="Ideas & Technology" icon="/idea.jpg" onClick={() => setScreen("INITIATIVES")} />
            <TemplateCard index={7} title="Awards" subtitle="Appreciations" icon="/award.jpg" onClick={() => setScreen("AWARDS")} />

            {/* SPACER FOR BACKGROUND */}
            <div className="hidden lg:block"></div>

            <TemplateCard index={2} title="Procurement" subtitle="Purchase & Status" icon="/procurement.png" onClick={() => setScreen("PROCUREMENT")} />
            <TemplateCard index={3} title="Rate Contracts" subtitle="Vendor agreements" icon="/contracts.png" onClick={() => setScreen("RATE_CONTRACTS")} />

            <TemplateCard index={8} title="Audit Status" subtitle="Observations & Actions" icon="/audit.jpg" onClick={() => setScreen("AUDIT")} />
            <TemplateCard index={9} title="Certifications" subtitle="License Status" icon="/certificate.png" onClick={() => setScreen("CERTS")} />

            {/* SPACER FOR BACKGROUND */}
            <div className="hidden lg:block"></div>

            <TemplateCard index={10} title="Upcoming Events" subtitle="Schedule & Planner" icon="/event.jpg" onClick={() => setScreen("EVENTS")} />
            <TemplateCard index={11} title="Drill References" subtitle="Archive & Docs" icon="/archive.png" onClick={() => setScreen("ARCHIVE")} />
          </div>
        </div>
      </div>
    );
  }

  // ================= VIEWS FOR NEW TEMPLATES =================

  function GenericTable({ title, data, headers, renderRow }) {
    return (
      <div className="p-8 bg-white/95 backdrop-blur-xl m-6 rounded-2xl shadow-2xl border border-white/50 animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <BackButton onClick={() => setScreen("HOME")} />
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-red-600 uppercase tracking-widest drop-shadow-sm flex-1 text-center">{title}</h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        <div style={{ overflowX: "auto" }} className="rounded-xl shadow-inner border border-gray-200">
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
            <thead>
              <tr className="bg-gradient-to-r from-red-900 to-red-700 text-white shadow-md">
                {headers.map((h, i) => (
                  <th key={i} className="p-4 text-sm uppercase font-bold tracking-wider border-r border-red-800/30 last:border-none">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={headers.length + 1} style={td}>No data available</td></tr>
              ) : (
                data.map((item, index) => (
                  <React.Fragment key={item.id || index}>
                    {renderRow(item, index)}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if (screen === "DRILL_SITES") return <GenericTable title="Drill Sites Status" data={drillSites} headers={["Year", "Loc Name", "Basin", "Block Name", "Allotment", "Validity", "Stacking", "LAQ", "Civil Start", "Civil End", "RFD", "Site Name"]} renderRow={(item) => (
    <tr key={item.id} className="hover:bg-red-50 transition-colors border-b border-gray-100">
      <td style={td}>{item.planning_year}</td>
      <td style={td}>{item.location_release_name}</td>
      <td style={td}>{item.basin_name}</td>
      <td style={td}>{item.block_name}</td>
      <td style={td}>{item.block_allotment_details}</td>
      <td style={td}>{item.block_validity}</td>
      <td style={td}>{item.stacking_date}</td>
      <td style={td}>{item.laq_status}</td>
      <td style={td}>{item.civil_work_start_date}</td>
      <td style={td}>{item.civil_work_end_date}</td>
      <td style={td}>{item.rfd_date}</td>
      <td style={td}>{item.drill_site_name}</td>
    </tr>
  )} />;

  if (screen === "INITIATIVES") return <GenericTable title="New Initiatives / Ideas" data={initiatives} headers={["Year", "Category", "Year (Used)", "Used At", "Brief Desc", "Detail Desc", "Pros", "Cons", "Benefits", "Cost Eff.", "Remarks"]} renderRow={(item) => (
    <tr key={item.id} className="hover:bg-red-50 transition-colors border-b border-gray-100">
      <td style={td}>{item.year}</td>
      <td style={td}>{item.category}</td>
      <td style={td}>{item.year_used_at}</td>
      <td style={td}>{item.used_at}</td>
      <td style={td}>{item.description_brief}</td>
      <td style={td}>{item.description_detail}</td>
      <td style={td}>{item.pros}</td>
      <td style={td}>{item.cons}</td>
      <td style={td}>{item.benefits}</td>
      <td style={td}>{item.cost_effectiveness}</td>
      <td style={td}>{item.remarks}</td>
    </tr>
  )} />;

  if (screen === "AWARDS") return <GenericTable title="Awards & Appreciations" data={awards} headers={["Category", "Sub Category", "Year", "Awarded By", "Brief Desc", "Detail Desc", "Remarks"]} renderRow={(item) => (
    <tr key={item.id} className="hover:bg-red-50 transition-colors border-b border-gray-100">
      <td style={td}>{item.category}</td>
      <td style={td}>{item.sub_category}</td>
      <td style={td}>{item.year}</td>
      <td style={td}>{item.awarded_by}</td>
      <td style={td}>{item.description_brief}</td>
      <td style={td}>{item.description_detail}</td>
      <td style={td}>{item.remarks}</td>
    </tr>
  )} />;

  if (screen === "AUDIT") return <GenericTable title="Audit & Other Observations" data={audit} headers={["Category", "Year", "Agency", "Section", "Raised", "Comp. (Today)", "3M", "6M", "9M", ">9M", "Remarks"]} renderRow={(item) => (
    <tr key={item.id} className="hover:bg-red-50 transition-colors border-b border-gray-100">
      <td style={td}>{item.audit_category}</td>
      <td style={td}>{item.audit_year}</td>
      <td style={td}>{item.auditing_agency}</td>
      <td style={td}>{item.section}</td>
      <td style={td}>{item.paras_raised}</td>
      <td style={td}>{item.paras_complied_today}</td>
      <td style={td}>{item.paras_complied_3m}</td>
      <td style={td}>{item.paras_complied_6m}</td>
      <td style={td}>{item.paras_complied_9m}</td>
      <td style={td}>{item.paras_complied_beyond_9m}</td>
      <td style={td}>{item.remarks}</td>
    </tr>
  )} />;

  if (screen === "CERTS") return <GenericTable title="Certification & License Status" data={certs} headers={["Category", "Sub Category", "Cert. On", "Cert. By", "Description", "Validity", "Status", "Res. Section", "Remarks"]} renderRow={(item) => (
    <tr key={item.id} className="hover:bg-red-50 transition-colors border-b border-gray-100">
      <td style={td}>{item.category}</td>
      <td style={td}>{item.sub_category}</td>
      <td style={td}>{item.certified_on}</td>
      <td style={td}>{item.certified_by}</td>
      <td style={td}>{item.description_brief}</td>
      <td style={td}>{item.validity}</td>
      <td style={td}>{item.status}</td>
      <td style={td}>{item.responsible_section}</td>
      <td style={td}>{item.remarks}</td>
    </tr>
  )} />;

  if (screen === "EVENTS") return <GenericTable title="Upcoming Events" data={events} headers={["Type", "Status", "Date", "Duration", "Place", "Eligibility", "Brief", "Action", "Nominated", "Link"]} renderRow={(item) => (
    <tr key={item.id} className="hover:bg-red-50 transition-colors border-b border-gray-100">
      <td style={td}>{item.event_type}</td>
      <td style={td}>{item.status}</td>
      <td style={td}>{item.event_date}</td>
      <td style={td}>{item.duration}</td>
      <td style={td}>{item.place}</td>
      <td style={td}>{item.eligibility}</td>
      <td style={td}>{item.description_brief}</td>
      <td style={td}>{item.action_to_be_taken}</td>
      <td style={td}>{item.nominated_persons}</td>
      <td style={td}>{item.my_space_link}</td>
    </tr>
  )} />;

  if (screen === "ARCHIVE") return <GenericTable title="Drilling References" data={archive} headers={["Ref. Type", "Event", "Date", "Brief", "Link", "Pass Key", "Remarks"]} renderRow={(item) => (
    <tr key={item.id} className="hover:bg-red-50 transition-colors border-b border-gray-100">
      <td style={td}>{item.reference_type}</td>
      <td style={td}>{item.event}</td>
      <td style={td}>{item.date_of_event}</td>
      <td style={td}>{item.brief}</td>
      <td style={td}>{item.my_space_link}</td>
      <td style={td}>{item.pass_key}</td>
      <td style={td}>{item.remarks}</td>
    </tr>
  )} />;

  // ================= MACHINERY TABLE =================
  if (screen === "MACHINERY") {
    return (
      <div className="p-8 bg-white/95 backdrop-blur-xl m-6 rounded-2xl shadow-2xl border border-white/50 animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <BackButton onClick={() => setScreen("HOME")} />
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-red-600 uppercase tracking-widest drop-shadow-sm flex-1 text-center">Machinery & Equipment</h1>
          <div className="w-20"></div>
        </div>

        {/* --- GRAPH SECTION --- */}
        {!loading && machinery.length > 0 && (
          <div className="mb-8 bg-white p-4 rounded shadow flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Equipment Status Distribution</h3>
            <MachineryStatusChart data={machinery} />
          </div>
        )}


        {loading ? (
          <p>Loading machinery data...</p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-red-700 text-white">
              <tr>
                <th className="border p-2">Equipment Name</th>
                <th className="border p-2">Section</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {machinery.map((m) => (
                <tr key={m.equipment_id} className="hover:bg-gray-100">
                  <td className="border p-2 font-medium">
                    {m.equipment_name}
                  </td>
                  <td className="border p-2">{m.section}</td>
                  <td className="border p-2">{m.location}</td>
                  <td className="border p-2">{m.present_status}</td>
                  <td className="border p-2">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => {
                        setSelected(m);
                        setScreen("DETAILS");
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  // ================= MACHINERY DETAILS =================
  if (screen === "DETAILS" && selected) {
    return (
      <div className="p-8">
        <BackButton onClick={() => setScreen("MACHINERY")} />

        <h1 className="text-2xl font-bold text-red-700 mb-6">
          {selected.equipment_name}
        </h1>

        <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded shadow">
          <Detail label="Section" value={selected.section} />
          <Detail label="Class" value={selected.class} />
          <Detail label="Sub Class" value={selected.sub_class} />
          <Detail label="Location" value={selected.location} />
          <Detail label="Status" value={selected.present_status} />
          <Detail label="Make" value={selected.make} />
          <Detail label="Model" value={selected.model} />
          <Detail label="OEM Sl No" value={selected.oem_sl_no} />
          <Detail label="ONGC Asset No" value={selected.ongc_asset_no} />
          <Detail label="Last Received From" value={selected.last_received_from} />
          <Detail label="Remarks" value={selected.remarks} />
        </div>
      </div>
    );
  }

  // ======================= BUDGET =======================
  if (screen === "BUDGET") {
    // Process Data: Group by Year
    const groupedData = budget.reduce((acc, item) => {
      (acc[item.year] = acc[item.year] || []).push(item);
      return acc;
    }, {});
    const sortedYears = Object.keys(groupedData).sort().reverse();

    return (
      <div style={{ padding: "40px", background: "rgba(255,255,255,0.95)", color: "#000", minHeight: "100vh", backdropFilter: "blur(20px)" }}>

        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setScreen("HOME")}
            style={{
              background: "#b00020",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              marginBottom: "15px",
              cursor: "pointer",
              borderRadius: "5px"
            }}
          >
            ← Back
          </button>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-red-600 uppercase tracking-widest drop-shadow-sm flex-1 text-center mb-4">
            Budget & Utilization (ONGC)
          </h1>
          <div className="w-20"></div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "2px solid #000",
              fontSize: "13px",
              textAlign: "center"
            }}
          >
            <thead>
              <tr style={{ height: "40px" }}>
                <th rowSpan="2" style={{ ...thNew, border: "1px solid #000" }}>YEAR</th>
                <th rowSpan="2" style={{ ...thNew, border: "1px solid #000" }}>SECTION</th>
                <th colSpan="3" style={{ ...thNew, border: "1px solid #000", background: "#fff", color: "#000" }}>CAPITAL</th>
                <th colSpan="3" style={{ ...thNew, border: "1px solid #000", background: "#ffe699", color: "#000" }}>CONTRACTUAL</th>
                <th colSpan="3" style={{ ...thNew, border: "1px solid #000", background: "#bdd7ee", color: "#000" }}>STORE</th>
                <th colSpan="3" style={{ ...thNew, border: "1px solid #000", background: "#f8cbad", color: "#000" }}>SPARE</th>
                <th colSpan="3" style={{ ...thNew, border: "1px solid #000", background: "#e0e0e0", color: "#000" }}>OTHERS</th>
                <th colSpan="3" style={{ ...thNew, border: "1px solid #000", background: "#d9ead3", color: "#000" }}>MISC</th>
              </tr>
              <tr>
                {[
                  { bg: "#fff" },       // Capital
                  { bg: "#ffe699" },    // Contractual
                  { bg: "#bdd7ee" },    // Store
                  { bg: "#f8cbad" },     // Spare
                  { bg: "#e0e0e0" },    // Others
                  { bg: "#d9ead3" }     // Misc
                ].map((style, i) => (
                  <React.Fragment key={i}>
                    <th style={{ ...subThNew, background: style.bg }}>ASSIGNED</th>
                    <th style={{ ...subThNew, background: style.bg }}>UTILIZED</th>
                    <th style={{ ...subThNew, background: style.bg }}>% UTILIZATION</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            <tbody>
              {budget.length === 0 && (
                <tr>
                  <td colSpan="14" style={{ textAlign: "center", padding: "20px" }}>
                    No budget data found
                  </td>
                </tr>
              )}

              {sortedYears.map((year) => {
                const items = groupedData[year];

                // Calculate Yearly Totals based only on visible columns
                const yearTotals = items.reduce((acc, curr) => ({
                  capital_assigned: acc.capital_assigned + (parseFloat(curr.capital_assigned) || 0),
                  capital_utilized: acc.capital_utilized + (parseFloat(curr.capital_utilized) || 0),
                  contractual_assigned: acc.contractual_assigned + (parseFloat(curr.contractual_assigned) || 0),
                  contractual_utilized: acc.contractual_utilized + (parseFloat(curr.contractual_utilized) || 0),
                  store_assigned: acc.store_assigned + (parseFloat(curr.store_assigned) || 0),
                  store_utilized: acc.store_utilized + (parseFloat(curr.store_utilized) || 0),
                  spare_assigned: acc.spare_assigned + (parseFloat(curr.spare_assigned) || 0),
                  spare_utilized: acc.spare_utilized + (parseFloat(curr.spare_utilized) || 0),
                  others_assigned: acc.others_assigned + (parseFloat(curr.others_assigned) || 0),
                  others_utilized: acc.others_utilized + (parseFloat(curr.others_utilized) || 0),
                  misc_assigned: acc.misc_assigned + (parseFloat(curr.misc_assigned) || 0),
                  misc_utilized: acc.misc_utilized + (parseFloat(curr.misc_utilized) || 0),
                }), {
                  capital_assigned: 0, capital_utilized: 0,
                  contractual_assigned: 0, contractual_utilized: 0,
                  store_assigned: 0, store_utilized: 0,
                  spare_assigned: 0, spare_utilized: 0,
                  others_assigned: 0, others_utilized: 0,
                  misc_assigned: 0, misc_utilized: 0,
                });

                return (
                  <React.Fragment key={year}>
                    {items.map((item, index) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #000" }}>
                        {index === 0 && (
                          <td rowSpan={items.length + 1} style={{ ...tdNew, fontWeight: "bold", border: "1px solid #000", verticalAlign: "middle" }}>
                            {year}
                          </td>
                        )}
                        <td style={{ ...tdNew, border: "1px solid #000", textAlign: "left", fontWeight: "bold" }}>{item.section}</td>

                        {/* DATA CELLS */}
                        <DataCellsNew item={item} type="capital" />
                        <DataCellsNew item={item} type="contractual" bg="#fff2cc" />
                        <DataCellsNew item={item} type="store" bg="#deebf7" />
                        <DataCellsNew item={item} type="spare" bg="#fce4d6" />
                        <DataCellsNew item={item} type="others" bg="#f5f5f5" />
                        <DataCellsNew item={item} type="misc" bg="#e2f0d9" />
                      </tr>
                    ))}
                    {/* YEARLY TOTAL ROW */}
                    <tr style={{ fontWeight: "bold" }}>
                      <td style={{ ...tdNew, border: "1px solid #000", textAlign: "center", background: "#f8cbad" }}>TOTAL</td>

                      <DataCellsNew item={yearTotals} type="capital" bg="#595959" isTotal />
                      <DataCellsNew item={yearTotals} type="contractual" bg="#7f6000" isTotal />
                      <DataCellsNew item={yearTotals} type="store" bg="#1f4e78" isTotal />
                      <DataCellsNew item={yearTotals} type="spare" bg="#833c0c" isTotal />
                      <DataCellsNew item={yearTotals} type="others" bg="#616161" isTotal />
                      <DataCellsNew item={yearTotals} type="misc" bg="#38761d" isTotal />
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }


  // ================= PROCUREMENT VIEW =================
  if (screen === "PROCUREMENT") {
    return (
      <div className="p-8 bg-white/95 backdrop-blur-xl m-6 rounded-2xl shadow-2xl border border-white/50 animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <BackButton onClick={() => setScreen("HOME")} />
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-red-600 uppercase tracking-widest drop-shadow-sm flex-1 text-center">
            Procurement Status
          </h1>
          <div className="w-20"></div>
        </div>

        {loading ? (
          <p>Loading procurement data...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ ...table, fontSize: "13px", background: "#fff", border: "1px solid #ccc" }}>
              <thead className="bg-red-700 text-white">
                <tr>
                  <th style={th}>Section</th>
                  <th style={th}>Head</th>
                  <th style={th}>Details</th>
                  <th style={th}>Agency</th>
                  <th style={th}>Value (₹)</th>
                  <th style={th}>Year</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {procurement.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-4 text-center border">
                      No procurement data found.
                    </td>
                  </tr>
                )}
                {procurement.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td style={td}>{item.section}</td>
                    <td style={td}>{item.head}</td>
                    <td style={td}>
                      <b>{item.item_details}</b>
                      <br />
                      <span className="text-gray-500 text-xs">Sl: {item.sl_no}</span>
                    </td>
                    <td style={td}>{item.procurement_agency}</td>
                    <td style={td}>{item.value}</td>
                    <td style={td}>{item.year_procurement}</td>
                    <td style={td}>
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                        {item.last_status}
                      </span>
                      <br />
                      <span className="text-gray-500 text-xs">
                        {item.last_status_date ? new Date(item.last_status_date).toLocaleDateString() : ""}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ================= RATE CONTRACTS VIEW =================
  if (screen === "RATE_CONTRACTS") {
    const rateContracts = [
      {
        id: 1,
        section: "MECHANICAL",
        sr_no: 1,
        category: "SPARES",
        equipment: "BHEL MAKE RIG MECHANICAL EQUIPMENTS",
        oem: "M/S BHARAT HEAVY ELECTRICAL LIMITED, HYDERABAD",
        rc_detail: "MUM/2023/IMPBHEL/1248578",
        validity: "23.01.2030",
        price_validity: "PRICES ARE VALID FROM 24.01.2025 TO 23.01.2026",
        status: "IN-FORCE"
      },
      {
        id: 2,
        section: "",
        sr_no: 2,
        category: "SERVICE",
        equipment: "OVERHAULING (OH) OF BHEL MAKE RIG EQUIPMENT & HIRING SERVICES OF FIELD SERVICE REPRESENTATIVE (FSR)",
        oem: "M/S BHARAT HEAVY ELECTRICAL LIMITED, HYDERABAD",
        rc_detail: "MUM/IMPETUS-MUM/2020/BHEL/999681",
        validity: "13.06.2028",
        price_validity: "PRICES ARE VALID FROM 13.05.2025 TO 13.05.2026",
        status: "IN-FORCE"
      },
      {
        id: 3,
        section: "",
        sr_no: 3,
        category: "SPARES",
        equipment: "SUPPLY OF SPARES OF CATERPILLAR ENGINE",
        oem: "M/S EQUIPMENTS & LOGISTICS PTE. LTD. SINGAPORE",
        rc_detail: "MUM/IMPETUS-MUM/2019/E&S/401355",
        validity: "27.09.2025",
        price_validity: "PRICES ARE VALID FROM 13.05.2025 TO 27.09.2025",
        status: "EXPIRED"
      }
    ];

    return (
      <div className="p-8 bg-white/95 backdrop-blur-xl m-6 rounded-2xl shadow-2xl border border-white/50 animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <BackButton onClick={() => setScreen("HOME")} />
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-red-600 uppercase tracking-widest drop-shadow-sm flex-1 text-center">Rate Contracts</h1>
          <div className="w-20"></div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "1200px", borderCollapse: "collapse", fontSize: "12px", width: "100%", background: "#fff" }}>
            <thead>
              <tr>
                <th style={{ ...th, background: "#595959" }}>Section</th>
                <th style={{ ...th, background: "#595959" }}>Sr. No.</th>
                <th style={{ ...th, background: "#595959" }}>CATEGORY</th>
                <th style={{ ...th, background: "#595959" }}>EQUIPMENT</th>
                <th style={{ ...th, background: "#595959" }}>OEM DETAILS</th>
                <th style={{ ...th, background: "#595959" }}>RATE CONTRACT DETAIL</th>
                <th style={{ ...th, background: "#595959" }}>VALIDITY OF RC</th>
                <th style={{ ...th, background: "#595959" }}>PRICE VALIDITY</th>
                <th style={{ ...th, background: "#595959" }}>PRESENT STATUS</th>
              </tr>
            </thead>
            <tbody>
              {rateContracts.map((item, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
                  {index === 0 ? (
                    <td rowSpan={rateContracts.length} style={{ ...td, fontWeight: "bold", borderRight: "1px solid #ccc", verticalAlign: "middle" }}>
                      {item.section}
                    </td>
                  ) : item.section ? (
                    <td style={{ ...td, fontWeight: "bold", borderRight: "1px solid #ccc" }}>{item.section}</td>
                  ) : null}

                  <td style={td}>{item.sr_no}</td>
                  <td style={td}>{item.category}</td>
                  <td style={{ ...td, textAlign: "left" }}>{item.equipment}</td>
                  <td style={{ ...td, textAlign: "left" }}>{item.oem}</td>
                  <td style={td}>{item.rc_detail}</td>
                  <td style={td}>{item.validity}</td>
                  <td style={{ ...td, textAlign: "left" }}>{item.price_validity}</td>
                  <td style={{ ...td, fontWeight: "bold", color: item.status === "EXPIRED" ? "red" : "green" }}>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ================= OTHER TEMPLATES =================
  if (screen === "OTHER") {
    return (
      <div className="p-8">
        <BackButton onClick={() => setScreen("HOME")} />
        <h1 className="text-2xl font-bold text-red-700 mb-4">
          {otherTitle}
        </h1>
        <p>This template is ready. Table/details can be added next.</p>
      </div>
    );
  }
  // ================= PERFORMANCE VIEW =================
  if (screen === "PERFORMANCE") {
    return (
      <div className="p-8 bg-white/95 backdrop-blur-xl m-6 rounded-2xl shadow-2xl border border-white/50 animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <BackButton onClick={() => setScreen("HOME")} />
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-red-600 uppercase tracking-widest drop-shadow-sm flex-1 text-center">Performance & Utilization</h1>
          <div className="w-20"></div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
            <thead>
              <tr style={{ background: "#333", color: "#fff" }}>
                <th style={th}>Parameter</th>
                <th style={th}>Target</th>
                <th style={th}>Actual</th>
                <th style={th}>Unit</th>
                <th style={th}>Status</th>
                <th style={th}>Remarks</th>
                <th style={th}>Image</th>
              </tr>
            </thead>
            <tbody>
              {performance.length === 0 ? (
                <tr><td colSpan="7" style={td}>No data available</td></tr>
              ) : (
                performance.map(item => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #ccc" }}>
                    <td style={td}>{item.parameter}</td>
                    <td style={td}>{item.target_value}</td>
                    <td style={td}>{item.actual_value}</td>
                    <td style={td}>{item.unit}</td>
                    <td style={{ ...td, color: item.status === 'Critical' ? 'red' : 'green', fontWeight: "bold" }}>{item.status}</td>
                    <td style={td}>{item.remarks}</td>
                    <td style={td}>
                      {item.image_url ? <a href={item.image_url} target="_blank" rel="noopener noreferrer">View</a> : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }


  // ================= DRILL SITES VIEW =================
  if (screen === "DRILL_SITES") {
    return (
      <div className="p-8">
        <BackButton onClick={() => setScreen("HOME")} />
        <h1 className="text-2xl font-bold text-red-700 mb-6">Drill Sites Status</h1>

        <DrillSitesTable />
      </div>
    );
  }
  return null;
}
// ================= COMPONENTS =================

function MachineryStatusChart({ data }) {
  // Calculate stats
  const stats = data.reduce((acc, item) => {
    const status = item.present_status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(stats).map(key => ({
    name: key,
    value: stats[key]
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#d32f2f', '#1976d2'];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


function TemplateCard({ title, subtitle, icon, onClick, index = 0 }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white/80 backdrop-blur-md p-2 rounded-xl shadow-lg cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-200/50 border border-white/40 hover:border-red-400/50 opacity-0 animate-fadeInUp relative overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Decorative Gradient Blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-yellow-200/40 to-red-500/0 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-row items-center gap-2">
        <img src={`${icon}?v=4`} alt="" className="h-20 w-20 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0" />
        <div className="flex flex-col text-left flex-1 min-w-0">
          <h2 className="font-bold text-[11.5px] whitespace-nowrap bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent group-hover:from-red-600 group-hover:to-yellow-500 transition-colors duration-300" title={title}>{title}</h2>
          <p className="text-[10px] text-gray-600 font-medium group-hover:text-gray-800 mt-0.5 truncate">{subtitle}</p>
        </div>
      </div>

      {/* Bottom Highlight Line */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-red-600 to-yellow-500 group-hover:w-full transition-all duration-500 ease-out"></div>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="mb-4 text-blue-600">
      ← Back
    </button>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}
function DrillSitesTable() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/public/drill-sites')
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <p>Loading drill sites...</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", background: "#fff", border: "1px solid #ccc" }}>
        <thead className="bg-red-700 text-white">
          <tr>
            <th style={th}>Planning Year</th>
            <th style={th}>Loc. Release Name</th>
            <th style={th}>Basin Name</th>
            <th style={th}>Block Name</th>
            <th style={th}>Block Allotment Details</th>
            <th style={th}>Block Validity</th>
            <th style={th}>Stacking Date</th>
            <th style={th}>LAQ Status</th>
            <th style={th}>Civil Work Start Date</th>
            <th style={th}>Civil Work End Date</th>
            <th style={th}>RFD Date</th>
            <th style={th}>Drill Site Name / ID</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="12" style={{ ...td, padding: 20 }}>No drill sites found.</td></tr>
          ) : (
            data.map((item, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td style={td}>{item.planning_year}</td>
                <td style={td}>{item.location_release_name}</td>
                <td style={td}>{item.basin_name}</td>
                <td style={td}>{item.block_name}</td>
                <td style={td}>{item.block_allotment_details}</td>
                <td style={td}>{item.block_validity}</td>
                <td style={td}>{item.stacking_date}</td>
                <td style={td}>{item.laq_status}</td>
                <td style={td}>{item.civil_work_start_date}</td>
                <td style={td}>{item.civil_work_end_date}</td>
                <td style={td}>{item.rfd_date}</td>
                <td style={td}>{item.drill_site_name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ================= STYLES =================
const th = {
  border: "1px solid #555",
  padding: "6px",
  background: "#222",
  color: "#fff",
  fontSize: "13px"
};
const subTh = {
  border: "1px solid #555",
  padding: "5px",
  background: "#2a2a2a",
  color: "#ffcccb",
  fontSize: "12px"
};

const td = {
  border: "1px solid #444",
  padding: "6px",
  textAlign: "center",
  fontSize: "13px"
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px"
};

const btn = {
  background: "#b00020",
  color: "#fff",
  padding: "10px 18px",
  border: "none",
  marginRight: "10px",
  cursor: "pointer"
};
const yearTd = {
  border: "1px solid #b00020",
  padding: "10px",
  marginRight: "18px",
};

const backBtn = {
  background: "#222",
  color: "#fff",
  border: "1px solid #b00020",
  padding: "6px 12px",
  marginBottom: "10px",
  cursor: "pointer"
};

// ================= NEW BUDGET HELPERS =================
const DataCellsNew = ({ item, type, bg, isTotal }) => {
  const assigned = parseFloat(item[`${type}_assigned`]) || 0;
  const utilized = parseFloat(item[`${type}_utilized`]) || 0;
  const percentage = assigned > 0 ? ((utilized / assigned) * 100).toFixed(1) + "%" : "";

  const cellStyle = {
    padding: 5,
    border: "1px solid #000", // Black borders
    textAlign: "center",
    background: bg || "transparent",
    color: isTotal ? "white" : "inherit",
    fontSize: "13px"
  };

  return (
    <>
      <td style={cellStyle}>{assigned || ""}</td>
      <td style={cellStyle}>{utilized || ""}</td>
      <td style={{ ...cellStyle, fontWeight: "bold" }}>{percentage}</td>
    </>
  );
};

const thNew = { padding: 8, textAlign: "center", fontWeight: "bold", fontSize: "14px" };
const subThNew = { padding: 4, fontSize: "11px", textAlign: "center", fontWeight: "bold", border: "1px solid #000", color: "#000" };
const tdNew = { padding: 8, color: "#000" };