import requests
import json

BASE_URL = "http://127.0.0.1:5000/api"

def verify_budget():
    print("--- STARTING BUDGET VERIFICATION ---")

    # 1. Login
    print("1. Logging in...")
    try:
        res = requests.post(f"{BASE_URL}/admin/login", json={"username": "admin", "password": "admin"})
        if res.status_code != 200:
            print("LOGIN FAILED:", res.text)
            return
        token = res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("   Success.")
    except Exception as e:
        print("LOGIN ERROR:", e)
        return

    # 2. Add Budget
    print("\n2. Adding Budget...")
    new_budget = {
        "year": "2099-00",
        "section": "TEST_SECTION",
        "capital_assigned": 1000,
        "capital_utilized": 500
    }
    res = requests.post(f"{BASE_URL}/admin/budget", json=new_budget, headers=headers)
    if res.status_code == 201:
        print("   Add Success.")
    else:
        print("   ADD FAILED:", res.text)
        return

    # 3. Find ID
    res = requests.get(f"{BASE_URL}/admin/budget", headers=headers)
    items = res.json()
    target = next((x for x in items if x["year"] == "2099-00" and x["section"] == "TEST_SECTION"), None)
    
    if not target:
        print("   FATAL: Created item not found. Items returned:")
        if len(items) > 0:
            print("   First item keys:", items[0].keys())
            print("   First item:", items[0])
        else:
            print("   No items returned.")
        return
    
    # Debug keys if present
    if "id" not in target:
        print("   FATAL: 'id' key missing. Keys found:", target.keys())
        return

    bid = target["id"]
    print(f"   Found ID: {bid}")

    # 4. Edit
    print("\n3. Editing Budget...")
    update_data = target.copy()
    update_data["capital_assigned"] = 9999
    res = requests.put(f"{BASE_URL}/admin/budget/{bid}", json=update_data, headers=headers)
    if res.status_code == 200:
        print("   Update Success.")
    else:
        print("   UPDATE FAILED:", res.text)
        return

    # 5. Delete
    print("\n4. Deleting Budget...")
    res = requests.delete(f"{BASE_URL}/admin/budget/{bid}", headers=headers)
    if res.status_code == 200:
        print("   Delete Success.")
    else:
        print("   DELETE FAILED:", res.text)

    print("\n--- BUDGET VERIFIED ---")

if __name__ == "__main__":
    verify_budget()
