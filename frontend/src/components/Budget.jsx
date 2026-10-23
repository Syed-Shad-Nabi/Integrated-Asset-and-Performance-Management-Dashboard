import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export default function Budget() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/public/budget`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load budget");
        setLoading(false);
      });
  }, []);

  // Process Data: Group by Year
  const groupedData = data.reduce((acc, item) => {
    (acc[item.year] = acc[item.year] || []).push(item);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedData).sort().reverse();

  if (loading) return <div className="p-6 text-white">Loading budget...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4 text-center text-red-700">Budget & Utilization</h1>

      <div style={{ overflowX: "auto", marginTop: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, border: "2px solid #000", textAlign: "center" }}>
          <thead>
            <tr style={{ height: "40px" }}>
              <th rowSpan="2" style={{ ...th, border: "1px solid #000" }}>YEAR</th>
              <th rowSpan="2" style={{ ...th, border: "1px solid #000" }}>SECTION</th>

              <th colSpan="3" style={{ ...th, border: "1px solid #000", background: "#fff" }}>CAPITAL</th>
              <th colSpan="3" style={{ ...th, border: "1px solid #000", background: "#ffe699" }}>CONTRACTUAL</th>
              <th colSpan="3" style={{ ...th, border: "1px solid #000", background: "#bdd7ee" }}>STORE</th>
              <th colSpan="3" style={{ ...th, border: "1px solid #000", background: "#f8cbad" }}>SPARE</th>
              <th colSpan="3" style={{ ...th, border: "1px solid #000", background: "#e0e0e0" }}>OTHERS</th>
              <th colSpan="3" style={{ ...th, border: "1px solid #000", background: "#d9ead3" }}>MISC</th>
            </tr>
            <tr>
              {/* Repeated Sub-headers for each category with matching colors */}
              {[
                { bg: "#fff" },       // Capital
                { bg: "#ffe699" },    // Contractual
                { bg: "#bdd7ee" },    // Store
                { bg: "#f8cbad" },    // Spare
                { bg: "#e0e0e0" },    // Others
                { bg: "#d9ead3" }     // Misc
              ].map((style, i) => (
                <React.Fragment key={i}>
                  <th style={{ ...subTh, border: "1px solid #000", background: style.bg }}>ASSIGNED</th>
                  <th style={{ ...subTh, border: "1px solid #000", background: style.bg }}>UTILIZED</th>
                  <th style={{ ...subTh, border: "1px solid #000", background: style.bg }}>% UTILIZATION</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
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
                        <td rowSpan={items.length + 1} style={{ ...td, fontWeight: "bold", border: "1px solid #000", verticalAlign: "middle" }}>
                          {year}
                        </td>
                      )}
                      <td style={{ ...td, border: "1px solid #000", textAlign: "left", fontWeight: "bold" }}>{item.section}</td>

                      {/* DATA CELLS WITH SPECIFIC COLORS */}
                      <DataCells item={item} type="capital" /> {/* White */}
                      <DataCells item={item} type="contractual" bg="#fff2cc" /> {/* Light Yellow */}
                      <DataCells item={item} type="store" bg="#deebf7" /> {/* Light Blue */}
                      <DataCells item={item} type="spare" bg="#fce4d6" /> {/* Light Red/Orange */}
                      <DataCells item={item} type="others" bg="#f5f5f5" /> {/* Light Grey */}
                      <DataCells item={item} type="misc" bg="#e2f0d9" /> {/* Light Green */}
                    </tr>
                  ))}
                  {/* YEARLY TOTAL ROW - MATCHING DARK BLOCKS */}
                  <tr style={{ fontWeight: "bold" }}>
                    <td style={{ ...td, border: "1px solid #000", textAlign: "center", background: "#f8cbad" }}>TOTAL</td>

                    <DataCells item={yearTotals} type="capital" bg="#595959" isTotal />
                    <DataCells item={yearTotals} type="contractual" bg="#7f6000" isTotal />
                    <DataCells item={yearTotals} type="store" bg="#1f4e78" isTotal />
                    <DataCells item={yearTotals} type="spare" bg="#833c0c" isTotal />
                    <DataCells item={yearTotals} type="others" bg="#616161" isTotal />
                    <DataCells item={yearTotals} type="misc" bg="#38761d" isTotal />
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

// Helper Component for Table Cells
const DataCells = ({ item, type, bg, isTotal }) => {
  const assigned = parseFloat(item[`${type}_assigned`]) || 0;
  const utilized = parseFloat(item[`${type}_utilized`]) || 0;
  const percentage = assigned > 0 ? ((utilized / assigned) * 100).toFixed(1) + "%" : "";

  const cellStyle = {
    padding: 5,
    border: "1px solid #000", // Black borders
    textAlign: "center",
    background: bg || "transparent",
    color: isTotal ? "white" : "inherit",
    fontSize: "11px"
  };

  return (
    <>
      <td style={cellStyle}>{assigned || ""}</td>
      <td style={cellStyle}>{utilized || ""}</td>
      <td style={{ ...cellStyle, fontWeight: "bold" }}>{percentage}</td>
    </>
  );
};

// Styles
const th = { padding: 8, textAlign: "center", fontWeight: "bold", fontSize: "12px" };
const subTh = { padding: 4, fontSize: "10px", textAlign: "center", fontWeight: "bold" };
const td = { padding: 8 };