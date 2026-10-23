
import mysql.connector
import sys
import os

# Ensure we can import config
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from config import DB_CONFIG

def update_awards_table():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # Drop existing table
        print("Dropping awards table...")
        cursor.execute("DROP TABLE IF EXISTS awards")

        # Create new table without image_url
        print("Creating new awards table...")
        create_query = """
        CREATE TABLE awards (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(150),
            recipient VARCHAR(100),
            date_received VARCHAR(50),
            category VARCHAR(100),
            description TEXT
        )
        """
        cursor.execute(create_query)
        
        conn.commit()
        cursor.close()
        conn.close()
        print("Awards table updated successfully!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_awards_table()
