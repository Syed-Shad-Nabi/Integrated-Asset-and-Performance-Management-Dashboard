
import mysql.connector
from backend.config import DB_CONFIG

def create_additional_tables():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        tables = [
            """
            CREATE TABLE IF NOT EXISTS drill_sites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                rig_name VARCHAR(100),
                location VARCHAR(100),
                status VARCHAR(50),
                target_depth VARCHAR(50),
                current_depth VARCHAR(50),
                remarks TEXT,
                image_url VARCHAR(255)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS initiatives (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(150),
                description TEXT,
                benefits TEXT,
                status VARCHAR(50),
                implementation_date VARCHAR(50),
                image_url VARCHAR(255)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS awards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(150),
                recipient VARCHAR(100),
                date_received VARCHAR(50),
                category VARCHAR(100),
                description TEXT,
                image_url VARCHAR(255)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS audit_status (
                id INT AUTO_INCREMENT PRIMARY KEY,
                observation TEXT,
                category VARCHAR(100),
                risk_level VARCHAR(50),
                status VARCHAR(50),
                action_taken TEXT,
                closure_date VARCHAR(50),
                image_url VARCHAR(255)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS certifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                certificate_name VARCHAR(150),
                issuing_authority VARCHAR(150),
                issue_date VARCHAR(50),
                expiry_date VARCHAR(50),
                status VARCHAR(50),
                image_url VARCHAR(255)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS upcoming_events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                event_name VARCHAR(150),
                event_date VARCHAR(50),
                location VARCHAR(100),
                description TEXT,
                organizer VARCHAR(100),
                image_url VARCHAR(255)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS drilling_archive (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(150),
                category VARCHAR(100),
                year VARCHAR(10),
                description TEXT,
                link_url VARCHAR(255),
                image_url VARCHAR(255)
            )
            """
        ]

        for query in tables:
            cursor.execute(query)
        
        conn.commit()
        print("All 7 additional tables created successfully!")
        
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")

if __name__ == "__main__":
    create_additional_tables()
