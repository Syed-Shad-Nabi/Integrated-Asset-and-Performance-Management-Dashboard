from flask import Blueprint, request, jsonify, send_file
import pandas as pd
import mysql.connector
import os
from config import DB_CONFIG

excel_bp_v2 = Blueprint('excel_bp_v2', __name__)

# Test DB Config
TEST_DB_CONFIG = DB_CONFIG.copy()
TEST_DB_CONFIG["database"] = "ongc_test_db"

@excel_bp_v2.route('/api/test/sample/<template_type>', methods=['GET'])
def download_sample(template_type):
    if template_type not in TEMPLATE_CONFIG:
        return jsonify({"error": "Invalid template type"}), 400
    
    filename = f"sample_{template_type}.xlsx"
    file_path = os.path.join(os.getcwd(), "sample_files", filename)
    
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({"error": "Sample file not found"}), 404


def get_db(target="test"):
    if target == "live":
        return mysql.connector.connect(**DB_CONFIG)
    else:
        return mysql.connector.connect(**TEST_DB_CONFIG)

# Mapping Frontend "Types" to Database "Tables" and their columns (sequence matters for ordered insert)
# Note: we exclude 'id' as it is auto-increment
TEMPLATE_CONFIG = {
    "machinery": {
        "table": "equipment",
        "columns": ["equipment_name", "section", "location", "model", "present_status", "class", "sub_class", "make", "oem_sl_no", "ongc_asset_no", "last_received_from", "remarks"]
    },
    "performance": {
        "table": "performance",
        "columns": ["parameter", "target_value", "actual_value", "unit", "status", "remarks", "image_url"]
    },
    "drill_sites": {
        "table": "drill_sites",
        "columns": ["planning_year", "location_release_name", "basin_name", "block_name", "block_allotment_details", "block_validity", "stacking_date", "laq_status", "civil_work_start_date", "civil_work_end_date", "rfd_date", "drill_site_name", "image_url"]
    },
    "initiatives": {
        "table": "initiatives",
        "columns": ["year", "category", "year_used_at", "used_at", "description_brief", "description_detail", "pros", "cons", "benefits", "cost_effectiveness", "remarks"]
    },
    "awards": {
        "table": "awards",
        "columns": ["category", "sub_category", "year", "awarded_by", "description_brief", "description_detail", "remarks"]
    },
    "audit": {
        "table": "audit",
        "columns": ["audit_category", "audit_year", "auditing_agency", "section", "paras_raised", "paras_complied_today", "paras_complied_3m", "paras_complied_6m", "paras_complied_9m", "paras_complied_beyond_9m", "remarks"]
    },
    "certifications": {
        "table": "certifications",
        "columns": ["category", "sub_category", "certified_on", "certified_by", "description_brief", "validity", "status", "responsible_section", "remarks"]
    },
    "upcoming_events": {
        "table": "upcoming_events",
        "columns": ["event_type", "status", "event_date", "duration", "place", "eligibility", "description_brief", "action_to_be_taken", "nominated_persons", "my_space_link"]
    },
    "drilling_references": {
        "table": "drilling_references",
        "columns": ["reference_type", "event", "date_of_event", "brief", "my_space_link", "pass_key", "remarks"]
    },
    "budget": {
        "table": "budget",
        "columns": ["year", "section", "capital_assigned", "capital_utilized", "contractual_assigned", "contractual_utilized", "store_assigned", "store_utilized", "spare_assigned", "spare_utilized", "others_assigned", "others_utilized", "misc_assigned", "misc_utilized"]
    },
    "procurement": {
        "table": "procurement",
        "columns": ["section", "head", "sl_no", "year_procurement", "item_details", "procurement_agency", "value", "last_status", "last_status_date"]
    },
    "rate_contracts": {
        "table": "rate_contracts",
        "columns": ["section", "sr_no", "category", "equipment", "oem_details", "rc_detail", "validity_of_rc", "price_validity", "present_status"]
    }
}

@excel_bp_v2.route('/api/test/sync', methods=['POST'])
def sync_excel():
    template_type = request.form.get('type')
    target_db = request.form.get('target', 'test')  # Default to test

    if not template_type or template_type not in TEMPLATE_CONFIG:
        return jsonify({"error": "Invalid or missing template type"}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    config = TEMPLATE_CONFIG[template_type]
    table_name = config['table']
    expected_columns = config['columns']

    try:
        # Read Excel
        # Treat all as string/object to avoid NaN issues in text fields, or handle specifically
        df = pd.read_excel(file)
        
        # Validation: Check if Excel has enough columns? 
        # For simplicity, we assume the user provides columns IN ORDER.
        # However, to be safer, we'll slice the dataframe to the number of expected columns.
        
        if len(df.columns) < len(expected_columns):
             return jsonify({"error": f"Excel file has too few columns. Expected {len(expected_columns)}."}), 400
             
        # Slice to exact number of columns
        df = df.iloc[:, :len(expected_columns)]
        
        # Replace NaN with None
        df = df.where(pd.notnull(df), None)

        conn = get_db(target_db)
        cursor = conn.cursor()
        
        # 0. Disable Foreign Key Checks to allow TRUNCATE
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0")

        # 1. Truncate Table
        cursor.execute(f"TRUNCATE TABLE {table_name}")
        
        # 2. Insert Data
        placeholders = ",".join(["%s"] * len(expected_columns))
        columns_str = ",".join(expected_columns)
        
        query = f"INSERT INTO {table_name} ({columns_str}) VALUES ({placeholders})"
        
        data = [tuple(row) for row in df.values]
        
        if data:
            cursor.executemany(query, data)
            conn.commit()
            
        # 3. Re-enable Foreign Key Checks
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
        
        cursor.close()
        conn.close()
        
        db_label = "LIVE DB" if target_db == "live" else "TEST DB"
        return jsonify({"message": f"Synced {len(data)} rows to '{table_name}' in {db_label} successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@excel_bp_v2.route('/api/test/data', methods=['GET'])
def get_synced_data():
    template_type = request.args.get('type')
    target_db = request.args.get('target', 'test') # Default to test

    if not template_type or template_type not in TEMPLATE_CONFIG:
        return jsonify({"error": "Invalid or missing template type"}), 400

    table_name = TEMPLATE_CONFIG[template_type]['table']

    try:
        conn = get_db(target_db)
        cursor = conn.cursor(dictionary=True)
        cursor.execute(f"SELECT * FROM {table_name}")
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
