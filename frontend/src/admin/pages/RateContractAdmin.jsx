
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

export default function RateContractAdmin() {
    const [contracts, setContracts] = useState([]);
    const [form, setForm] = useState({
        section: "MECHANICAL",
        sr_no: "",
        category: "SPARES",
        equipment: "",
        oem_details: "",
        rc_detail: "",
        validity_of_rc: "",
        price_validity: "",
        present_status: "IN-FORCE"
    });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/admin/rate-contracts`)
            .then((res) => res.json())
            .then((data) => {
                setContracts(data);
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
            ? `${API_BASE_URL}/admin/rate-contracts/${editId}`
            : `${API_BASE_URL}/admin/rate-contracts`;
        const method = editId ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
            .then((res) => res.json())
            .then(() => {
                alert(editId ? "Contract Updated!" : "Contract Added!");
                setForm({
                    section: "MECHANICAL",
                    sr_no: "",
                    category: "SPARES",
                    equipment: "",
                    oem_details: "",
                    rc_detail: "",
                    validity_of_rc: "",
                    price_validity: "",
                    present_status: "IN-FORCE"
                });
                setEditId(null);
                fetchContracts();
            })
            .catch((err) => console.error(err));
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setForm(item);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this contract?")) return;
        fetch(`${API_BASE_URL}/admin/rate-contracts/${id}`, { method: "DELETE" })
            .then(() => fetchContracts())
            .catch((err) => console.error(err));
    };

    // Styles
    const inputStyle = { padding: 8, border: "1px solid #ccc", borderRadius: 4, width: "100%" };
    const th = { padding: 10, background: "#333", color: "#fff", border: "1px solid #555" };
    const td = { padding: 8, border: "1px solid #ddd", textAlign: "center" };

    return (
        <div>
            <h2 style={{ color: "#d32f2f", marginBottom: 20 }}>Rate Contracts Management</h2>

            {/* FORM */}
            <div style={{ background: "#f9f9f9", padding: 20, marginBottom: 20, borderRadius: 8 }}>
                <h4>{editId ? "✏️ Edit Contract" : "➕ Add Contract"}</h4>
                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>

                    <div>
                        <label style={{ display: "block", marginBottom: 5 }}>Section</label>
                        <input name="section" value={form.section} onChange={handleChange} style={inputStyle} list="sections" />
                        <datalist id="sections">
                            <option value="MECHANICAL" />
                            <option value="ELECTRICAL" />
                            <option value="INSTRUMENTATION" />
                        </datalist>
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: 5 }}>Sr No</label>
                        <input type="number" name="sr_no" value={form.sr_no} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 5 }}>Category</label>
                        <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                            <option>SPARES</option>
                            <option>SERVICE</option>
                            <option>CONSUMABLES</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 5 }}>Present Status</label>
                        <select name="present_status" value={form.present_status} onChange={handleChange} style={inputStyle}>
                            <option value="IN-FORCE">IN-FORCE</option>
                            <option value="EXPIRED">EXPIRED</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", marginBottom: 5 }}>Equipment</label>
                        <input name="equipment" value={form.equipment} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", marginBottom: 5 }}>OEM Details</label>
                        <input name="oem_details" value={form.oem_details} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 5 }}>Rate Contract Detail</label>
                        <input name="rc_detail" value={form.rc_detail} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: 5 }}>Validity of RC (Date)</label>
                        <input name="validity_of_rc" value={form.validity_of_rc} onChange={handleChange} style={inputStyle} placeholder="DD.MM.YYYY" />
                    </div>

                    <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", marginBottom: 5 }}>Price Validity</label>
                        <input name="price_validity" value={form.price_validity} onChange={handleChange} style={inputStyle} />
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
                                        section: "MECHANICAL",
                                        sr_no: "",
                                        category: "SPARES",
                                        equipment: "",
                                        oem_details: "",
                                        rc_detail: "",
                                        validity_of_rc: "",
                                        price_validity: "",
                                        present_status: "IN-FORCE"
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
            <h4 style={{ marginBottom: 10 }}>Existing Contracts</h4>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={th}>Section</th>
                            <th style={th}>Sr</th>
                            <th style={th}>Category</th>
                            <th style={th}>Equipment</th>
                            <th style={th}>OEM</th>
                            <th style={th}>RC Detail</th>
                            <th style={th}>Validity</th>
                            <th style={th}>Status</th>
                            <th style={th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.length === 0 ? (
                            <tr><td colSpan="9" style={{ padding: 20 }}>No contracts found.</td></tr>
                        ) : (
                            contracts.map((item) => (
                                <tr key={item.id}>
                                    <td style={td}>{item.section}</td>
                                    <td style={td}>{item.sr_no}</td>
                                    <td style={td}>{item.category}</td>
                                    <td style={{ ...td, textAlign: "left" }}>{item.equipment}</td>
                                    <td style={{ ...td, textAlign: "left" }}>{item.oem_details}</td>
                                    <td style={td}>{item.rc_detail}</td>
                                    <td style={td}>{item.validity_of_rc}</td>
                                    <td style={{ ...td, color: item.present_status === "EXPIRED" ? "red" : "green", fontWeight: "bold" }}>
                                        {item.present_status}
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
