import mysql.connector
from backend.config import DB_CONFIG

def run_migration():
    print("Connecting to database...")
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Columns to check/add in 'equipment' table
        new_columns = [
            ("section", "VARCHAR(100)"), # Replaces section_id logic if needed
            ("present_status", "VARCHAR(50) DEFAULT 'Working'"),
            ("class", "VARCHAR(50)"),
            ("sub_class", "VARCHAR(50)"),
            ("make", "VARCHAR(50)"),
            ("oem_sl_no", "VARCHAR(100)"),
            ("ongc_asset_no", "VARCHAR(100)"),
            ("last_received_from", "VARCHAR(100)"),
            ("remarks", "TEXT")
        ]

        print("Checking 'equipment' table columns...")
        for col_name, col_def in new_columns:
            try:
                cur.execute(f"SHOW COLUMNS FROM equipment LIKE '{col_name}'")
                result = cur.fetchone()
                
                if not result:
                    print(f"Adding missing column: {col_name}")
                    cur.execute(f"ALTER TABLE equipment ADD COLUMN {col_name} {col_def}")
                else:
                    print(f"Column '{col_name}' already exists.")
                    
            except Exception as e:
                print(f"Error checking column {col_name}: {e}")

        # --- BUDGET TABLE MIGRATION ---
        print("\nChecking 'budget' table columns...")
        budget_columns = [
            ("others_assigned", "DECIMAL(15,2) DEFAULT 0"),
            ("others_utilized", "DECIMAL(15,2) DEFAULT 0"),
            ("misc_assigned", "DECIMAL(15,2) DEFAULT 0"),
            ("misc_utilized", "DECIMAL(15,2) DEFAULT 0"),
            ("total_assigned", "DECIMAL(15,2) DEFAULT 0"),
            ("total_utilized", "DECIMAL(15,2) DEFAULT 0")
        ]

        for col_name, col_def in budget_columns:
            try:
                cur.execute(f"SHOW COLUMNS FROM budget LIKE '{col_name}'")
                result = cur.fetchone()
                
                if not result:
                    print(f"Adding missing column to budget: {col_name}")
                    cur.execute(f"ALTER TABLE budget ADD COLUMN {col_name} {col_def}")
                else:
                    print(f"Column '{col_name}' already exists in budget.")
            except Exception as e:
                print(f"Error checking budget column {col_name}: {e}")

        conn.commit()
        print("Migration complete!")
        cur.close()
        conn.close()

    except Exception as e:
        print("Database Connection Failed:", e)

if __name__ == "__main__":
    run_migration()
