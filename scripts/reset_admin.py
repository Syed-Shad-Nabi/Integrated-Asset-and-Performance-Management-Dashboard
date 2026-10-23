import mysql.connector
import hashlib
from backend.config import DB_CONFIG

def reset_admin():
    print("Resetting Admin User...")
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Hash for 'admin'
        # SHA256('admin') = 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
        hashed = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"

        # Delete existing (to be safe)
        cur.execute("DELETE FROM admin_users WHERE username='admin'")
        
        # Insert fresh
        cur.execute("INSERT INTO admin_users (username, password_hash) VALUES ('admin', %s)", (hashed,))
        
        conn.commit()
        print("Admin user reset: admin / admin")
        cur.close()
        conn.close()

    except Exception as e:
        print("Database Connection Failed:", e)

if __name__ == "__main__":
    reset_admin()
