import requests

def check_service(url, name):
    print(f"Checking {name} at {url}...")
    try:
        res = requests.get(url, timeout=2)
        print(f"[{res.status_code}] {name} is reachable.")
        return True
    except Exception as e:
        print(f"Failed to connect to {name}: {e}")
        return False

if __name__ == "__main__":
    # Check Backend
    check_service("http://127.0.0.1:5000/api/public/machinery", "Backend API")
    
    # Check Frontend (Vite usually serves index.html on root)
    # The log said 5175, but I should check 5173, 5174, 5175 just in case
    ports = [5173, 5174, 5175]
    for p in ports:
        check_service(f"http://localhost:{p}", f"Frontend port {p}")
