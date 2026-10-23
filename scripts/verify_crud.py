import requests
import json

BASE_URL = "http://127.0.0.1:5000/api"

def run_verification():
    print("--- STARTING VERIFICATION ---")

    # 1. Login
    print("1. Logging in as admin...")
    try:
        res = requests.post(f"{BASE_URL}/admin/login", json={"username": "admin", "password": "admin"})
        if res.status_code != 200:
            print("LOGIN FAILED:", res.text)
            return
        token = res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("   Login Successful. Token received.")
    except Exception as e:
        print("LOGIN ERROR:", e)
        return

    # 2. Add Machinery
    print("\n2. Adding Machinery...")
    new_item = {
        "equipment_name": "AUTO_TEST_RIG",
        "section": "DRILLING",
        "model": "X-100",
        "location": "Site A",
        "present_status": "Working",
        "class": "A",
        "sub_class": "Heavy",
        "make": "CAT",
        "oem_sl_no": "123",
        "ongc_asset_no": "999",
        "last_received_from": "Vendor",
        "remarks": "Test Remarks"
    }
    
    res = requests.post(f"{BASE_URL}/admin/machinery", json=new_item, headers=headers)
    if res.status_code == 201:
        print("   Add Successful.")
    else:
        print("   ADD FAILED:", res.text)
        return

    # 3. Get ID of added item
    res = requests.get(f"{BASE_URL}/admin/machinery", headers=headers)
    machinery = res.json()
    target = next((m for m in machinery if m["equipment_name"] == "AUTO_TEST_RIG"), None)
    
    if not target:
        print("   FATAL: Could not find added item in list.")
        return
    
    equip_id = target["equipment_id"]
    print(f"   Found Item ID: {equip_id}")

    # 4. Edit Machinery
    print(f"\n3. Editing Machinery ID {equip_id}...")
    update_data = new_item.copy()
    update_data["equipment_name"] = "AUTO_TEST_RIG_UPDATED"
    
    res = requests.put(f"{BASE_URL}/admin/machinery/{equip_id}", json=update_data, headers=headers)
    if res.status_code == 200:
        print("   Update Successful.")
    else:
        print("   UPDATE FAILED:", res.text)
        return

    # 5. Verify Edit
    res = requests.get(f"{BASE_URL}/admin/machinery", headers=headers)
    machinery = res.json()
    updated_target = next((m for m in machinery if m["equipment_id"] == equip_id), None)
    
    if updated_target and updated_target["equipment_name"] == "AUTO_TEST_RIG_UPDATED":
         print("   Verification Successful: Name updated.")
    else:
         print("   VERIFICATION FAILED: Name mismatch.")

    # 6. Delete Machinery
    print(f"\n4. Deleting Machinery ID {equip_id}...")
    res = requests.delete(f"{BASE_URL}/admin/machinery/{equip_id}", headers=headers)
    if res.status_code == 200:
        print("   Delete Successful.")
    else:
        print("   DELETE FAILED:", res.text)

    print("\n--- NON-BLOCKING VERIFICATION COMPLETE ---")

if __name__ == "__main__":
    run_verification()
