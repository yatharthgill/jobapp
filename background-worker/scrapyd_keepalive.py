import os
import requests
import time
import random
from datetime import datetime

# ================= CONFIG =================
SCRAPYD_URL = os.environ.get("SCRAPYD_URL")  # Read from environment variable
if not SCRAPYD_URL:
    raise ValueError("SCRAPYD_URL environment variable not set!")

PING_ENDPOINT = "/"  # Use "/" or any lightweight endpoint
LOG_FILE = "scrapyd_keepalive.log"  # Optional log file
MIN_INTERVAL = 600   # 10 minutes in seconds
MAX_INTERVAL = 840   # 14 minutes in seconds
# =========================================

def log_message(message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_line = f"[{timestamp}] {message}"
    print(log_line)
    with open(LOG_FILE, "a") as f:
        f.write(log_line + "\n")

def ping_scrapyd():
    try:
        response = requests.get(SCRAPYD_URL + PING_ENDPOINT, timeout=10)
        log_message(f"Ping successful! Status code: {response.status_code}")
    except Exception as e:
        log_message(f"Ping failed: {e}")

if __name__ == "__main__":
    log_message("=== Scrapyd Keep-Alive Started ===")
    while True:
        ping_scrapyd()
        wait_time = random.randint(MIN_INTERVAL, MAX_INTERVAL)
        log_message(f"Next ping in {wait_time//60} min {wait_time%60} sec")
        time.sleep(wait_time)
