
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

export default function AuditStatusAdmin() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    audit_category: "",
    audit_year: "",
    auditing_agency: "",
    section: "",
    paras_raised: "",
    paras_complied_today: "",
    paras_complied_3m: "",
    paras_complied_6m: "",
    paras_complied_9m: "",
    paras_complied_beyond_9m: "",
    remarks: ""
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/audit-status`)
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
      ? `${API_BASE_URL}/admin/audit-status/${editId}`
      : `${API_BASE_URL}/admin/audit-status`;
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
          audit_category: "",
          audit_year: "",
          auditing_agency: "",
          section: "",
          paras_raised: "",
          paras_complied_today: "",
          paras_complied_3m: "",
          paras_complied_6m: "",
          paras_complied_9m: "",
          paras_complied_beyond_9m: "",
          remarks: ""
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
    fetch(`${API_BASE_URL}/admin/audit-status/${id}`, { method: "DELETE" })
      .then(() => fetchData())
      .catch((err) => console.error(err));
  };

  const inputStyle = { padding: 8, border: "1px solid #ccc", borderRadius: 4, width: "100%" };
  const th = { padding: 10, background: "#333", color: "#fff", border: "1px solid #555" };
  const td = { padding: 8, border: "1px solid #ddd", textAlign: "center" };

  return (
    <div>
      <h2 style={{ color: "#d32f2f", marginBottom: 20 }}>Audit & Other Observations</h2>

      {/* FORM */}
      {/* FORM */}
      <div style={{ background: "#f9f9f9", padding: 20, marginBottom: 20, borderRadius: 8 }}>
        <h4>{editId ? "✏️ Edit" : "➕ Add New"}</h4>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>

          <div><label style={{ display: "block" }}>Audit Category</label><input name="audit_category" value={form.audit_category} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Audit Year</label><input name="audit_year" value={form.audit_year} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Auditing Agency</label><input name="auditing_agency" value={form.auditing_agency} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Section</label><input name="section" value={form.section} onChange={handleChange} style={inputStyle} /></div>

          <div><label style={{ display: "block" }}>Paras Raised</label><input type="number" name="paras_raised" value={form.paras_raised} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Complied Today</label><input type="number" name="paras_complied_today" value={form.paras_complied_today} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Comp. Next 3M</label><input type="number" name="paras_complied_3m" value={form.paras_complied_3m} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Comp. Next 6M</label><input type="number" name="paras_complied_6m" value={form.paras_complied_6m} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Comp. Next 9M</label><input type="number" name="paras_complied_9m" value={form.paras_complied_9m} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Comp. &gt; 9M</label><input type="number" name="paras_complied_beyond_9m" value={form.paras_complied_beyond_9m} onChange={handleChange} style={inputStyle} /></div>

          <div style={{ gridColumn: "span 3" }}><label style={{ display: "block" }}>Remarks</label><input name="remarks" value={form.remarks} onChange={handleChange} style={inputStyle} /></div>

          <div style={{ gridColumn: "span 3", marginTop: 10 }}>
            <button type="submit" style={{ background: "#b00020", color: "#fff", padding: "10px 20px", border: "none", cursor: "pointer", marginRight: 10 }}>
              {editId ? "Update" : "Save"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ audit_category: "", audit_year: "", auditing_agency: "", section: "", paras_raised: "", paras_complied_today: "", paras_complied_3m: "", paras_complied_6m: "", paras_complied_9m: "", paras_complied_beyond_9m: "", remarks: "" });
                }}
                style={{ background: "#555", color: "#fff", padding: "10px 20px", border: "none", cursor: "pointer" }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr>
              <th style={th}>Category</th>
              <th style={th}>Year</th>
              <th style={th}>Agency</th>
              <th style={th}>Section</th>
              <th style={th}>Raised</th>
              <th style={th}>Comp. (Today)</th>
              <th style={th}>3M</th>
              <th style={th}>6M</th>
              <th style={th}>9M</th>
              <th style={th}>&gt;9M</th>
              <th style={th}>Remarks</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="12" style={{ padding: 20 }}>No records found.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
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
