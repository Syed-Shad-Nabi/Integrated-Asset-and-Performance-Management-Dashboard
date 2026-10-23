import requests
import json

url = "http://127.0.0.1:5000/api/admin/initiatives"

payload = {
    "year": "2024-25",
    "category": "Technology",
    "year_used_at": "2023",
    "used_at": "Mumbai High",
    "description_brief": "AI Monitoring",
    "description_detail": "Using AI to monitor rig health.",
    "pros": "Efficient",
    "cons": "High Setup Cost",
    "benefits": "Reduced downtime",
    "cost_effectiveness": "High",
    "remarks": "Pilot successful"
}

try:
    print(f"Sending POST to {url}...")
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Connection Error: {e}")
