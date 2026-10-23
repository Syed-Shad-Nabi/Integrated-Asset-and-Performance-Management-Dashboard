import mysql.connector
from config import DB_CONFIG

def create_test_db():
    conn = mysql.connector.connect(
        host=DB_CONFIG["host"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"]
    )
    cursor = conn.cursor()

    try:
        # 1. Create Database
        cursor.execute("CREATE DATABASE IF NOT EXISTS ongc_test_db")
        print("Database 'ongc_test_db' ensured.")
        conn.database = "ongc_test_db"

        # 2. Create Tables (All 12 Templates)
        
        # 1. Machinery (equipment)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS equipment (
                equipment_id INT AUTO_INCREMENT PRIMARY KEY,
                equipment_name VARCHAR(100),
                section VARCHAR(100),
                location VARCHAR(100),
                model VARCHAR(100),
                present_status VARCHAR(50) DEFAULT 'Working',
                class VARCHAR(50),
                sub_class VARCHAR(50),
                make VARCHAR(50),
                oem_sl_no VARCHAR(100),
                ongc_asset_no VARCHAR(100),
                last_received_from VARCHAR(100),
                remarks TEXT
            )
        """)

        # 2. Performance
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS performance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                parameter VARCHAR(255),
                target_value VARCHAR(100),
                actual_value VARCHAR(100),
                unit VARCHAR(50),
                status VARCHAR(50),
                remarks TEXT,
                image_url VARCHAR(255)
            )
        """)

        # 3. Drill Sites
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS drill_sites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                planning_year VARCHAR(50),
                location_release_name VARCHAR(100),
                basin_name VARCHAR(100),
                block_name VARCHAR(100),
                block_allotment_details VARCHAR(255),
                block_validity VARCHAR(50),
                stacking_date VARCHAR(50), -- kept generic for sync simplicty
                laq_status VARCHAR(100),
                civil_work_start_date VARCHAR(50),
                civil_work_end_date VARCHAR(50),
                rfd_date VARCHAR(50),
                drill_site_name VARCHAR(100),
                image_url VARCHAR(255)
            )
        """)

        # 4. Initiatives
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS initiatives (
                id INT AUTO_INCREMENT PRIMARY KEY,
                year VARCHAR(50),
                category VARCHAR(100),
                year_used_at VARCHAR(50),
                used_at VARCHAR(100),
                description_brief TEXT,
                description_detail TEXT,
                pros TEXT,
                cons TEXT,
                benefits TEXT,
                cost_effectiveness TEXT,
                remarks TEXT
            )
        """)

        # 5. Awards
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS awards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(100),
                sub_category VARCHAR(100),
                year VARCHAR(50),
                awarded_by VARCHAR(100),
                description_brief TEXT,
                description_detail TEXT,
                remarks TEXT
            )
        """)

        # 6. Audit Status
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS audit (
                id INT AUTO_INCREMENT PRIMARY KEY,
                audit_category VARCHAR(100),
                audit_year VARCHAR(50),
                auditing_agency VARCHAR(100),
                section VARCHAR(100),
                paras_raised INT DEFAULT 0,
                paras_complied_today INT DEFAULT 0,
                paras_complied_3m INT DEFAULT 0,
                paras_complied_6m INT DEFAULT 0,
                paras_complied_9m INT DEFAULT 0,
                paras_complied_beyond_9m INT DEFAULT 0,
                remarks TEXT
            )
        """)

        # 7. Certifications
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS certifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(100),
                sub_category VARCHAR(100),
                certified_on VARCHAR(50),
                certified_by VARCHAR(100),
                description_brief TEXT,
                validity VARCHAR(50),
                status VARCHAR(50),
                responsible_section VARCHAR(100),
                remarks TEXT
            )
        """)

        # 8. Upcoming Events
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS upcoming_events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                event_type VARCHAR(100),
                status VARCHAR(50),
                event_date VARCHAR(50),
                duration VARCHAR(50),
                place VARCHAR(100),
                eligibility VARCHAR(100),
                description_brief TEXT,
                action_to_be_taken TEXT,
                nominated_persons TEXT,
                my_space_link TEXT
            )
        """)

        # 9. Drilling References
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS drilling_references (
                id INT AUTO_INCREMENT PRIMARY KEY,
                reference_type VARCHAR(100),
                event VARCHAR(100),
                date_of_event VARCHAR(50),
                brief TEXT,
                my_space_link TEXT,
                pass_key TEXT,
                remarks TEXT
            )
        """)

        # 10. Budget
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS budget (
                id INT AUTO_INCREMENT PRIMARY KEY,
                year VARCHAR(20),
                section VARCHAR(50),
                capital_assigned DECIMAL(15, 2),
                capital_utilized DECIMAL(15, 2),
                contractual_assigned DECIMAL(15, 2),
                contractual_utilized DECIMAL(15, 2),
                store_assigned DECIMAL(15, 2),
                store_utilized DECIMAL(15, 2),
                spare_assigned DECIMAL(15, 2),
                spare_utilized DECIMAL(15, 2),
                others_assigned DECIMAL(15, 2),
                others_utilized DECIMAL(15, 2),
                misc_assigned DECIMAL(15, 2),
                misc_utilized DECIMAL(15, 2)
            )
        """)

        # 11. Procurement
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS procurement (
                id INT AUTO_INCREMENT PRIMARY KEY,
                section VARCHAR(100),
                head VARCHAR(100),
                sl_no VARCHAR(50),
                year_procurement VARCHAR(20),
                item_details TEXT,
                procurement_agency VARCHAR(100),
                value DECIMAL(15, 2),
                last_status VARCHAR(100),
                last_status_date VARCHAR(50)
            )
        """)
        
        # 12. Rate Contracts
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS rate_contracts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                section VARCHAR(100),
                sr_no VARCHAR(50),
                category VARCHAR(100),
                equipment VARCHAR(255),
                oem_details TEXT,
                rc_detail TEXT,
                validity_of_rc VARCHAR(50),
                price_validity VARCHAR(100),
                present_status VARCHAR(50)
            )
        """)

        print("All 12 tables created successfully in 'ongc_test_db'.")

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    create_test_db()
