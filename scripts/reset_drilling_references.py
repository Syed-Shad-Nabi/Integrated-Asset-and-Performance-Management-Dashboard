import mysql.connector
from backend.config import DB_CONFIG

def reset_table():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("Dropping old drilling_references table...")
        cursor.execute("DROP TABLE IF EXISTS drilling_references")
        
        print("Creating fresh drilling_references table...")
        cursor.execute("""
        CREATE TABLE drilling_references (
            id INT AUTO_INCREMENT PRIMARY KEY,
            reference_type VARCHAR(100),
            event VARCHAR(100),
            date_of_event VARCHAR(50),
            brief TEXT,
            my_space_link TEXT,
            pass_key TEXT,
            remarks TEXT
        );
        """)
        
        conn.commit()
        print("Table 'drilling_references' reset successfully.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_table()
