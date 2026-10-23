
import mysql.connector
from backend.config import DB_CONFIG

def create_missing_tables():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Performance Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS performance (
            id INT AUTO_INCREMENT PRIMARY KEY,
            parameter VARCHAR(100),
            target_value VARCHAR(100),
            actual_value VARCHAR(100),
            unit VARCHAR(50),
            status VARCHAR(50) DEFAULT 'On Track',
            remarks TEXT,
            image_url VARCHAR(255)
        );
        """)
        
        # Reports Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            report_title VARCHAR(150),
            category VARCHAR(100),
            submission_date VARCHAR(50),
            status VARCHAR(50) DEFAULT 'Pending',
            action_required TEXT,
            image_url VARCHAR(255)
        );
        """)
        
        conn.commit()
        print("Tables 'performance' and 'reports' created successfully!")
        
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")

if __name__ == "__main__":
    create_missing_tables()
