import requests
import json

BASE_URL = "http://127.0.0.1:5000/api"

def login():
    print("Logging in...")
    try:
        response = requests.post(f"{BASE_URL}/admin/login", json={
            "username": "admin",
            "password": "admin"
        })
        if response.status_code == 200:
            token = response.json().get("token")
            print("Login Successful")
            return token
        else:
            print(f"Login Failed: {response.text}")
            return None
    except Exception as e:
        print(f"Login Error: {e}")
        return None

def verify_procurement(token):
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. ADD Procurement
    print("\n--- Testing ADD Procurement ---")
    new_item = {
        "section": "DRILLING",
        "head": "Capital",
        "sl_no": "PROC-001",
        "year_procurement": "2023-24",
        "item_details": "Test Drill Bit",
        "procurement_agency": "Agency X",
        "value": 50000.00,
        "last_status": "Ordered",
        "last_status_date": "2023-10-27"
    }
    res = requests.post(f"{BASE_URL}/admin/procurement", json=new_item, headers=headers)
    print(f"Add Status: {res.status_code}")
    print(f"Add Response: {res.text}")
    
    # 2. GET Procurement
    print("\n--- Testing GET Procurement ---")
    res = requests.get(f"{BASE_URL}/admin/procurement", headers=headers)
    items = res.json()
    print(f"Items Found: {len(items)}")
    
    target_id = None
    if len(items) > 0:
        # potential match based on item details to be safe
        for item in items:
            if item.get('item_details') == "Test Drill Bit":
                target_id = item.get('id')
                break
        if not target_id:
             target_id = items[0].get('id')
             
        print(f"Target ID for Edit/Delete: {target_id}")

    if not target_id:
        print("Skipping Edit/Delete as no item found")
        return

    # 3. EDIT Procurement
    print("\n--- Testing EDIT Procurement ---")
    update_data = {
        "section": "DRILLING",
        "head": "Revenue", # Changed
        "sl_no": "PROC-001-UPDATED", # Changed
        "year_procurement": "2023-24",
        "item_details": "Test Drill Bit Updated",
        "procurement_agency": "Agency Y", # Changed
        "value": 60000.00, # Changed
        "last_status": "Delivered", # Changed
        "last_status_date": "2023-11-01"
    }
    res = requests.put(f"{BASE_URL}/admin/procurement/{target_id}", json=update_data, headers=headers)
    print(f"Edit Status: {res.status_code}")
    print(f"Edit Response: {res.text}")

    # 4. DELETE Procurement
    print("\n--- Testing DELETE Procurement ---")
    res = requests.delete(f"{BASE_URL}/admin/procurement/{target_id}", headers=headers)
    print(f"Delete Status: {res.status_code}")
    print(f"Delete Response: {res.text}")

if __name__ == "__main__":
    token = login()
    if token:
        verify_procurement(token)
