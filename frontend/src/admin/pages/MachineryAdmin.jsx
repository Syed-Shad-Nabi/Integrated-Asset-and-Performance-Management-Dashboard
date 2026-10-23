import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const MachineryAdmin = () => {
  // ✅ Correct token key
  const token = localStorage.getItem("admin_token");

  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState("ADD"); // ADD | EDIT
  const [editId, setEditId] = useState(null);

  // Initial State
  const initialForm = {
    equipment_name: "",
    section: "DRILLING", // Default
    class: "",
    sub_class: "",
    make: "",
    model: "",
    oem_sl_no: "",
    ongc_asset_no: "",
    location: "",
    last_received_from: "",
    present_status: "Working",
    remarks: ""
  };

  const [formData, setFormData] = useState(initialForm);

  // Fetch Data
  const fetchMachinery = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/machinery`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMachinery(data);
    } catch (error) {
      console.error("Fetch Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachinery();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.equipment_name) return alert("Equipment Name is required!");

    const endpoint = formMode === "ADD"
      ? `${API_BASE_URL}/admin/machinery`
      : `${API_BASE_URL}/admin/machinery/${editId}`;

    // PUT for edit, POST for add
    const method = formMode === "ADD" ? "POST" : "PUT";

    try {
      const res = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert(formMode === "ADD" ? "Added Successfully!" : "Updated Successfully!");
        setFormData(initialForm);
        setFormMode("ADD");
        setEditId(null);
        fetchMachinery();
      } else {
        const err = await res.json();
        alert("Operation failed: " + (err.error || err.message || JSON.stringify(err)));
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred: " + err.message);
    }
  };

  // Pre-fill for Edit
  const handleEdit = (item) => {
    setFormMode("EDIT");
    setEditId(item.equipment_id);
    setFormData({
      equipment_name: item.equipment_name || "",
      section: item.section || "DRILLING",
      class: item.class || "",
      sub_class: item.sub_class || "",
      make: item.make || "",
      model: item.model || "",
      oem_sl_no: item.oem_sl_no || "",
      ongc_asset_no: item.ongc_asset_no || "",
      location: item.location || "",
      last_received_from: item.last_received_from || "",
      present_status: item.present_status || "Working",
      remarks: item.remarks || ""
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/machinery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        fetchMachinery();
      } else {
        const text = await res.text();
        try {
          const err = JSON.parse(text);
          alert("Delete failed: " + (err.error || err.message));
        } catch {
          alert("Delete failed (Parsing Error): " + text.substring(0, 100)); // Show substring if HTML
          console.error(text);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed: " + (err.message || "Unknown Network Error"));
    }
  };


  return (
    <div>
      <h2 style={{ color: "#d32f2f", marginBottom: 20 }}>Machinery Management</h2>

      {/* --- FORM SECTION --- */}
      <div style={{ background: "#f9f9f9", padding: 20, marginBottom: 30, borderRadius: 8 }}>
        <h4 style={{ marginBottom: 15 }}>{formMode === "ADD" ? "➕ Add New Equipment" : "✏️ Edit Equipment"}</h4>

        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>

          {/* 1. Basic Info */}
          <input name="equipment_name" placeholder="Equipment Name *" value={formData.equipment_name} onChange={handleChange} style={input} required />
          <select name="section" value={formData.section} onChange={handleChange} style={input}>
            <option value="DRILLING">Drilling</option>
            <option value="CHEMISTRY">Chemistry</option>
            <option value="CEMENTING">Cementing</option>
            <option value="OTHERS">Others</option>
          </select>
          <input name="present_status" placeholder="Status (e.g. Working)" value={formData.present_status} onChange={handleChange} style={input} />

          {/* 2. Specs */}
          <input name="make" placeholder="Make" value={formData.make} onChange={handleChange} style={input} />
          <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} style={input} />
          <input name="class" placeholder="Class" value={formData.class} onChange={handleChange} style={input} />
          <input name="sub_class" placeholder="Sub Class" value={formData.sub_class} onChange={handleChange} style={input} />

          {/* 3. Nos */}
          <input name="oem_sl_no" placeholder="OEM Sl/No" value={formData.oem_sl_no} onChange={handleChange} style={input} />
          <input name="ongc_asset_no" placeholder="ONGC Asset No" value={formData.ongc_asset_no} onChange={handleChange} style={input} />

          {/* 4. Location & Others */}
          <input name="location" placeholder="Current Location" value={formData.location} onChange={handleChange} style={input} />
          <input name="last_received_from" placeholder="Last Received From" value={formData.last_received_from} onChange={handleChange} style={input} />

          {/* Full Width */}
          <textarea
            name="remarks"
            placeholder="Remarks / Notes..."
            value={formData.remarks}
            onChange={handleChange}
            style={{ ...input, gridColumn: "span 3", height: "60px" }}
          />

          <div style={{ gridColumn: "span 3", marginTop: 10 }}>
            <button type="submit" style={saveBtn}>
              {formMode === "ADD" ? "Save Equipment" : "Update Equipment"}
            </button>
            {formMode === "EDIT" && (
              <button type="button" onClick={() => { setFormMode("ADD"); setFormData(initialForm); }} style={cancelBtn}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- LIST SECTION --- */}
      {loading ? <p>Loading Data...</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", background: "#fff" }}>
            <thead>
              <tr style={{ background: "#333", color: "#fff" }}>
                <th style={th}>Name</th>
                <th style={th}>Section</th>
                <th style={th}>Model</th>
                <th style={th}>Loc</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {machinery.map(m => (
                <tr key={m.equipment_id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}><b>{m.equipment_name}</b><br /><span style={sub}>{m.ongc_asset_no}</span></td>
                  <td style={td}>{m.section}</td>
                  <td style={td}>{m.model}</td>
                  <td style={td}>{m.location}</td>
                  <td style={td}>
                    <span style={{
                      padding: "3px 6px", borderRadius: 4,
                      background: m.present_status === "Working" ? "#e8f5e9" : "#ffebee",
                      color: m.present_status === "Working" ? "green" : "red"
                    }}>
                      {m.present_status}
                    </span>
                  </td>
                  <td style={td}>
                    <button onClick={() => handleEdit(m)} style={actionBtn}>Edit</button>
                    <button onClick={() => handleDelete(m.equipment_id)} style={{ ...actionBtn, background: "#d32f2f" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Styles
const input = { width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" };
const saveBtn = { background: "#1976d2", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: "bold" };
const cancelBtn = { background: "#757575", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 4, cursor: "pointer", marginLeft: 10 };
const th = { padding: "10px", textAlign: "left", whiteSpace: "nowrap" };
const td = { padding: "10px", whiteSpace: "nowrap" };
const sub = { fontSize: "11px", color: "#777" };
const actionBtn = { padding: "5px 10px", margin: "0 5px", border: "none", borderRadius: 4, background: "#444", color: "#fff", cursor: "pointer", fontSize: "12px" };

export default MachineryAdmin;
