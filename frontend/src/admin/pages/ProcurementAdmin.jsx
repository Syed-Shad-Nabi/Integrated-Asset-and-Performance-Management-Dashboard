import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const ProcurementAdmin = () => {
    const token = localStorage.getItem("admin_token");

    const [procurementList, setProcurementList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formMode, setFormMode] = useState("ADD"); // ADD | EDIT
    const [editId, setEditId] = useState(null);

    // Initial State
    const initialForm = {
        section: "DRILLING",
        head: "",
        sl_no: "",
        year_procurement: "",
        item_details: "",
        procurement_agency: "",
        value: "",
        last_status: "",
        last_status_date: ""
    };

    const [formData, setFormData] = useState(initialForm);

    // Fetch Data
    const fetchProcurement = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/procurement`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setProcurementList(data);
        } catch (error) {
            console.error("Fetch Failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProcurement();
    }, []);

    // Handle Input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit (Add or Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.item_details) return alert("Item Details are required!");

        const endpoint = formMode === "ADD"
            ? `${API_BASE_URL}/admin/procurement`
            : `${API_BASE_URL}/admin/procurement/${editId}`;

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
                fetchProcurement();
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
        setEditId(item.id);
        setFormData({
            section: item.section || "DRILLING",
            head: item.head || "",
            sl_no: item.sl_no || "",
            year_procurement: item.year_procurement || "",
            item_details: item.item_details || "",
            procurement_agency: item.procurement_agency || "",
            value: item.value || "",
            last_status: item.last_status || "",
            last_status_date: item.last_status_date ? item.last_status_date.split('T')[0] : "" // Format date for input
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/admin/procurement/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                fetchProcurement();
            } else {
                const text = await res.text();
                try {
                    const err = JSON.parse(text);
                    alert("Delete failed: " + (err.error || err.message));
                } catch {
                    alert("Delete failed (Parsing Error)");
                    console.error(text);
                }
            }
        } catch (err) {
            console.error(err);
            alert("Delete failed: " + err.message);
        }
    };


    return (
        <div>
            <h2 style={{ color: "#d32f2f", marginBottom: 20 }}>Procurement Management</h2>

            {/* --- FORM SECTION --- */}
            <div style={{ background: "#f9f9f9", padding: 20, marginBottom: 30, borderRadius: 8 }}>
                <h4 style={{ marginBottom: 15 }}>{formMode === "ADD" ? "➕ Add New Item" : "✏️ Edit Item"}</h4>

                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>

                    {/* 1. Basic Info */}
                    <select name="section" value={formData.section} onChange={handleChange} style={input}>
                        <option value="DRILLING">Drilling</option>
                        <option value="MECHANICAL">Mechanical</option>
                        <option value="ELECTRICAL">Electrical</option>
                        <option value="INSTRUMENTAL">Instrumental</option>
                        <option value="HSE">HSE</option>
                        <option value="CEMENT">Cement</option>
                    </select>

                    <input name="head" placeholder="Head (e.g. Capital)" value={formData.head} onChange={handleChange} style={input} />
                    <input name="sl_no" placeholder="Sl. No." value={formData.sl_no} onChange={handleChange} style={input} />

                    <input name="year_procurement" placeholder="Year (e.g. 2023-24)" value={formData.year_procurement} onChange={handleChange} style={input} />
                    <input name="procurement_agency" placeholder="Agency" value={formData.procurement_agency} onChange={handleChange} style={input} />
                    <input name="value" type="number" step="0.01" placeholder="Value (₹)" value={formData.value} onChange={handleChange} style={input} />

                    <input name="last_status" placeholder="Last Status" value={formData.last_status} onChange={handleChange} style={input} />
                    <input name="last_status_date" type="date" placeholder="Status Date" value={formData.last_status_date} onChange={handleChange} style={input} />

                    {/* Full Width */}
                    <textarea
                        name="item_details"
                        placeholder="Item Details *"
                        value={formData.item_details}
                        onChange={handleChange}
                        style={{ ...input, gridColumn: "span 3", height: "60px" }}
                        required
                    />

                    <div style={{ gridColumn: "span 3", marginTop: 10 }}>
                        <button type="submit" style={saveBtn}>
                            {formMode === "ADD" ? "Save Item" : "Update Item"}
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
                                <th style={th}>Section</th>
                                <th style={th}>Details</th>
                                <th style={th}>Year</th>
                                <th style={th}>Value</th>
                                <th style={th}>Status</th>
                                <th style={th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {procurementList.map(item => (
                                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={td}><b>{item.section}</b><br /><span style={sub}>{item.head}</span></td>
                                    <td style={td}>{item.item_details}</td>
                                    <td style={td}>{item.year_procurement}</td>
                                    <td style={td}>₹ {item.value}</td>
                                    <td style={td}>
                                        {item.last_status}
                                        <div style={sub}>{item.last_status_date ? new Date(item.last_status_date).toLocaleDateString() : ""}</div>
                                    </td>
                                    <td style={td}>
                                        <button onClick={() => handleEdit(item)} style={actionBtn}>Edit</button>
                                        <button onClick={() => handleDelete(item.id)} style={{ ...actionBtn, background: "#d32f2f" }}>Delete</button>
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
const input = { width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" };
const saveBtn = { background: "#1976d2", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: "bold" };
const cancelBtn = { background: "#757575", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 4, cursor: "pointer", marginLeft: 10 };
const th = { padding: "10px", textAlign: "left", whiteSpace: "nowrap" };
const td = { padding: "10px", verticalAlign: "top" };
const sub = { fontSize: "11px", color: "#777" };
const actionBtn = { padding: "5px 10px", margin: "0 5px", border: "none", borderRadius: 4, background: "#444", color: "#fff", cursor: "pointer", fontSize: "12px" };

export default ProcurementAdmin;
