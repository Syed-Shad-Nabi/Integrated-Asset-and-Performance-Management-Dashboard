import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const BudgetAdmin = () => {
    const token = localStorage.getItem("admin_token");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);

    const initialForm = {
        year: "2024-25",
        section: "DRILLING",
        capital_assigned: 0, capital_utilized: 0,
        contractual_assigned: 0, contractual_utilized: 0,
        store_assigned: 0, store_utilized: 0,
        spare_assigned: 0, spare_utilized: 0,
        others_assigned: 0, others_utilized: 0,
        misc_assigned: 0, misc_utilized: 0,
        total_assigned: 0, total_utilized: 0
    };

    const [form, setForm] = useState(initialForm);

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/budget`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Handle Input
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update the form state first
        const updatedForm = { ...form, [name]: value };

        // Calculate Totals if a number field is changed
        if (name.includes("_assigned") || name.includes("_utilized")) {
            const heads = ['capital', 'contractual', 'store', 'spare', 'others', 'misc'];

            let tAssigned = 0;
            let tUtilized = 0;

            heads.forEach(h => {
                const assigned = parseFloat(updatedForm[`${h}_assigned`]) || 0;
                const utilized = parseFloat(updatedForm[`${h}_utilized`]) || 0;
                tAssigned += assigned;
                tUtilized += utilized;
            });

            updatedForm.total_assigned = tAssigned;
            updatedForm.total_utilized = tUtilized;
        }

        setForm(updatedForm);
    };

    // Submit Add/Edit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = editId
            ? `${API_BASE_URL}/admin/budget/${editId}`
            : `${API_BASE_URL}/admin/budget`;

        const method = editId ? "PUT" : "POST";

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                alert(editId ? "Budget Updated!" : "Budget Added!");
                setForm(initialForm);
                setEditId(null);
                fetchData();
            } else {
                const err = await res.json();
                alert("Error: " + (err.error || err.message));
            }
        } catch (err) {
            alert("Request Failed: " + err.message);
        }
    };

    // Edit Trigger
    const handleEdit = (item) => {
        setEditId(item.id);
        setForm({
            year: item.year,
            section: item.section,
            capital_assigned: item.capital_assigned,
            capital_utilized: item.capital_utilized,
            contractual_assigned: item.contractual_assigned,
            contractual_utilized: item.contractual_utilized,
            store_assigned: item.store_assigned,
            store_utilized: item.store_utilized,
            spare_assigned: item.spare_assigned,
            spare_utilized: item.spare_utilized,
            others_assigned: item.others_assigned || 0,
            others_utilized: item.others_utilized || 0,
            misc_assigned: item.misc_assigned || 0,
            misc_utilized: item.misc_utilized || 0,
            total_assigned: item.total_assigned || 0,
            total_utilized: item.total_utilized || 0
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Delete Trigger
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this budget record?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/budget/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                fetchData();
            } else {
                alert("Delete failed");
            }
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div>
            <h2 style={{ color: "#d32f2f", marginBottom: 20 }}>Budget Management</h2>

            {/* --- FORM --- */}
            <div style={{ background: "#f9f9f9", padding: 20, marginBottom: 20, borderRadius: 8 }}>
                <h4>{editId ? "✏️ Edit Budget" : "➕ Add Budget"}</h4>
                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" }}>

                    {/* HEADERS */}
                    <div style={{ gridColumn: "span 2" }}>
                        <label>Year</label>
                        <input name="year" value={form.year} onChange={handleChange} style={input} required />
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                        <label>Section</label>
                        <select name="section" value={form.section} onChange={handleChange} style={input}>
                            <option>DRILLING</option>
                            <option>CHEMISTRY</option>
                            <option>CEMENTING</option>
                            <option>OTHERS</option>
                        </select>
                    </div>

                    {/* FINANCIALS */}
                    <h5 style={{ gridColumn: "span 4", marginTop: 10 }}>Capital</h5>
                    <input type="number" placeholder="Assigned" name="capital_assigned" value={form.capital_assigned} onChange={handleChange} style={input} />
                    <input type="number" placeholder="Utilized" name="capital_utilized" value={form.capital_utilized} onChange={handleChange} style={input} />
                    <div style={{ gridColumn: "span 2" }}></div>

                    <h5 style={{ gridColumn: "span 4", marginTop: 5 }}>Contractual</h5>
                    <input type="number" placeholder="Assigned" name="contractual_assigned" value={form.contractual_assigned} onChange={handleChange} style={input} />
                    <input type="number" placeholder="Utilized" name="contractual_utilized" value={form.contractual_utilized} onChange={handleChange} style={input} />
                    <div style={{ gridColumn: "span 2" }}></div>

                    <h5 style={{ gridColumn: "span 4", marginTop: 5 }}>Store</h5>
                    <input type="number" placeholder="Assigned" name="store_assigned" value={form.store_assigned} onChange={handleChange} style={input} />
                    <input type="number" placeholder="Utilized" name="store_utilized" value={form.store_utilized} onChange={handleChange} style={input} />
                    <div style={{ gridColumn: "span 2" }}></div>

                    <h5 style={{ gridColumn: "span 4", marginTop: 5 }}>Spare</h5>
                    <input type="number" placeholder="Assigned" name="spare_assigned" value={form.spare_assigned} onChange={handleChange} style={input} />
                    <input type="number" placeholder="Utilized" name="spare_utilized" value={form.spare_utilized} onChange={handleChange} style={input} />
                    <div style={{ gridColumn: "span 2" }}></div>

                    <h5 style={{ gridColumn: "span 4", marginTop: 5 }}>Others</h5>
                    <input type="number" placeholder="Assigned" name="others_assigned" value={form.others_assigned} onChange={handleChange} style={input} />
                    <input type="number" placeholder="Utilized" name="others_utilized" value={form.others_utilized} onChange={handleChange} style={input} />
                    <div style={{ gridColumn: "span 2" }}></div>

                    <h5 style={{ gridColumn: "span 4", marginTop: 5 }}>Misc</h5>
                    <input type="number" placeholder="Assigned" name="misc_assigned" value={form.misc_assigned} onChange={handleChange} style={input} />
                    <input type="number" placeholder="Utilized" name="misc_utilized" value={form.misc_utilized} onChange={handleChange} style={input} />
                    <div style={{ gridColumn: "span 2" }}></div>

                    <h5 style={{ gridColumn: "span 4", marginTop: 5 }}>Total (Auto-calculated)</h5>
                    <input type="number" placeholder="Assigned" name="total_assigned" value={form.total_assigned} readOnly style={{ ...input, background: "#e0e0e0", cursor: "not-allowed" }} />
                    <input type="number" placeholder="Utilized" name="total_utilized" value={form.total_utilized} readOnly style={{ ...input, background: "#e0e0e0", cursor: "not-allowed" }} />

                    <div style={{ gridColumn: "span 4", marginTop: 15 }}>
                        <button type="submit" style={saveBtn}>{editId ? "Update" : "Save"}</button>
                        {editId && <button type="button" onClick={() => { setEditId(null); setForm(initialForm); }} style={cancelBtn}>Cancel</button>}
                    </div>
                </form>
            </div>

            {/* --- TABLE --- */}
            {loading ? <p>Loading...</p> : (
                <div style={{ overflowX: "auto", marginTop: 20 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, border: "1px solid #ddd", textAlign: "center" }}>
                        <thead>
                            <tr style={{ height: "40px" }}>
                                <th rowSpan="2" style={{ ...th, border: "1px solid #000" }}>YEAR</th>
                                <th rowSpan="2" style={{ ...th, border: "1px solid #000" }}>SECTION</th>

                                <th colSpan="3" style={{ ...th, border: "1px solid #000", background: "#fff" }}>CAPITAL</th>
                                <th colSpan="3" style={{ ...th, border: "1px solid #000", background: "#ffe699" }}>CONTRACTUAL</th>
                                <th colSpan="3" style={{ ...th, border: "1px solid #000", background: "#bdd7ee" }}>STORE</th>
                                <th colSpan="3" style={{ ...th, border: "1px solid #000", background: "#f8cbad" }}>SPARE</th>
                                <th colSpan="3" style={{ ...th, border: "1px solid #000", background: "#e0e0e0" }}>OTHERS</th>
                                <th colSpan="3" style={{ ...th, border: "1px solid #000", background: "#d9ead3" }}>MISC</th>
                                <th rowSpan="2" style={{ ...th, border: "1px solid #000" }}>ACTIONS</th>
                            </tr>
                            <tr>
                                {/* Repeated Sub-headers for each category with matching colors */}
                                {[
                                    { bg: "#fff" },       // Capital
                                    { bg: "#ffe699" },    // Contractual
                                    { bg: "#bdd7ee" },    // Store
                                    { bg: "#f8cbad" },    // Spare
                                    { bg: "#e0e0e0" },    // Others
                                    { bg: "#d9ead3" }     // Misc
                                ].map((style, i) => (
                                    <React.Fragment key={i}>
                                        <th style={{ ...subTh, border: "1px solid #000", background: style.bg }}>ASSIGNED</th>
                                        <th style={{ ...subTh, border: "1px solid #000", background: style.bg }}>UTILIZED</th>
                                        <th style={{ ...subTh, border: "1px solid #000", background: style.bg }}>% UTILIZATION</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(
                                data.reduce((acc, item) => {
                                    (acc[item.year] = acc[item.year] || []).push(item);
                                    return acc;
                                }, {})
                            ).sort().reverse().map(([year, items]) => {
                                // Calculate Yearly Totals based only on visible columns
                                const yearTotals = items.reduce((acc, curr) => ({
                                    capital_assigned: acc.capital_assigned + (parseFloat(curr.capital_assigned) || 0),
                                    capital_utilized: acc.capital_utilized + (parseFloat(curr.capital_utilized) || 0),
                                    contractual_assigned: acc.contractual_assigned + (parseFloat(curr.contractual_assigned) || 0),
                                    contractual_utilized: acc.contractual_utilized + (parseFloat(curr.contractual_utilized) || 0),
                                    store_assigned: acc.store_assigned + (parseFloat(curr.store_assigned) || 0),
                                    store_utilized: acc.store_utilized + (parseFloat(curr.store_utilized) || 0),
                                    spare_assigned: acc.spare_assigned + (parseFloat(curr.spare_assigned) || 0),
                                    spare_utilized: acc.spare_utilized + (parseFloat(curr.spare_utilized) || 0),
                                    others_assigned: acc.others_assigned + (parseFloat(curr.others_assigned) || 0),
                                    others_utilized: acc.others_utilized + (parseFloat(curr.others_utilized) || 0),
                                    misc_assigned: acc.misc_assigned + (parseFloat(curr.misc_assigned) || 0),
                                    misc_utilized: acc.misc_utilized + (parseFloat(curr.misc_utilized) || 0),
                                }), {
                                    capital_assigned: 0, capital_utilized: 0,
                                    contractual_assigned: 0, contractual_utilized: 0,
                                    store_assigned: 0, store_utilized: 0,
                                    spare_assigned: 0, spare_utilized: 0,
                                    others_assigned: 0, others_utilized: 0,
                                    misc_assigned: 0, misc_utilized: 0,
                                });

                                return (
                                    <React.Fragment key={year}>
                                        {items.map((item, index) => (
                                            <tr key={item.id} style={{ borderBottom: "1px solid #000" }}>
                                                {index === 0 && (
                                                    <td rowSpan={items.length + 1} style={{ ...td, fontWeight: "bold", border: "1px solid #000", verticalAlign: "middle" }}>
                                                        {year}
                                                    </td>
                                                )}
                                                <td style={{ ...td, border: "1px solid #000", textAlign: "left", fontWeight: "bold" }}>{item.section}</td>

                                                {/* DATA CELLS WITH SPECIFIC COLORS */}
                                                <DataCells item={item} type="capital" /> {/* White */}
                                                <DataCells item={item} type="contractual" bg="#fff2cc" /> {/* Light Yellow */}
                                                <DataCells item={item} type="store" bg="#deebf7" /> {/* Light Blue */}
                                                <DataCells item={item} type="spare" bg="#fce4d6" /> {/* Light Red/Orange */}
                                                <DataCells item={item} type="others" bg="#f5f5f5" /> {/* Light Grey */}
                                                <DataCells item={item} type="misc" bg="#e2f0d9" /> {/* Light Green */}

                                                <td style={{ ...td, border: "1px solid #000" }}>
                                                    <button onClick={() => handleEdit(item)} style={editIconBtn}>✏️</button>
                                                    <button onClick={() => handleDelete(item.id)} style={delIconBtn}>🗑️</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {/* YEARLY TOTAL ROW - MATCHING THOSE DARK BLOCKS */}
                                        <tr style={{ fontWeight: "bold" }}>
                                            <td style={{ ...td, border: "1px solid #000", textAlign: "center", background: "#f8cbad" }}>TOTAL</td> {/* Orangeish Total Label background from image */}

                                            <DataCells item={yearTotals} type="capital" bg="#595959" isTotal />
                                            <DataCells item={yearTotals} type="contractual" bg="#7f6000" isTotal />
                                            <DataCells item={yearTotals} type="store" bg="#1f4e78" isTotal />
                                            <DataCells item={yearTotals} type="spare" bg="#833c0c" isTotal />
                                            <DataCells item={yearTotals} type="others" bg="#616161" isTotal />
                                            <DataCells item={yearTotals} type="misc" bg="#38761d" isTotal />

                                            <td style={{ border: "1px solid #000" }}></td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Styles
// Helper Component for Table Cells
const DataCells = ({ item, type, bg, isTotal }) => {
    const assigned = parseFloat(item[`${type}_assigned`]) || 0;
    const utilized = parseFloat(item[`${type}_utilized`]) || 0;
    const percentage = assigned > 0 ? ((utilized / assigned) * 100).toFixed(1) + "%" : "";

    const cellStyle = {
        padding: 5,
        border: "1px solid #000", // Black borders
        textAlign: "center",
        background: bg || "transparent",
        color: isTotal ? "white" : "inherit",
        fontSize: "11px"
    };

    return (
        <>
            <td style={cellStyle}>{assigned || ""}</td>
            <td style={cellStyle}>{utilized || ""}</td>
            <td style={{ ...cellStyle, fontWeight: "bold" }}>{percentage}</td>
        </>
    );
};

// Styles
const input = { width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4 };
const saveBtn = { background: "#1976d2", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: "bold" };
const cancelBtn = { background: "#757575", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 4, cursor: "pointer", marginLeft: 10 };
const th = { padding: 8, textAlign: "center", fontWeight: "bold", fontSize: "12px" };
const subTh = { padding: 4, fontSize: "10px", textAlign: "center", fontWeight: "bold" };
const td = { padding: 8 };
const actionBtn = { padding: "5px 10px", margin: "0 5px", border: "none", borderRadius: 4, background: "#444", color: "#fff", cursor: "pointer" };
const editIconBtn = { background: "transparent", border: "none", cursor: "pointer", fontSize: "16px", padding: "0 5px" };
const delIconBtn = { background: "transparent", border: "none", cursor: "pointer", fontSize: "16px", padding: "0 5px" };

export default BudgetAdmin;
