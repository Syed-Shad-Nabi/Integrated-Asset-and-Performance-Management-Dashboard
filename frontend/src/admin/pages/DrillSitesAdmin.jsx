
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

export default function DrillSitesAdmin() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    planning_year: "",
    location_release_name: "",
    basin_name: "",
    block_name: "",
    block_allotment_details: "",
    block_validity: "",
    stacking_date: "",
    laq_status: "",
    civil_work_start_date: "",
    civil_work_end_date: "",
    rfd_date: "",
    drill_site_name: ""
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/drill-sites`)
      .then((res) => res.json())
      .then((resData) => { setData(resData); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editId
      ? `${API_BASE_URL}/admin/drill-sites/${editId}`
      : `${API_BASE_URL}/admin/drill-sites`;
    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        alert(editId ? "Updated Successfully!" : "Added Successfully!");
        setForm({
          planning_year: "",
          location_release_name: "",
          basin_name: "",
          block_name: "",
          block_allotment_details: "",
          block_validity: "",
          stacking_date: "",
          laq_status: "",
          civil_work_start_date: "",
          civil_work_end_date: "",
          rfd_date: "",
          drill_site_name: ""
        });
        setEditId(null);
        fetchData();
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm(item);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this record?")) return;
    fetch(`${API_BASE_URL}/admin/drill-sites/${id}`, { method: "DELETE" })
      .then(() => fetchData())
      .catch((err) => console.error(err));
  };

  const inputStyle = { padding: 8, border: "1px solid #ccc", borderRadius: 4, width: "100%" };
  const th = { padding: 10, background: "#333", color: "#fff", border: "1px solid #555" };
  const td = { padding: 8, border: "1px solid #ddd", textAlign: "center" };

  return (
    <div>
      <h2 style={{ color: "#d32f2f", marginBottom: 20 }}>Drill Sites Status (Sheet 7)</h2>

      {/* FORM */}
      <div style={{ background: "#f9f9f9", padding: 20, marginBottom: 20, borderRadius: 8 }}>
        <h4>{editId ? "✏️ Edit" : "➕ Add New"}</h4>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>

          <div><label style={{ display: "block", marginBottom: 5 }}>Planning Year</label><input name="planning_year" value={form.planning_year} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: 5 }}>Loc. Rel. Name</label><input name="location_release_name" value={form.location_release_name} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: 5 }}>Basin Name</label><input name="basin_name" value={form.basin_name} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: 5 }}>Block Name</label><input name="block_name" value={form.block_name} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: 5 }}>Block Allotment</label><input name="block_allotment_details" value={form.block_allotment_details} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: 5 }}>Block Validity</label><input name="block_validity" value={form.block_validity} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: 5 }}>Stacking Date</label><input type="date" name="stacking_date" value={form.stacking_date} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: 5 }}>LAQ Status</label><input name="laq_status" value={form.laq_status} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: 5 }}>Civil End Date</label><input type="date" name="civil_work_end_date" value={form.civil_work_end_date} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: 5 }}>Civil Start Date</label><input type="date" name="civil_work_start_date" value={form.civil_work_start_date} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: 5 }}>RFD Date</label><input type="date" name="rfd_date" value={form.rfd_date} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: 5 }}>Drill Site Name/ID</label><input name="drill_site_name" value={form.drill_site_name} onChange={handleChange} style={inputStyle} /></div>

          <div style={{ gridColumn: "span 3", marginTop: 10 }}>
            <button type="submit" style={{ background: "#b00020", color: "#fff", padding: "10px 20px", border: "none", cursor: "pointer", marginRight: 10 }}>{editId ? "Update" : "Save"}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ planning_year: "", location_release_name: "", basin_name: "", block_name: "", block_allotment_details: "", block_validity: "", stacking_date: "", laq_status: "", civil_work_start_date: "", civil_work_end_date: "", rfd_date: "", drill_site_name: "" }); }} style={{ background: "#555", color: "#fff", padding: "10px 20px", border: "none", cursor: "pointer" }}>Cancel</button>}
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
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
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="13" style={{ padding: 20 }}>No records found.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
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
                  <td style={td}>
                    <button onClick={() => handleEdit(item)} style={{ marginRight: 5, cursor: "pointer" }}>✏️</button>
                    <button onClick={() => handleDelete(item.id)} style={{ cursor: "pointer" }}>🗑️</button>
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
