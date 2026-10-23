
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

const TEMPLATES = [
    { key: "machinery", label: "Machinery (Equipment)" },
    { key: "performance", label: "Performance" },
    { key: "drill_sites", label: "Drill Sites Status" },
    { key: "initiatives", label: "New Initiatives" },
    { key: "awards", label: "Awards" },
    { key: "audit", label: "Audit Status" },
    { key: "certifications", label: "Certifications" },
    { key: "upcoming_events", label: "Upcoming Events" },
    { key: "drilling_references", label: "Drilling References" },
    { key: "budget", label: "Budget" },
    { key: "procurement", label: "Procurement" },
    { key: "rate_contracts", label: "Rate Contracts" }
];

const ExcelSyncTest = () => {
    const [selectedTemplate, setSelectedTemplate] = useState("machinery");
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [syncToLive, setSyncToLive] = useState(false); // NEW STATE

    const fetchData = async (type, isLive) => {
        try {
            const target = isLive ? 'live' : 'test';
            const response = await fetch(`${API_BASE_URL}/test/data?type=${type}&target=${target}`);
            const result = await response.json();
            if (Array.isArray(result)) {
                setData(result);
            } else {
                setData([]);
                console.error("Unexpected response:", result);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        }
    };

    useEffect(() => {
        fetchData(selectedTemplate, syncToLive);
    }, [selectedTemplate, syncToLive]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSync = async () => {
        if (!file) {
            setMessage("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', selectedTemplate);
        formData.append('target', syncToLive ? 'live' : 'test');

        setLoading(true);
        setMessage("Syncing...");

        try {
            const response = await fetch(`${API_BASE_URL}/test/sync`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                setMessage(result.message);
                fetchData(selectedTemplate, syncToLive); // Refresh table
            } else {
                setMessage("Error: " + (result.error || "Unknown error"));
            }
        } catch (error) {
            setMessage("Error syncing file.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to get table headers dynamically from data keys
    const getHeaders = () => {
        if (data.length === 0) return [];
        return Object.keys(data[0]);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2>Excel Sync Test (All Templates)</h2>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                <h3>1. Select Template & Upload</h3>

                <div style={{ marginBottom: 15 }}>
                    <label style={{ fontWeight: "bold", marginRight: 10 }}>Select Template:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <select
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            style={{ padding: 8, borderRadius: 4, minWidth: 200 }}
                        >
                            {TEMPLATES.map(t => (
                                <option key={t.key} value={t.key}>{t.label}</option>
                            ))}
                        </select>

                        <a
                            href={`${API_BASE_URL}/api/test/sample/${selectedTemplate}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ marginLeft: 15, fontSize: "14px", color: "#007bff", textDecoration: "none", fontWeight: "bold" }}
                        >
                            ⬇ Download Sample
                        </a>
                    </div>
                </div>

                <p style={{ fontSize: '0.9em', color: '#666' }}>
                    Upload an .xlsx file. The columns must match the expected schema for <b>{TEMPLATES.find(t => t.key === selectedTemplate)?.label}</b>.
                </p>

                <div style={{ marginBottom: 15, padding: 10, background: syncToLive ? "#ffebee" : "#e8f5e9", border: "1px solid #ccc", borderRadius: 4 }}>
                    <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontWeight: "bold", color: syncToLive ? "#d32f2f" : "#2e7d32" }}>
                        <input
                            type="checkbox"
                            checked={syncToLive}
                            onChange={(e) => setSyncToLive(e.target.checked)}
                            style={{ marginRight: 10, width: 20, height: 20 }}
                        />
                        {syncToLive ? "⚠️ SYNC TO LIVE DATABASE (Visible on Home Page)" : "✅ Sync to TEST Database (Safe Mode)"}
                    </label>
                </div>

                <input type="file" accept=".xlsx" onChange={handleFileChange} />

                <button
                    onClick={handleSync}
                    disabled={loading}
                    style={{
                        marginLeft: '10px',
                        padding: '8px 16px',
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Syncing...' : 'Sync Now'}
                </button>

                {message && <p style={{ marginTop: '10px', fontWeight: 'bold', color: message.startsWith("Error") ? "red" : "green" }}>{message}</p>}
            </div>

            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>2. Synced Data ({data.length} records) - <span style={{ color: syncToLive ? "red" : "green" }}>{syncToLive ? "LIVE DB" : "TEST DB"}</span></h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '12px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#333', color: '#fff' }}>
                                {getHeaders().map(key => (
                                    <th key={key} style={thStyle}>{key.toUpperCase().replace(/_/g, ' ')}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, idx) => (
                                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f8f8' }}>
                                    {getHeaders().map(key => (
                                        <td key={key} style={tdStyle}>{row[key]}</td>
                                    ))}
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan="100%" style={{ textAlign: 'center', padding: '20px' }}>No data found for {selectedTemplate}.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const thStyle = {
    padding: '10px',
    textAlign: 'left',
    border: '1px solid #555',
    whiteSpace: 'nowrap'
};

const tdStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    whiteSpace: 'nowrap'
};

export default ExcelSyncTest;
