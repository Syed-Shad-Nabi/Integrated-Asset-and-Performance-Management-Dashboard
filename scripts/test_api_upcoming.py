import requests
import json

url = "http://127.0.0.1:5000/api/admin/upcoming-events"
headers = {"Content-Type": "application/json"}
data = {
    "event_type": "Test Event", 
    "status": "Open", 
    "event_date": "2026-02-10", 
    "duration": "2 hours", 
    "place": "Delhi", 
    "eligibility": "All", 
    "description_brief": "Brief", 
    "action_to_be_taken": "None", 
    "nominated_persons": "None", 
    "my_space_link": "http://link"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response Text: {response.text}")
except Exception as e:
    print(f"Error: {e}")
