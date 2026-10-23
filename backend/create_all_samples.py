import pandas as pd
import os

# Define schemas matching excel_sync_v2.py
schemas = {
    "sample_machinery.xlsx": {
        "columns": ["equipment_name", "section", "location", "model", "present_status", "class", "sub_class", "make", "oem_sl_no", "ongc_asset_no", "last_received_from", "remarks"],
        "data": [
            ["Rig A", "DRILLING", "Mumbai High", "X-100", "Working", "A", "Deep", "BHEL", "12345", "ONGC-001", "Store", "Good condition"],
            ["Pump B", "CEMENTING", "Ahmedabad", "CP-500", "Repair", "B", "Surface", "Wartsila", "67890", "ONGC-002", "Rig A", "Needs seals"]
        ]
    },
    "sample_performance.xlsx": {
        "columns": ["parameter", "target_value", "actual_value", "unit", "status", "remarks", "image_url"],
        "data": [
            ["Drilling Efficiency", "100", "95", "%", "On Track", "Slightly below target", ""],
            ["Safety Incidents", "0", "0", "Count", "On Track", "No incidents", ""]
        ]
    },
    "sample_drill_sites.xlsx": {
        "columns": ["planning_year", "location_release_name", "basin_name", "block_name", "block_allotment_details", "block_validity", "stacking_date", "laq_status", "civil_work_start_date", "civil_work_end_date", "rfd_date", "drill_site_name", "image_url"],
        "data": [
            ["2024-25", "Loc-X", "Western", "Block-1", "Details...", "2030", "2024-01-01", "Cleared", "2024-02-01", "2024-03-01", "2024-04-01", "Site Alpha", ""]
        ]
    },
   "sample_initiatives.xlsx": {
        "columns": ["year", "category", "year_used_at", "used_at", "description_brief", "description_detail", "pros", "cons", "benefits", "cost_effectiveness", "remarks"],
        "data": [
            ["2024", "Tech", "2023", "Rig B", "AI Implementation", "Used AI for log analysis", "Fast", "Costly", "Better data", "High", "Pilot success"]
        ]
    },
    "sample_awards.xlsx": {
        "columns": ["category", "sub_category", "year", "awarded_by", "description_brief", "description_detail", "remarks"],
        "data": [
            ["Safety", "Best Rig", "2023", "Ministry", "Best Safety Record", "Zero incidents", "Proud moment"]
        ]
    },
    "sample_audit.xlsx": {
        "columns": ["audit_category", "audit_year", "auditing_agency", "section", "paras_raised", "paras_complied_today", "paras_complied_3m", "paras_complied_6m", "paras_complied_9m", "paras_complied_beyond_9m", "remarks"],
        "data": [
            ["Internal", "2023-24", "Audit Team A", "Drilling", 10, 2, 3, 2, 1, 2, "Ongoing"]
        ]
    },
    "sample_certifications.xlsx": {
        "columns": ["category", "sub_category", "certified_on", "certified_by", "description_brief", "validity", "status", "responsible_section", "remarks"],
        "data": [
            ["ISO", "9001", "2023-01-01", "BSI", "Quality Mgmt", "2026", "Active", "QHSE", "Renewed"]
        ]
    },
    "sample_upcoming_events.xlsx": {
        "columns": ["event_type", "status", "event_date", "duration", "place", "eligibility", "description_brief", "action_to_be_taken", "nominated_persons", "my_space_link"],
        "data": [
            ["Training", "Confirmed", "2024-05-01", "3 Days", "Delhi", "Engineers", "Advanced Drilling", "Nominate staff", "Mr. X", "http://..."]
        ]
    },
    "sample_drilling_references.xlsx": {
        "columns": ["reference_type", "event", "date_of_event", "brief", "my_space_link", "pass_key", "remarks"],
        "data": [
            ["Manual", "Release v1", "2023-12-01", "Drilling Manual", "http://...", "1234", "Updated"]
        ]
    },
    "sample_budget.xlsx": {
        "columns": ["year", "section", "capital_assigned", "capital_utilized", "contractual_assigned", "contractual_utilized", "store_assigned", "store_utilized", "spare_assigned", "spare_utilized", "others_assigned", "others_utilized", "misc_assigned", "misc_utilized"],
        "data": [
            ["2024-25", "DRILLING", 100000, 50000, 20000, 10000, 5000, 1000, 5000, 2000, 1000, 500, 500, 100]
        ]
    },
    "sample_procurement.xlsx": {
        "columns": ["section", "head", "sl_no", "year_procurement", "item_details", "procurement_agency", "value", "last_status", "last_status_date"],
        "data": [
            ["Drilling", "Capex", "001", "2024", "New Rig", "Global Tender", 5000000, "Tender Floated", "2024-02-15"]
        ]
    },
    "sample_rate_contracts.xlsx": {
        "columns": ["section", "sr_no", "category", "equipment", "oem_details", "rc_detail", "validity_of_rc", "price_validity", "present_status"],
        "data": [
            ["MECHANICAL", "101", "SPARES", "Engine Parts", "Cummins", "RC-2024-001", "2025-12-31", "Fixed", "IN-FORCE"]
        ]
    }
}

output_dir = "sample_files"
os.makedirs(output_dir, exist_ok=True)

for filename, config in schemas.items():
    df = pd.DataFrame(config["data"], columns=config["columns"])
    output_path = os.path.join(output_dir, filename)
    df.to_excel(output_path, index=False)
    print(f"Generated {output_path}")

print("All sample files generated in 'sample_files' directory.")
