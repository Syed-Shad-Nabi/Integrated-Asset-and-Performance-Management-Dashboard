import mysql.connector
from backend.config import DB_CONFIG

def reset_table():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("Dropping old upcoming_events table...")
        cursor.execute("DROP TABLE IF EXISTS upcoming_events")
        
        print("Creating fresh upcoming_events table...")
        cursor.execute("""
        CREATE TABLE upcoming_events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            event_type VARCHAR(100),
            status VARCHAR(50),
            event_date VARCHAR(50),
            duration VARCHAR(50),
            place VARCHAR(100),
            eligibility VARCHAR(100),
            description_brief TEXT,
            action_to_be_taken TEXT,
            nominated_persons TEXT,
            my_space_link TEXT
        );
        """)
        
        conn.commit()
        print("Table 'upcoming_events' reset successfully.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_table()
