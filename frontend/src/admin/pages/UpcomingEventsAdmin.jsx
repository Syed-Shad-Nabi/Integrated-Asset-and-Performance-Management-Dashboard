
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

export default function UpcomingEventsAdmin() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    event_type: "",
    status: "",
    event_date: "",
    duration: "",
    place: "",
    eligibility: "",
    description_brief: "",
    action_to_be_taken: "",
    nominated_persons: "",
    my_space_link: ""
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/upcoming-events`)
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
      ? `${API_BASE_URL}/admin/upcoming-events/${editId}`
      : `${API_BASE_URL}/admin/upcoming-events`;
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
          event_type: "",
          status: "",
          event_date: "",
          duration: "",
          place: "",
          eligibility: "",
          description_brief: "",
          action_to_be_taken: "",
          nominated_persons: "",
          my_space_link: ""
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
    fetch(`${API_BASE_URL}/admin/upcoming-events/${id}`, { method: "DELETE" })
      .then(() => fetchData())
      .catch((err) => console.error(err));
  };

  const inputStyle = { padding: 8, border: "1px solid #ccc", borderRadius: 4, width: "100%" };
  const th = { padding: 10, background: "#333", color: "#fff", border: "1px solid #555" };
  const td = { padding: 8, border: "1px solid #ddd", textAlign: "center" };

  return (
    <div>
      <h2 style={{ color: "#d32f2f", marginBottom: 20 }}>Upcoming Events</h2>

      {/* FORM */}
      {/* FORM */}
      <div style={{ background: "#f9f9f9", padding: 20, marginBottom: 20, borderRadius: 8 }}>
        <h4>{editId ? "✏️ Edit" : "➕ Add New"}</h4>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>

          <div><label style={{ display: "block" }}>Event Type</label><input name="event_type" value={form.event_type} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Status</label><input name="status" value={form.status} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Date of Event</label><input name="event_date" value={form.event_date} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Duration</label><input name="duration" value={form.duration} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Place</label><input name="place" value={form.place} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Eligibility</label><input name="eligibility" value={form.eligibility} onChange={handleChange} style={inputStyle} /></div>

          <div style={{ gridColumn: "span 2" }}><label style={{ display: "block" }}>Description (Brief)</label><input name="description_brief" value={form.description_brief} onChange={handleChange} style={inputStyle} /></div>

          <div><label style={{ display: "block" }}>Action to be Taken</label><input name="action_to_be_taken" value={form.action_to_be_taken} onChange={handleChange} style={inputStyle} /></div>
          <div><label style={{ display: "block" }}>Nominated Persons</label><input name="nominated_persons" value={form.nominated_persons} onChange={handleChange} style={inputStyle} /></div>
          <div style={{ gridColumn: "span 2" }}><label style={{ display: "block" }}>My Space Link</label><input name="my_space_link" value={form.my_space_link} onChange={handleChange} style={inputStyle} /></div>

          <div style={{ gridColumn: "span 2", marginTop: 10 }}>
            <button type="submit" style={{ background: "#b00020", color: "#fff", padding: "10px 20px", border: "none", cursor: "pointer", marginRight: 10 }}>
              {editId ? "Update" : "Save"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ event_type: "", status: "", event_date: "", duration: "", place: "", eligibility: "", description_brief: "", action_to_be_taken: "", nominated_persons: "", my_space_link: "" });
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
              <th style={th}>Type</th>
              <th style={th}>Status</th>
              <th style={th}>Date</th>
              <th style={th}>Duration</th>
              <th style={th}>Place</th>
              <th style={th}>Eligibility</th>
              <th style={th}>Brief</th>
              <th style={th}>Action</th>
              <th style={th}>Nominated</th>
              <th style={th}>Link</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="11" style={{ padding: 20 }}>No records found.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
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
