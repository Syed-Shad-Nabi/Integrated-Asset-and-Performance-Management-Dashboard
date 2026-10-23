import mysql.connector
from backend.config import DB_CONFIG

def check_columns():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        cursor.execute("DESCRIBE upcoming_events")
        columns = cursor.fetchall()
        
        print("Columns in 'upcoming_events':")
        for col in columns:
            print(f"- {col[0]} ({col[1]})")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_columns()
