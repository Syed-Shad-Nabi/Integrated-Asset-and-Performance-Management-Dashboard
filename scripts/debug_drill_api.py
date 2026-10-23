import requests
import json

url = "http://127.0.0.1:5000/api/admin/drill-sites"

# Payload mimicking the frontend exactly
payload = {
    "planning_year": "2024-25",
    "location_release_name": "Test Loc",
    "basin_name": "Test Basin",
    "block_name": "Test Block",
    "block_allotment_details": "Details",
    "block_validity": "2030",
    "stacking_date": "",  # Empty date string (Suspected cause)
    "laq_status": "Pending",
    "civil_work_start_date": "", # Empty date string
    "civil_work_end_date": "",   # Empty date string
    "rfd_date": "",              # Empty date string
    "drill_site_name": "Site-1",
    "image_url": ""
}

try:
    print(f"Sending POST to {url}...")
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Connection Error: {e}")
    # Try creating a connection directly to DB if Flask isn't up
    print("If Flask is down, checking DB directly...")
