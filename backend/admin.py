from flask import Blueprint, request, jsonify
from db import get_db

admin_bp = Blueprint("admin", __name__)

# -------------------------------
# GET ALL TEMPLATES (ADMIN)
# -------------------------------
@admin_bp.route("/api/admin/templates", methods=["GET"])
def get_templates():
    db = get_db()
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM templates ORDER BY template_id")
        data = cursor.fetchall()
        cursor.close()
        return jsonify(data)
    finally:
        db.close()


# -------------------------------
# TOGGLE TEMPLATE ON / OFF
# -------------------------------
@admin_bp.route("/api/admin/templates/toggle", methods=["POST"])
def toggle_template():
    data = request.json
    template_key = data.get("template_key")
    is_active = data.get("is_active")

    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute("""
            UPDATE templates
            SET is_active = %s
            WHERE template_key = %s
        """, (is_active, template_key))
        db.commit()
        cursor.close()
        return jsonify({"message": "Template updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


# -------------------------------
# UPDATE TEMPLATE DETAILS
# -------------------------------
@admin_bp.route("/api/admin/templates/update", methods=["POST"])
def update_template():
    data = request.json
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute("""
            UPDATE templates
            SET template_name = %s,
                route = %s,
                image = %s
            WHERE template_key = %s
        """, (
            data["template_name"],
            data["route"],
            data["image"],
            data["template_key"]
        ))
        db.commit()
        cursor.close()
        return jsonify({"message": "Template details updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


# -------------------------------
# ADD NEW TEMPLATE
# -------------------------------
@admin_bp.route("/api/admin/templates/add", methods=["POST"])
def add_template():
    data = request.json
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute("""
            INSERT INTO templates (template_key, template_name, route, image, is_active)
            VALUES (%s, %s, %s, %s, TRUE)
        """, (
            data["template_key"],
            data["template_name"],
            data["route"],
            data["image"]
        ))
        db.commit()
        return jsonify({"message": "Template added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        db.close()

@admin_bp.route("/api/admin/templates/<int:template_id>", methods=["DELETE"])
def delete_template(template_id):
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute("DELETE FROM templates WHERE template_id = %s", (template_id,))
        db.commit()
        cursor.close()
        return jsonify({"message": "Template deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# -------------------------------
# BUDGET MANAGEMENT
# -------------------------------

# GET BUDGET
@admin_bp.route("/api/admin/budget", methods=["GET"])
def get_budget():
    db = get_db()
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM budget ORDER BY year DESC, section ASC")
        data = cursor.fetchall()
        cursor.close()
        return jsonify(data)
    finally:
        db.close()

# ADD BUDGET
@admin_bp.route("/api/admin/budget", methods=["POST"])
def add_budget():
    data = request.json
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO budget (
                year, section, 
                capital_assigned, capital_utilized, 
                contractual_assigned, contractual_utilized, 
                store_assigned, store_utilized, 
                spare_assigned, spare_utilized,
                others_assigned, others_utilized,
                misc_assigned, misc_utilized,
                total_assigned, total_utilized
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get("year"), data.get("section"),
            data.get("capital_assigned", 0), data.get("capital_utilized", 0),
            data.get("contractual_assigned", 0), data.get("contractual_utilized", 0),
            data.get("store_assigned", 0), data.get("store_utilized", 0),
            data.get("spare_assigned", 0), data.get("spare_utilized", 0),
            data.get("others_assigned", 0), data.get("others_utilized", 0),
            data.get("misc_assigned", 0), data.get("misc_utilized", 0),
            data.get("total_assigned", 0), data.get("total_utilized", 0)
        ))
        db.commit()
        cursor.close()
        return jsonify({"message": "Budget added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# UPDATE BUDGET
@admin_bp.route("/api/admin/budget/<int:budget_id>", methods=["PUT"])
def update_budget(budget_id):
    data = request.json
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute("""
            UPDATE budget SET
                year=%s, section=%s,
                capital_assigned=%s, capital_utilized=%s,
                contractual_assigned=%s, contractual_utilized=%s,
                store_assigned=%s, store_utilized=%s,
                spare_assigned=%s, spare_utilized=%s,
                others_assigned=%s, others_utilized=%s,
                misc_assigned=%s, misc_utilized=%s,
                total_assigned=%s, total_utilized=%s
            WHERE id=%s
        """, (
            data.get("year"), data.get("section"),
            data.get("capital_assigned"), data.get("capital_utilized"),
            data.get("contractual_assigned"), data.get("contractual_utilized"),
            data.get("store_assigned"), data.get("store_utilized"),
            data.get("spare_assigned"), data.get("spare_utilized"),
            data.get("others_assigned"), data.get("others_utilized"),
            data.get("misc_assigned"), data.get("misc_utilized"),
            data.get("total_assigned"), data.get("total_utilized"),
            budget_id
        ))
        db.commit()
        cursor.close()
        return jsonify({"message": "Budget updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# DELETE BUDGET
@admin_bp.route("/api/admin/budget/<int:budget_id>", methods=["DELETE"])
def delete_budget(budget_id):
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute("DELETE FROM budget WHERE id=%s", (budget_id,))
        db.commit()
        cursor.close()
        return jsonify({"message": "Budget deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# -------------------------------
# PROCUREMENT MANAGEMENT
# -------------------------------

# GET PROCUREMENT
@admin_bp.route("/api/admin/procurement", methods=["GET"])
def get_procurement():
    db = get_db()
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM procurement ORDER BY id DESC")
        data = cursor.fetchall()
        cursor.close()
        return jsonify(data)
    finally:
        db.close()

# ADD PROCUREMENT
@admin_bp.route("/api/admin/procurement", methods=["POST"])
def add_procurement():
    data = request.json
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO procurement (
                section, head, sl_no, year_procurement, item_details, 
                procurement_agency, value, last_status, last_status_date
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get("section"), data.get("head"), data.get("sl_no"), 
            data.get("year_procurement"), data.get("item_details"), 
            data.get("procurement_agency"), data.get("value", 0), 
            data.get("last_status"), data.get("last_status_date")
        ))
        db.commit()
        cursor.close()
        return jsonify({"message": "Procurement item added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# UPDATE PROCUREMENT
@admin_bp.route("/api/admin/procurement/<int:id>", methods=["PUT"])
def update_procurement(id):
    data = request.json
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute("""
            UPDATE procurement SET
                section=%s, head=%s, sl_no=%s, year_procurement=%s, 
                item_details=%s, procurement_agency=%s, value=%s, 
                last_status=%s, last_status_date=%s
            WHERE id=%s
        """, (
            data.get("section"), data.get("head"), data.get("sl_no"), 
            data.get("year_procurement"), data.get("item_details"), 
            data.get("procurement_agency"), data.get("value"), 
            data.get("last_status"), data.get("last_status_date"),
            id
        ))
        db.commit()
        cursor.close()
        return jsonify({"message": "Procurement item updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# DELETE PROCUREMENT
@admin_bp.route("/api/admin/procurement/<int:id>", methods=["DELETE"])
def delete_procurement(id):
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute("DELETE FROM procurement WHERE id=%s", (id,))
        db.commit()
        cursor.close()
        return jsonify({"message": "Procurement item deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()