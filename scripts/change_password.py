import mysql.connector
import hashlib
from backend.config import DB_CONFIG

def change_admin_credentials():
    print("--- Change Admin Credentials ---")
    new_user = input("Enter new username (default 'admin'): ").strip() or "admin"
    new_pass = input("Enter new password: ").strip()

    if not new_pass:
        print("Password cannot be empty!")
        return

    # Hash the password (SHA256)
    hashed_password = hashlib.sha256(new_pass.encode()).hexdigest()

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cur = conn.cursor()

        # Update username and password
        # We assume we are updating the existing 'admin' user or creating a new one if not found
        
        # Check if user exists
        cur.execute("SELECT id FROM admin_users WHERE username=%s", (new_user,))
        exists = cur.fetchone()

        if exists:
            # Update existing
            cur.execute("UPDATE admin_users SET password_hash=%s WHERE username=%s", (hashed_password, new_user))
            print(f"Successfully updated password for user '{new_user}'.")
        else:
            # Create new
            cur.execute("INSERT INTO admin_users (username, password_hash) VALUES (%s, %s)", (new_user, hashed_password))
            print(f"Successfully created new user '{new_user}'.")

        conn.commit()
        cur.close()
        conn.close()

    except Exception as e:
        print(f"Error updating database: {e}")

if __name__ == "__main__":
    change_admin_credentials()
