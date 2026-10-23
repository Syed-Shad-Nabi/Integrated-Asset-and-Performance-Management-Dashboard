import mysql.connector
from backend.config import DB_CONFIG

def reset_table():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("Dropping old audit table...")
        cursor.execute("DROP TABLE IF EXISTS audit")
        
        print("Creating fresh audit table...")
        cursor.execute("""
        CREATE TABLE audit (
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
        );
        """)
        
        conn.commit()
        print("Table 'audit' reset successfully.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_table()
