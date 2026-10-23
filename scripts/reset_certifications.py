import mysql.connector
from backend.config import DB_CONFIG

def reset_table():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("Dropping old certifications table...")
        cursor.execute("DROP TABLE IF EXISTS certifications")
        
        print("Creating fresh certifications table...")
        cursor.execute("""
        CREATE TABLE certifications (
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
        );
        """)
        
        conn.commit()
        print("Table 'certifications' reset successfully.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_table()
