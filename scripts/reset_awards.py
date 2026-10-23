import mysql.connector
from backend.config import DB_CONFIG

def reset_table():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("Dropping old awards table...")
        cursor.execute("DROP TABLE IF EXISTS awards")
        
        print("Creating fresh awards table...")
        cursor.execute("""
        CREATE TABLE awards (
            id INT AUTO_INCREMENT PRIMARY KEY,
            category VARCHAR(100),
            sub_category VARCHAR(100),
            year VARCHAR(50),
            awarded_by VARCHAR(100),
            description_brief TEXT,
            description_detail TEXT,
            remarks TEXT
        );
        """)
        
        conn.commit()
        print("Table 'awards' reset successfully.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_table()
