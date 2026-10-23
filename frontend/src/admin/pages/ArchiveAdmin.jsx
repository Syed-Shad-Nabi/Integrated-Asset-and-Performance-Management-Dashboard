
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

export default function ArchiveAdmin() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    reference_type: "",
    event: "",
    date_of_event: "",
    brief: "",
    my_space_link: "",
    pass_key: "",
    remarks: ""
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/drilling-references`)
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
      ? `${API_BASE_URL}/admin/drilling-references/${editId}`
      : `${API_BASE_URL}/admin/drilling-references`;
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
          reference_type: "",
          event: "",
          date_of_event: "",
          brief: "",
          my_space_link: "",
          pass_key: "",
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
    fetch(`${API_BASE_URL}/admin/drilling-references/${id}`, { method: "DELETE" })
      .then(() => fetchData())
      .catch((err) => console.error(err));
  };

  const inputStyle = { padding: 8, border: "1px solid #ccc", borderRadius: 4, width: "100%" };
  const th = { padding: 10, background: "#333", color: "#fff", border: "1px solid #555" };
  const td = { padding: 8, border: "1px solid #ddd", textAlign: "center" };

  return (
    <div>
      <h2 style={{ color: "#d32f2f", marginBottom: 20 }}>Drilling References</h2>

      {/* FORM */}
      {/* FORM */}
      <div style={{ background: "#f9f9f9", padding: 20, marginBottom: 20, borderRadius: 8 }}>
        <h4>{editId ? "✏️ Edit" : "➕ Add New"}</h4>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>

          <div><label style={{ display: "block" }}>Reference Type</label><input name="reference_type" value={form.reference_type} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Event</label><input name="event" value={form.event} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Date of Event/Ref</label><input name="date_of_event" value={form.date_of_event} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Brief</label><input name="brief" value={form.brief} onChange={handleChange} style={inputStyle} /></div>

          <div><label style={{ display: "block" }}>My Space Link</label><input name="my_space_link" value={form.my_space_link} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Pass Key/Password</label><input name="pass_key" value={form.pass_key} onChange={handleChange} style={inputStyle} /></div>

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
                  setForm({ reference_type: "", event: "", date_of_event: "", brief: "", my_space_link: "", pass_key: "", remarks: "" });
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
              <th style={th}>Ref. Type</th>
              <th style={th}>Event</th>
              <th style={th}>Date</th>
              <th style={th}>Brief</th>
              <th style={th}>Link</th>
              <th style={th}>Pass Key</th>
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
                  <td style={td}>{item.reference_type}</td>
                  <td style={td}>{item.event}</td>
                  <td style={td}>{item.date_of_event}</td>
                  <td style={td}>{item.brief}</td>
                  <td style={td}>{item.my_space_link}</td>
                  <td style={td}>{item.pass_key}</td>
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
