import mysql.connector
from backend.config import DB_CONFIG

def reset_table():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("Dropping old initiatives table...")
        cursor.execute("DROP TABLE IF EXISTS initiatives")
        
        print("Creating fresh initiatives table...")
        cursor.execute("""
        CREATE TABLE initiatives (
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
        );
        """)
        
        conn.commit()
        print("Table 'initiatives' reset successfully.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_table()
