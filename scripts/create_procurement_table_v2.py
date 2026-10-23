import mysql.connector
import sys
import os

# Standalone script to reset procurement table
def create_table_v2():
    print("Connecting to database...")
    
    # Hardcoded credentials from what I know/see in config
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",  # Assuming based on previous steps
            database="ongc_machine_monitoring"
        )
    except Exception as e:
        print(f"Connection failed: {e}")
        # Try fallback if password is different?
        return

    cursor = conn.cursor()
    
    try:
        print("Dropping 'procurement' table if exists...")
        cursor.execute("DROP TABLE IF EXISTS procurement")
        
        print("Creating 'procurement' table...")
        cursor.execute("""
            CREATE TABLE procurement (
                id INT AUTO_INCREMENT PRIMARY KEY,
                section VARCHAR(100),
                head VARCHAR(100),
                sl_no VARCHAR(50),
                year_procurement VARCHAR(20),
                item_details TEXT,
                procurement_agency VARCHAR(100),
                value DECIMAL(15, 2) DEFAULT 0,
                last_status VARCHAR(100),
                last_status_date DATE
            );
        """)
        conn.commit()
        print("Table 'procurement' created successfully.")
    except Exception as e:
        print(f"Error creating table: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    create_table_v2()
