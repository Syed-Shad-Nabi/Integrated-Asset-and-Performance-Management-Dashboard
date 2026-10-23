
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

export default function AwardsAdmin() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    category: "",
    sub_category: "",
    year: "",
    awarded_by: "",
    description_brief: "",
    description_detail: "",
    remarks: ""
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/awards`)
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
      ? `${API_BASE_URL}/admin/awards/${editId}`
      : `${API_BASE_URL}/admin/awards`;
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
          category: "",
          sub_category: "",
          year: "",
          awarded_by: "",
          description_brief: "",
          description_detail: "",
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
    fetch(`${API_BASE_URL}/admin/awards/${id}`, { method: "DELETE" })
      .then(() => fetchData())
      .catch((err) => console.error(err));
  };

  const inputStyle = { padding: 8, border: "1px solid #ccc", borderRadius: 4, width: "100%" };
  const th = { padding: 10, background: "#333", color: "#fff", border: "1px solid #555" };
  const td = { padding: 8, border: "1px solid #ddd", textAlign: "center" };

  return (
    <div>
      <h2 style={{ color: "#d32f2f", marginBottom: 20 }}>Awards & Appreciations</h2>

      {/* FORM */}
      {/* FORM */}
      <div style={{ background: "#f9f9f9", padding: 20, marginBottom: 20, borderRadius: 8 }}>
        <h4>{editId ? "✏️ Edit" : "➕ Add New"}</h4>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>

          <div><label style={{ display: "block" }}>Category</label><input name="category" value={form.category} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Sub Category</label><input name="sub_category" value={form.sub_category} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Year</label><input name="year" value={form.year} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Awarded By</label><input name="awarded_by" value={form.awarded_by} onChange={handleChange} style={inputStyle} /></div>
          <div style={{ gridColumn: "span 2" }}><label style={{ display: "block" }}>Brief Desc</label><input name="description_brief" value={form.description_brief} onChange={handleChange} style={inputStyle} /></div>
          <div style={{ gridColumn: "span 2" }}><label style={{ display: "block" }}>Detail Desc</label><input name="description_detail" value={form.description_detail} onChange={handleChange} style={inputStyle} /></div>
          <div style={{ gridColumn: "span 2" }}><label style={{ display: "block" }}>Remarks</label><input name="remarks" value={form.remarks} onChange={handleChange} style={inputStyle} /></div>

          <div style={{ gridColumn: "span 2", marginTop: 10 }}>
            <button type="submit" style={{ background: "#b00020", color: "#fff", padding: "10px 20px", border: "none", cursor: "pointer", marginRight: 10 }}>
              {editId ? "Update" : "Save"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ category: "", sub_category: "", year: "", awarded_by: "", description_brief: "", description_detail: "", remarks: "" });
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
              <th style={th}>Sub Category</th>
              <th style={th}>Year</th>
              <th style={th}>Awarded By</th>
              <th style={th}>Brief Desc</th>
              <th style={th}>Detail Desc</th>
              <th style={th}>Remarks</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="8" style={{ padding: 20 }}>No records found.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td style={td}>{item.category}</td>
                  <td style={td}>{item.sub_category}</td>
                  <td style={td}>{item.year}</td>
                  <td style={td}>{item.awarded_by}</td>
                  <td style={td}>{item.description_brief}</td>
                  <td style={td}>{item.description_detail}</td>
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

