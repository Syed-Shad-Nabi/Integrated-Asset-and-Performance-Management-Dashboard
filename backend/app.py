from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from config import DB_CONFIG
from functools import wraps
import hashlib, jwt, datetime

app = Flask(__name__)
SECRET_KEY = "ongc_secret_key"

# REGISTER BLUEPRINTS
from admin import admin_bp
from excel_sync_v2 import excel_bp_v2
app.register_blueprint(admin_bp)
app.register_blueprint(excel_bp_v2)

# ✅ Perfect CORS (Allow All Methods & Headers)
CORS(app, resources={r"/*": {
    "origins": "*",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

# =========================
# DB CONNECTION
# =========================
def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

# =========================
# TOKEN MIDDLEWARE
# =========================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # OPTIONS is handled by flask-cors automatically now
        
        auth = request.headers.get("Authorization")

        if not auth:
            return jsonify({"error": "Token missing"}), 401

        if not auth.startswith("Bearer "):
            return jsonify({"error": "Invalid token format"}), 401

        token = auth.split(" ")[1]

        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated

# =========================
# ADMIN LOGIN
# =========================
@app.route("/api/admin/login", methods=["POST"])
def login():
    data = request.json
    hashed = hashlib.sha256(data["password"].encode()).hexdigest()

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id FROM admin_users WHERE username=%s AND password_hash=%s",
        (data["username"], hashed)
    )

    admin = cur.fetchone()
    conn.close()

    if not admin:
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode(
        {
            "admin_id": admin[0],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=6)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({"token": token})

# =========================
# GET MACHINERY
# =========================
@app.route("/api/admin/machinery", methods=["GET"])
@token_required
def get_machinery():
    conn = get_db_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM equipment")
        data = cur.fetchall()
        return jsonify(data)
    finally:
        conn.close()

# =========================
# ADD MACHINERY
# =========================
# =========================
# ADD MACHINERY (FULL DATA)
# =========================
@app.route("/api/admin/machinery", methods=["POST"])
@token_required
def add_machinery():
    data = request.json
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO equipment
            (equipment_name, section, location, model, present_status, class, sub_class, make, oem_sl_no, ongc_asset_no, last_received_from, remarks)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            data.get("equipment_name"),
            data.get("section"),
            data.get("location"),
            data.get("model"),
            data.get("present_status", "Working"),
            data.get("class"),
            data.get("sub_class"),
            data.get("make"),
            data.get("oem_sl_no"),
            data.get("ongc_asset_no"),
            data.get("last_received_from"),
            data.get("remarks")
        ))
        conn.commit()
        return jsonify({"message": "Added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# =========================
# UPDATE MACHINERY
# =========================
@app.route("/api/admin/machinery/<int:equipment_id>", methods=["PUT"])
@token_required
def update_machinery(equipment_id):
    data = request.json
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            UPDATE equipment
            SET equipment_name = %s,
                section = %s,
                location = %s,
                model = %s,
                present_status = %s,
                class = %s,
                sub_class = %s,
                make = %s,
                oem_sl_no = %s,
                ongc_asset_no = %s,
                last_received_from = %s,
                remarks = %s
            WHERE equipment_id = %s
        """, (
            data.get("equipment_name"),
            data.get("section"),
            data.get("location"),
            data.get("model"),
            data.get("present_status"),
            data.get("class"),
            data.get("sub_class"),
            data.get("make"),
            data.get("oem_sl_no"),
            data.get("ongc_asset_no"),
            data.get("last_received_from"),
            data.get("remarks"),
            equipment_id
        ))
        conn.commit()
        return jsonify({"message": "Updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# =========================
# DELETE MACHINERY
# =========================
@app.route("/api/admin/machinery/<int:equipment_id>", methods=["DELETE"])
@token_required
def delete_machinery(equipment_id):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM equipment WHERE equipment_id=%s", (equipment_id,))
        conn.commit()
        return jsonify({"message": "Deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# =========================
# PUBLIC ROUTES (No Token)
# =========================
@app.route("/api/public/machinery", methods=["GET"])
def get_public_machinery():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM equipment")
    data = cur.fetchall()
    conn.close()
    return jsonify(data)

@app.route("/api/public/budget", methods=["GET"])
def get_public_budget():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT * FROM budget")
        data = cur.fetchall()
    except:
        data = [] # Return empty if table missing
    conn.close()
    return jsonify(data)

@app.route("/api/public/procurement", methods=["GET"])
def get_public_procurement():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT * FROM procurement ORDER BY id DESC")
        data = cur.fetchall()
    except:
        data = []
    conn.close()
    return jsonify(data)


# ================= PERFORMANCE ROUTES =================

@app.route('/api/public/performance', methods=['GET'])
def get_performance_public():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM performance")
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/performance', methods=['GET'])
def get_performance_admin():
    return get_performance_public()

@app.route('/api/admin/performance', methods=['POST'])
def add_performance():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
        INSERT INTO performance 
        (parameter, target_value, actual_value, unit, status, remarks, image_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data.get('parameter'),
            data.get('target_value'),
            data.get('actual_value'),
            data.get('unit'),
            data.get('status'),
            data.get('remarks'),
            data.get('image_url')
        )
        
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Performance record added"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/performance/<int:id>', methods=['PUT'])
def update_performance(id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
        UPDATE performance 
        SET parameter=%s, target_value=%s, actual_value=%s, unit=%s, status=%s, remarks=%s, image_url=%s
        WHERE id=%s
        """
        values = (
            data.get('parameter'),
            data.get('target_value'),
            data.get('actual_value'),
            data.get('unit'),
            data.get('status'),
            data.get('remarks'),
            data.get('image_url'),
            id
        )
        
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Performance record updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/performance/<int:id>', methods=['DELETE'])
def delete_performance(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM performance WHERE id=%s", (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Performance record deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= REPORTS ROUTES =================

@app.route('/api/public/reports', methods=['GET'])
def get_reports_public():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM reports")
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/reports', methods=['GET'])
def get_reports_admin():
    return get_reports_public()

@app.route('/api/admin/reports', methods=['POST'])
def add_report():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
        INSERT INTO reports 
        (report_title, category, submission_date, status, action_required, image_url)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (
            data.get('report_title'),
            data.get('category'),
            data.get('submission_date'),
            data.get('status'),
            data.get('action_required'),
            data.get('image_url')
        )
        
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Report added"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/reports/<int:id>', methods=['PUT'])
def update_report(id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
        UPDATE reports 
        SET report_title=%s, category=%s, submission_date=%s, status=%s, action_required=%s, image_url=%s
        WHERE id=%s
        """
        values = (
            data.get('report_title'),
            data.get('category'),
            data.get('submission_date'),
            data.get('status'),
            data.get('action_required'),
            data.get('image_url'),
            id
        )
        
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Report updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/reports/<int:id>', methods=['DELETE'])
def delete_report(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM reports WHERE id=%s", (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Report deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# ================= NEW TEMPLATES ROUTES =================

# 1. DRILL SITES
@app.route('/api/public/drill-sites', methods=['GET'])
def get_drill_sites():
    return get_generic("drill_sites")

@app.route('/api/admin/drill-sites', methods=['GET'])
def get_drill_sites_admin():
    return get_generic("drill_sites")

@app.route('/api/admin/drill-sites', methods=['POST'])
def add_drill_site():
    data = request.json
    # Helper to convert empty strings to None
    def clean(val): return None if val == "" else val

    query = """INSERT INTO drill_sites 
    (planning_year, location_release_name, basin_name, block_name, block_allotment_details, block_validity, stacking_date, laq_status, civil_work_start_date, civil_work_end_date, rfd_date, drill_site_name, image_url) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    values = (
        clean(data.get('planning_year')), clean(data.get('location_release_name')), clean(data.get('basin_name')), 
        clean(data.get('block_name')), clean(data.get('block_allotment_details')), clean(data.get('block_validity')), 
        clean(data.get('stacking_date')), clean(data.get('laq_status')), clean(data.get('civil_work_start_date')), 
        clean(data.get('civil_work_end_date')), clean(data.get('rfd_date')), clean(data.get('drill_site_name')), 
        clean(data.get('image_url'))
    )
    return execute_query(query, values)

@app.route('/api/admin/drill-sites/<int:id>', methods=['PUT', 'DELETE'])
def manage_drill_site(id):
    if request.method == 'DELETE': return delete_generic("drill_sites", id)
    data = request.json
    query = """UPDATE drill_sites SET 
    planning_year=%s, location_release_name=%s, basin_name=%s, block_name=%s, block_allotment_details=%s, 
    block_validity=%s, stacking_date=%s, laq_status=%s, civil_work_start_date=%s, civil_work_end_date=%s, 
    rfd_date=%s, drill_site_name=%s, image_url=%s 
    WHERE id=%s"""
    values = (
        data.get('planning_year'), data.get('location_release_name'), data.get('basin_name'), 
        data.get('block_name'), data.get('block_allotment_details'), data.get('block_validity'), 
        data.get('stacking_date'), data.get('laq_status'), data.get('civil_work_start_date'), 
        data.get('civil_work_end_date'), data.get('rfd_date'), data.get('drill_site_name'), 
        data.get('image_url'), id
    )
    return execute_query(query, values)

# 2. INITIATIVES
@app.route('/api/public/initiatives', methods=['GET'])
def get_initiatives(): return get_generic("initiatives")

@app.route('/api/admin/initiatives', methods=['GET'])
def get_initiatives_admin(): return get_generic("initiatives")

@app.route('/api/admin/initiatives', methods=['POST'])
def add_initiative():
    data = request.json
    def clean(val): return None if val == "" else val
    
    query = """INSERT INTO initiatives 
    (year, category, year_used_at, used_at, description_brief, description_detail, pros, cons, benefits, cost_effectiveness, remarks) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    values = (
        clean(data.get('year')), clean(data.get('category')), clean(data.get('year_used_at')), 
        clean(data.get('used_at')), clean(data.get('description_brief')), clean(data.get('description_detail')), 
        clean(data.get('pros')), clean(data.get('cons')), clean(data.get('benefits')), 
        clean(data.get('cost_effectiveness')), clean(data.get('remarks'))
    )
    return execute_query(query, values)

@app.route('/api/admin/initiatives/<int:id>', methods=['PUT', 'DELETE'])
def manage_initiative(id):
    if request.method == 'DELETE': return delete_generic("initiatives", id)
    data = request.json
    def clean(val): return None if val == "" else val

    query = """UPDATE initiatives SET 
    year=%s, category=%s, year_used_at=%s, used_at=%s, description_brief=%s, description_detail=%s, 
    pros=%s, cons=%s, benefits=%s, cost_effectiveness=%s, remarks=%s 
    WHERE id=%s"""
    values = (
        clean(data.get('year')), clean(data.get('category')), clean(data.get('year_used_at')), 
        clean(data.get('used_at')), clean(data.get('description_brief')), clean(data.get('description_detail')), 
        clean(data.get('pros')), clean(data.get('cons')), clean(data.get('benefits')), 
        clean(data.get('cost_effectiveness')), clean(data.get('remarks')), id
    )
    return execute_query(query, values)

# 3. AWARDS
@app.route('/api/public/awards', methods=['GET'])
def get_awards(): return get_generic("awards")

@app.route('/api/admin/awards', methods=['GET', 'POST'])
def manage_awards_admin():
    if request.method == 'GET': return get_generic("awards")
    data = request.json
    def clean(val): return None if val == "" else val
    
    query = """INSERT INTO awards 
    (category, sub_category, year, awarded_by, description_brief, description_detail, remarks) 
    VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    values = (
        clean(data.get('category')), clean(data.get('sub_category')), clean(data.get('year')), 
        clean(data.get('awarded_by')), clean(data.get('description_brief')), clean(data.get('description_detail')), 
        clean(data.get('remarks'))
    )
    return execute_query(query, values)

@app.route('/api/admin/awards/<int:id>', methods=['PUT', 'DELETE'])
def update_awards_admin(id):
    if request.method == 'DELETE': return delete_generic("awards", id)
    data = request.json
    def clean(val): return None if val == "" else val

    query = """UPDATE awards SET 
    category=%s, sub_category=%s, year=%s, awarded_by=%s, description_brief=%s, description_detail=%s, remarks=%s 
    WHERE id=%s"""
    values = (
        clean(data.get('category')), clean(data.get('sub_category')), clean(data.get('year')), 
        clean(data.get('awarded_by')), clean(data.get('description_brief')), clean(data.get('description_detail')), 
        clean(data.get('remarks')), id
    )
    return execute_query(query, values)

# 4. AUDIT STATUS
@app.route('/api/public/audit-status', methods=['GET'])
def get_audit_status(): return get_generic("audit")

@app.route('/api/admin/audit-status', methods=['GET', 'POST'])
def manage_audit_status():
    if request.method == 'GET': return get_generic("audit")
    data = request.json
    def clean(val): return None if val == "" else val
    
    query = """INSERT INTO audit 
    (audit_category, audit_year, auditing_agency, section, paras_raised, paras_complied_today, paras_complied_3m, paras_complied_6m, paras_complied_9m, paras_complied_beyond_9m, remarks) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    values = (
        clean(data.get('audit_category')), clean(data.get('audit_year')), clean(data.get('auditing_agency')), 
        clean(data.get('section')), clean(data.get('paras_raised')), clean(data.get('paras_complied_today')), 
        clean(data.get('paras_complied_3m')), clean(data.get('paras_complied_6m')), clean(data.get('paras_complied_9m')), 
        clean(data.get('paras_complied_beyond_9m')), clean(data.get('remarks'))
    )
    return execute_query(query, values)

@app.route('/api/admin/audit-status/<int:id>', methods=['PUT', 'DELETE'])
def update_audit_status(id):
    if request.method == 'DELETE': return delete_generic("audit", id)
    data = request.json
    def clean(val): return None if val == "" else val

    query = """UPDATE audit SET 
    audit_category=%s, audit_year=%s, auditing_agency=%s, section=%s, paras_raised=%s, paras_complied_today=%s, 
    paras_complied_3m=%s, paras_complied_6m=%s, paras_complied_9m=%s, paras_complied_beyond_9m=%s, remarks=%s 
    WHERE id=%s"""
    values = (
        clean(data.get('audit_category')), clean(data.get('audit_year')), clean(data.get('auditing_agency')), 
        clean(data.get('section')), clean(data.get('paras_raised')), clean(data.get('paras_complied_today')), 
        clean(data.get('paras_complied_3m')), clean(data.get('paras_complied_6m')), clean(data.get('paras_complied_9m')), 
        clean(data.get('paras_complied_beyond_9m')), clean(data.get('remarks')), id
    )
    return execute_query(query, values)

# 5. CERTIFICATIONS
@app.route('/api/public/certifications', methods=['GET'])
def get_certs(): return get_generic("certifications")

@app.route('/api/admin/certifications', methods=['GET', 'POST'])
def manage_certs():
    if request.method == 'GET': return get_generic("certifications")
    data = request.json
    def clean(val): return None if val == "" else val
    
    query = """INSERT INTO certifications 
    (category, sub_category, certified_on, certified_by, description_brief, validity, status, responsible_section, remarks) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    values = (
        clean(data.get('category')), clean(data.get('sub_category')), clean(data.get('certified_on')), 
        clean(data.get('certified_by')), clean(data.get('description_brief')), clean(data.get('validity')), 
        clean(data.get('status')), clean(data.get('responsible_section')), clean(data.get('remarks'))
    )
    return execute_query(query, values)

@app.route('/api/admin/certifications/<int:id>', methods=['PUT', 'DELETE'])
def update_certs(id):
    if request.method == 'DELETE': return delete_generic("certifications", id)
    data = request.json
    def clean(val): return None if val == "" else val

    query = """UPDATE certifications SET 
    category=%s, sub_category=%s, certified_on=%s, certified_by=%s, description_brief=%s, 
    validity=%s, status=%s, responsible_section=%s, remarks=%s 
    WHERE id=%s"""
    values = (
        clean(data.get('category')), clean(data.get('sub_category')), clean(data.get('certified_on')), 
        clean(data.get('certified_by')), clean(data.get('description_brief')), 
        clean(data.get('validity')), clean(data.get('status')), clean(data.get('responsible_section')), 
        clean(data.get('remarks')), id
    )
    return execute_query(query, values)

# 6. UPCOMING EVENTS
@app.route('/api/public/upcoming-events', methods=['GET'])
def get_events(): return get_generic("upcoming_events")

@app.route('/api/admin/upcoming-events', methods=['GET', 'POST'])
def manage_events():
    if request.method == 'GET': return get_generic("upcoming_events")
    data = request.json
    def clean(val): return None if val == "" else val
    
    query = """INSERT INTO upcoming_events 
    (event_type, status, event_date, duration, place, eligibility, description_brief, action_to_be_taken, nominated_persons, my_space_link) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    values = (
        clean(data.get('event_type')), clean(data.get('status')), clean(data.get('event_date')), 
        clean(data.get('duration')), clean(data.get('place')), clean(data.get('eligibility')), 
        clean(data.get('description_brief')), clean(data.get('action_to_be_taken')), 
        clean(data.get('nominated_persons')), clean(data.get('my_space_link'))
    )
    return execute_query(query, values)

@app.route('/api/admin/upcoming-events/<int:id>', methods=['PUT', 'DELETE'])
def update_events(id):
    if request.method == 'DELETE': return delete_generic("upcoming_events", id)
    data = request.json
    def clean(val): return None if val == "" else val

    query = """UPDATE upcoming_events SET 
    event_type=%s, status=%s, event_date=%s, duration=%s, place=%s, eligibility=%s, 
    description_brief=%s, action_to_be_taken=%s, nominated_persons=%s, my_space_link=%s 
    WHERE id=%s"""
    values = (
        clean(data.get('event_type')), clean(data.get('status')), clean(data.get('event_date')), 
        clean(data.get('duration')), clean(data.get('place')), clean(data.get('eligibility')), 
        clean(data.get('description_brief')), clean(data.get('action_to_be_taken')), 
        clean(data.get('nominated_persons')), clean(data.get('my_space_link')), id
    )
    return execute_query(query, values)



# 7. DRILLING REFERENCES
@app.route('/api/public/drilling-references', methods=['GET'])
def get_references(): return get_generic("drilling_references")

@app.route('/api/admin/drilling-references', methods=['GET', 'POST'])
def manage_references():
    if request.method == 'GET': return get_generic("drilling_references")
    data = request.json
    def clean(val): return None if val == "" else val
    
    query = """INSERT INTO drilling_references 
    (reference_type, event, date_of_event, brief, my_space_link, pass_key, remarks) 
    VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    values = (
        clean(data.get('reference_type')), clean(data.get('event')), clean(data.get('date_of_event')), 
        clean(data.get('brief')), clean(data.get('my_space_link')), clean(data.get('pass_key')), 
        clean(data.get('remarks'))
    )
    return execute_query(query, values)

@app.route('/api/admin/drilling-references/<int:id>', methods=['PUT', 'DELETE'])
def update_references(id):
    if request.method == 'DELETE': return delete_generic("drilling_references", id)
    data = request.json
    def clean(val): return None if val == "" else val

    query = """UPDATE drilling_references SET 
    reference_type=%s, event=%s, date_of_event=%s, brief=%s, my_space_link=%s, pass_key=%s, remarks=%s 
    WHERE id=%s"""
    values = (
        clean(data.get('reference_type')), clean(data.get('event')), clean(data.get('date_of_event')), 
        clean(data.get('brief')), clean(data.get('my_space_link')), clean(data.get('pass_key')), 
        clean(data.get('remarks')), id
    )
    return execute_query(query, values)

# --- Helpers ---
def get_generic(table):
    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute(f"SELECT * FROM {table}")
        data = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(data)
    except Exception as e: return jsonify({"error": str(e)}), 500

def execute_query(query, values):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(query, values)
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Success"}), 201
    except Exception as e: return jsonify({"error": str(e)}), 500

def delete_generic(table, id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {table} WHERE id=%s", (id,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Deleted"}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
    