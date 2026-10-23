
import mysql.connector
from backend.config import DB_CONFIG

def create_rate_contracts_table():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        create_table_query = """
        CREATE TABLE IF NOT EXISTS rate_contracts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            section VARCHAR(100),
            sr_no INT,
            category VARCHAR(100),
            equipment TEXT,
            oem_details TEXT,
            rc_detail VARCHAR(255),
            validity_of_rc VARCHAR(50),  -- Using VARCHAR to allow flexibility if dates aren't strict
            price_validity VARCHAR(255),
            present_status VARCHAR(50)
        );
        """
        
        cursor.execute(create_table_query)
        conn.commit()
        print("Table 'rate_contracts' created successfully!")
        
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")

if __name__ == "__main__":
    create_rate_contracts_table()
