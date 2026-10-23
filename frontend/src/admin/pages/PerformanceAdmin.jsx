
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

export default function PerformanceAdmin() {
    const [data, setData] = useState([]);
    const [form, setForm] = useState({
        parameter: "",
        target_value: "",
        actual_value: "",
        unit: "",
        status: "On Track",
        remarks: "",
        image_url: ""
    });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/admin/performance`)
            .then((res) => res.json())
            .then((resData) => {
                setData(resData);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editId
            ? `${API_BASE_URL}/admin/performance/${editId}`
            : `${API_BASE_URL}/admin/performance`;
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
                    parameter: "",
                    target_value: "",
                    actual_value: "",
                    unit: "",
                    status: "On Track",
                    remarks: "",
                    image_url: ""
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
        fetch(`${API_BASE_URL}/admin/performance/${id}`, { method: "DELETE" })
            .then(() => fetchData())
            .catch((err) => console.error(err));
    };

    const inputStyle = { padding: 8, border: "1px solid #ccc", borderRadius: 4, width: "100%" };
    const th = { padding: 10, background: "#333", color: "#fff", border: "1px solid #555" };
    const td = { padding: 8, border: "1px solid #ddd", textAlign: "center" };

    return (
        <div>
            <h2 style={{ color: "#d32f2f", marginBottom: 20 }}>Performance Management</h2>

            {/* FORM */}
            <div style={{ background: "#f9f9f9", padding: 20, marginBottom: 20, borderRadius: 8 }}>
                <h4>{editId ? "✏️ Edit Performance" : "➕ Add Performance"}</h4>
                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>

                    <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", marginBottom: 5 }}>Parameter</label>
                        <input name="parameter" value={form.parameter} onChange={handleChange} style={inputStyle} placeholder="e.g. Drilling Efficiency" required />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 5 }}>Target Value</label>
                        <input name="target_value" value={form.target_value} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: 5 }}>Actual Value</label>
                        <input name="actual_value" value={form.actual_value} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 5 }}>Unit</label>
                        <input name="unit" value={form.unit} onChange={handleChange} style={inputStyle} placeholder="e.g. %" />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: 5 }}>Status</label>
                        <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                            <option>On Track</option>
                            <option>Delayed</option>
                            <option>Completed</option>
                            <option>Critical</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", marginBottom: 5 }}>Remarks</label>
                        <input name="remarks" value={form.remarks} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", marginBottom: 5 }}>Image URL (optional)</label>
                        <input name="image_url" value={form.image_url} onChange={handleChange} style={inputStyle} placeholder="http://..." />
                    </div>

                    <div style={{ gridColumn: "span 2", marginTop: 10 }}>
                        <button type="submit" style={{ background: "#b00020", color: "#fff", padding: "10px 20px", border: "none", cursor: "pointer", marginRight: 10 }}>
                            {editId ? "Update" : "Save"}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditId(null);
                                    setForm({
                                        parameter: "",
                                        target_value: "",
                                        actual_value: "",
                                        unit: "",
                                        status: "On Track",
                                        remarks: "",
                                        image_url: ""
                                    });
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
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={th}>Parameter</th>
                            <th style={th}>Target</th>
                            <th style={th}>Actual</th>
                            <th style={th}>Unit</th>
                            <th style={th}>Status</th>
                            <th style={th}>Remarks</th>
                            <th style={th}>Image</th>
                            <th style={th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr><td colSpan="8" style={{ padding: 20 }}>No records found.</td></tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id}>
                                    <td style={td}>{item.parameter}</td>
                                    <td style={td}>{item.target_value}</td>
                                    <td style={td}>{item.actual_value}</td>
                                    <td style={td}>{item.unit}</td>
                                    <td style={{ ...td, color: item.status === "Critical" || item.status === "Delayed" ? "red" : "green", fontWeight: "bold" }}>
                                        {item.status}
                                    </td>
                                    <td style={td}>{item.remarks}</td>
                                    <td style={td}>
                                        {item.image_url ? (
                                            <a href={item.image_url} target="_blank" rel="noopener noreferrer">View</a>
                                        ) : "-"}
                                    </td>
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
