
import os

components = [
    {
        "name": "DrillSitesAdmin",
        "title": "Drill Sites Status",
        "api": "drill-sites",
        "fields": [
            {"name": "rig_name", "label": "Rig Name", "type": "text"},
            {"name": "location", "label": "Location", "type": "text"},
            {"name": "status", "label": "Status", "type": "select", "options": ["Active", "Idle", "Maintenance", "Decommissioned"]},
            {"name": "target_depth", "label": "Target Depth", "type": "text"},
            {"name": "current_depth", "label": "Current Depth", "type": "text"},
            {"name": "remarks", "label": "Remarks", "type": "text"},
            {"name": "image_url", "label": "Image URL", "type": "text"}
        ]
    },
    {
        "name": "InitiativesAdmin",
        "title": "New Initiatives / Ideas / Tech",
        "api": "initiatives",
        "fields": [
            {"name": "title", "label": "Title", "type": "text"},
            {"name": "description", "label": "Description", "type": "text"},
            {"name": "benefits", "label": "Benefits", "type": "text"},
            {"name": "status", "label": "Status", "type": "select", "options": ["Proposed", "In Progress", "Implemented", "Rejected"]},
            {"name": "implementation_date", "label": "Impl. Date", "type": "date"},
            {"name": "image_url", "label": "Image URL", "type": "text"}
        ]
    },
    {
        "name": "AwardsAdmin",
        "title": "Awards & Appreciations",
        "api": "awards",
        "fields": [
            {"name": "title", "label": "Award Title", "type": "text"},
            {"name": "recipient", "label": "Recipient", "type": "text"},
            {"name": "date_received", "label": "Date Received", "type": "date"},
            {"name": "category", "label": "Category", "type": "text"},
            {"name": "description", "label": "Description", "type": "text"},
            {"name": "image_url", "label": "Image URL", "type": "text"}
        ]
    },
    {
        "name": "AuditStatusAdmin",
        "title": "Audit & Other Observations",
        "api": "audit-status",
        "fields": [
            {"name": "observation", "label": "Observation", "type": "text"},
            {"name": "category", "label": "Category", "type": "select", "options": ["Safety", "Technical", "Financial", "Compliance"]},
            {"name": "risk_level", "label": "Risk Level", "type": "select", "options": ["Low", "Medium", "High", "Critical"]},
            {"name": "status", "label": "Status", "type": "select", "options": ["Open", "In Progress", "Closed"]},
            {"name": "action_taken", "label": "Action Taken", "type": "text"},
            {"name": "closure_date", "label": "Closure Date", "type": "date"},
            {"name": "image_url", "label": "Image URL", "type": "text"}
        ]
    },
    {
        "name": "CertificationsAdmin",
        "title": "Certification & License Status",
        "api": "certifications",
        "fields": [
            {"name": "certificate_name", "label": "Certificate Name", "type": "text"},
            {"name": "issuing_authority", "label": "Issuing Authority", "type": "text"},
            {"name": "issue_date", "label": "Issue Date", "type": "date"},
            {"name": "expiry_date", "label": "Expiry Date", "type": "date"},
            {"name": "status", "label": "Status", "type": "select", "options": ["Valid", "Expiring Soon", "Expired"]},
            {"name": "image_url", "label": "Image URL", "type": "text"}
        ]
    },
    {
        "name": "UpcomingEventsAdmin",
        "title": "Upcoming Events",
        "api": "upcoming-events",
        "fields": [
            {"name": "event_name", "label": "Event Name", "type": "text"},
            {"name": "event_date", "label": "Date", "type": "date"},
            {"name": "location", "label": "Location", "type": "text"},
            {"name": "description", "label": "Description", "type": "text"},
            {"name": "organizer", "label": "Organizer", "type": "text"},
            {"name": "image_url", "label": "Image URL", "type": "text"}
        ]
    },
    {
        "name": "ArchiveAdmin",
        "title": "Drilling References / Archive",
        "api": "drilling-archive",
        "fields": [
            {"name": "title", "label": "Title", "type": "text"},
            {"name": "category", "label": "Category", "type": "text"},
            {"name": "year", "label": "Year", "type": "text"},
            {"name": "description", "label": "Description", "type": "text"},
            {"name": "link_url", "label": "Link/Reference", "type": "text"},
            {"name": "image_url", "label": "Image URL", "type": "text"}
        ]
    }
]

TEMPLATE = """
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

export default function {{COMPONENT_NAME}}() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({{INITIAL_STATE}});
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/{{API_ENDPOINT}}`)
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
      ? `${API_BASE_URL}/admin/{{API_ENDPOINT}}/${editId}`
      : `${API_BASE_URL}/admin/{{API_ENDPOINT}}`;
    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        alert(editId ? "Updated Successfully!" : "Added Successfully!");
        setForm({{INITIAL_STATE}});
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
    fetch(`${API_BASE_URL}/admin/{{API_ENDPOINT}}/${id}`, { method: "DELETE" })
      .then(() => fetchData())
      .catch((err) => console.error(err));
  };

  const inputStyle = { padding: 8, border: "1px solid #ccc", borderRadius: 4, width: "100%" };
  const th = { padding: 10, background: "#333", color: "#fff", border: "1px solid #555" };
  const td = { padding: 8, border: "1px solid #ddd", textAlign: "center" };

  return (
    <div>
      <h2 style={{ color: "#d32f2f", marginBottom: 20 }}>{{TITLE}}</h2>

      {/* FORM */}
      <div style={{ background: "#f9f9f9", padding: 20, marginBottom: 20, borderRadius: 8 }}>
        <h4>{editId ? "✏️ Edit" : "➕ Add New"}</h4>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          
          {{FORM_FIELDS}}

          <div style={{ gridColumn: "span 2", marginTop: 10 }}>
            <button type="submit" style={{ background: "#b00020", color: "#fff", padding: "10px 20px", border: "none", cursor: "pointer", marginRight: 10 }}>
              {editId ? "Update" : "Save"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({{INITIAL_STATE}});
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
              {{TABLE_HEADERS}}
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
                <tr><td colSpan="10" style={{ padding: 20 }}>No records found.</td></tr>
            ) : (
                data.map((item) => (
                    <tr key={item.id}>
                        {{TABLE_CELLS}}
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
"""

def generate_admin_pages():
    base_path = "d:/Ongc_Machine_Project/frontend/src/admin/pages"
    if not os.path.exists(base_path):
        os.makedirs(base_path)

    for comp in components:
        # Generate Initial State
        initial_state = "{\n" + ",\n".join([f'    {f["name"]}: ""' for f in comp["fields"]]) + "\n  }"
        
        # Generate Form Fields
        form_fields_str = ""
        for f in comp["fields"]:
            span = 'style={{ gridColumn: "span 2" }}' if f["name"] in ["description", "remarks", "image_url"] else ""
            field_html = f'<div {span}>\n'
            field_html += f'  <label style={{{{ display: "block", marginBottom: 5 }}}}>{f["label"]}</label>\n'
            
            if f["type"] == "text":
                field_html += f'  <input name="{f["name"]}" value={{form.{f["name"]}}} onChange={{handleChange}} style={{inputStyle}} />\n'
            elif f["type"] == "date":
                field_html += f'  <input type="date" name="{f["name"]}" value={{form.{f["name"]}}} onChange={{handleChange}} style={{inputStyle}} />\n'
            elif f["type"] == "select":
                options = "".join([f'<option>{opt}</option>' for opt in f["options"]])
                field_html += f'  <select name="{f["name"]}" value={{form.{f["name"]}}} onChange={{handleChange}} style={{inputStyle}}>\n    {options}\n  </select>\n'
            
            field_html += '</div>\n'
            form_fields_str += field_html

        # Generate Table Headers
        table_headers = "\n".join([f'<th style={{th}}>{f["label"]}</th>' for f in comp["fields"]])
        
        # Generate Table Cells
        table_cells = ""
        for f in comp["fields"]:
            if f["name"] == "image_url":
                 table_cells += f'<td style={{td}}>{{item.image_url ? <a href={{item.image_url}} target="_blank">View</a> : "-"}}</td>\n'
            else:
                 table_cells += f'<td style={{td}}>{{item.{f["name"]}}}</td>\n'

        # Replace placeholders
        content = TEMPLATE.replace("{{COMPONENT_NAME}}", comp["name"])
        content = content.replace("{{TITLE}}", comp["title"])
        content = content.replace("{{API_ENDPOINT}}", comp["api"])
        content = content.replace("{{INITIAL_STATE}}", initial_state)
        content = content.replace("{{FORM_FIELDS}}", form_fields_str)
        content = content.replace("{{TABLE_HEADERS}}", table_headers)
        content = content.replace("{{TABLE_CELLS}}", table_cells)

        # Write File
        file_path = os.path.join(base_path, f"{comp['name']}.jsx")
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(content)
        
        print(f"Generated {file_path}")

if __name__ == "__main__":
    generate_admin_pages()
