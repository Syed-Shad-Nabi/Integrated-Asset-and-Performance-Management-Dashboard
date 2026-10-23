import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const TemplatesAdmin = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("admin_token");

    // Form State
    const [formMode, setFormMode] = useState("ADD"); // ADD | EDIT
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        template_key: "",
        template_name: "",
        route: "",
        image: ""
    });

    // Fetch Templates
    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/templates`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setTemplates(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit Form (Add or Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.template_key || !formData.template_name) return alert("Key and Name required!");

        const endpoint = formMode === "ADD"
            ? `${API_BASE_URL}/admin/templates/add`
            : `${API_BASE_URL}/admin/templates/update`;

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert(formMode === "ADD" ? "Template Added!" : "Template Updated!");
                setFormData({ template_key: "", template_name: "", route: "", image: "" });
                setFormMode("ADD");
                fetchTemplates();
            } else {
                const err = await res.json();
                alert("Error: " + err.error);
            }
        } catch (err) {
            alert("Request failed");
        }
    };

    // Edit Click
    const handleEdit = (tmpl) => {
        setFormMode("EDIT");
        setEditId(tmpl.template_id);
        setFormData({
            template_key: tmpl.template_key,
            template_name: tmpl.template_name,
            route: tmpl.route,
            image: tmpl.image
        });
    };

    // Delete Click
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This cannot be undone.")) return;

        try {
            await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTemplates();
        } catch (err) {
            alert("Delete failed");
        }
    };

    // Toggle Active
    const handleToggle = async (key, currentStatus) => {
        try {
            await fetch(`${API_BASE_URL}/admin/templates/toggle`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ template_key: key, is_active: !currentStatus })
            });
            fetchTemplates(); // Refresh to show new status
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2 style={{ color: "#d32f2f", marginBottom: 20 }}>Manage Templates</h2>

            {/* --- FORM SECTION --- */}
            <div style={{ background: "#f9f9f9", padding: 20, marginBottom: 30, borderRadius: 8 }}>
                <h4>{formMode === "ADD" ? "➕ Add New Template" : "✏️ Edit Template"}</h4>
                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                        <label>Template Key (Unique ID)</label>
                        <input
                            name="template_key"
                            value={formData.template_key}
                            onChange={handleChange}
                            disabled={formMode === "EDIT"} // Key usually immutable or needs special handling
                            style={inputStyle}
                            placeholder="e.g. BUDGET_2024"
                        />
                    </div>
                    <div>
                        <label>Display Name</label>
                        <input
                            name="template_name"
                            value={formData.template_name}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="e.g. Budget 2024"
                        />
                    </div>
                    <div>
                        <label>Route (URL Path)</label>
                        <input
                            name="route"
                            value={formData.route}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="/budget-2024"
                        />
                    </div>
                    <div>
                        <label>Image URL (or path)</label>
                        <input
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="/images/icon.png"
                        />
                    </div>
                    <div style={{ gridColumn: "span 2", marginTop: 10 }}>
                        <button type="submit" style={saveBtn}>
                            {formMode === "ADD" ? "Create Template" : "Update Template"}
                        </button>
                        {formMode === "EDIT" && (
                            <button type="button" onClick={() => { setFormMode("ADD"); setFormData({ template_key: "", template_name: "", route: "", image: "" }); }} style={cancelBtn}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* --- TABLE SECTION --- */}
            {loading ? <p>Loading...</p> : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: "#333", color: "#fff" }}>
                                <th style={th}>ID</th>
                                <th style={th}>Key</th>
                                <th style={th}>Name</th>
                                <th style={th}>Status</th>
                                <th style={th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {templates.map(t => (
                                <tr key={t.template_id} style={{ borderBottom: "1px solid #ddd" }}>
                                    <td style={td}>{t.template_id}</td>
                                    <td style={td}>{t.template_key}</td>
                                    <td style={{ ...td, whiteSpace: "nowrap" }}>{t.template_name}</td>
                                    <td style={td}>
                                        <span
                                            onClick={() => handleToggle(t.template_key, t.is_active)}
                                            style={{
                                                cursor: "pointer",
                                                padding: "4px 8px",
                                                borderRadius: 4,
                                                background: t.is_active ? "#c8e6c9" : "#ffcdd2",
                                                color: t.is_active ? "#2e7d32" : "#c62828"
                                            }}
                                        >
                                            {t.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td style={td}>
                                        <button onClick={() => handleEdit(t)} style={actionBtn}>Edit</button>
                                        <button onClick={() => handleDelete(t.template_id)} style={{ ...actionBtn, background: "#d32f2f" }}>Delete</button>
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
const inputStyle = { width: "100%", padding: 8, marginTop: 4, borderRadius: 4, border: "1px solid #ccc" };
const saveBtn = { background: "#1976d2", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: "bold" };
const cancelBtn = { background: "#757575", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 4, cursor: "pointer", marginLeft: 10 };
const th = { padding: 10, textAlign: "left" };
const td = { padding: 10 };
const actionBtn = { padding: "5px 10px", margin: "0 5px", border: "none", borderRadius: 4, background: "#444", color: "#fff", cursor: "pointer" };

export default TemplatesAdmin;
