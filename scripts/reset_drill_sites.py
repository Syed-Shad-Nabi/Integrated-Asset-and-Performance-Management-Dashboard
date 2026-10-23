import mysql.connector
from backend.config import DB_CONFIG

def reset_table():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("Dropping old drill_sites table...")
        cursor.execute("DROP TABLE IF EXISTS drill_sites")
        
        print("Creating fresh drill_sites table...")
        cursor.execute("""
        CREATE TABLE drill_sites (
            id INT AUTO_INCREMENT PRIMARY KEY,
            planning_year VARCHAR(50),
            location_release_name VARCHAR(100),
            basin_name VARCHAR(100),
            block_name VARCHAR(100),
            block_allotment_details VARCHAR(255),
            block_validity VARCHAR(50),
            stacking_date DATE,
            laq_status VARCHAR(100),
            civil_work_start_date DATE,
            civil_work_end_date DATE,
            rfd_date DATE,
            drill_site_name VARCHAR(100),
            image_url VARCHAR(255)
        );
        """)
        
        conn.commit()
        print("Table 'drill_sites' reset successfully.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_table()
