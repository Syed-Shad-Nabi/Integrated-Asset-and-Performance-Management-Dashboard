
import mysql.connector
import sys
import os

# Ensure we can import config
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from config import DB_CONFIG

def update_drill_sites_table():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # Drop existing table
        print("Dropping drill_sites table...")
        cursor.execute("DROP TABLE IF EXISTS drill_sites")

        # Create new table without image_url
        print("Creating new drill_sites table...")
        create_query = """
        CREATE TABLE drill_sites (
            id INT AUTO_INCREMENT PRIMARY KEY,
            planning_year VARCHAR(50),
            location_release_name VARCHAR(100),
            basin_name VARCHAR(100),
            block_name VARCHAR(100),
            block_allotment_details VARCHAR(100),
            block_validity VARCHAR(50),
            stacking_date VARCHAR(50),
            laq_status VARCHAR(50),
            civil_work_start_date VARCHAR(50),
            civil_work_end_date VARCHAR(50),
            rfd_date VARCHAR(50),
            drill_site_name VARCHAR(100)
        )
        """
        cursor.execute(create_query)
        
        conn.commit()
        cursor.close()
        conn.close()
        print("Drill Sites table updated successfully!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_drill_sites_table()
