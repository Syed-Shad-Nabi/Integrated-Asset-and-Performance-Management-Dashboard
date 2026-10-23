
import mysql.connector
import sys
import os

# Ensure we can import config
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from config import DB_CONFIG

def update_initiatives_table():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # Drop existing table
        print("Dropping initiatives table...")
        cursor.execute("DROP TABLE IF EXISTS initiatives")

        # Create new table without image_url
        print("Creating new initiatives table...")
        create_query = """
        CREATE TABLE initiatives (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(150),
            description TEXT,
            benefits TEXT,
            status VARCHAR(50),
            implementation_date VARCHAR(50)
        )
        """
        cursor.execute(create_query)
        
        conn.commit()
        cursor.close()
        conn.close()
        print("Initiatives table updated successfully!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_initiatives_table()
