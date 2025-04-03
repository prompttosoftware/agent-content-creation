#!/bin/bash

# Script to test the /agent/update and /agent/done endpoints using curl

# Define the base URL of the server
BASE_URL="http://localhost:3000"

# Function to make a POST request and log the output
make_post_request() {
  local endpoint="$1"
  local payload="$2"
  local curl_output
  local status_code

  echo "----------------------------------------"
  echo "Sending POST request to: $endpoint"
  echo "Payload: $payload"

  curl_output=$(curl -s -w "%{http_code} " -X POST -H "Content-Type: application/json" -d "$payload" "$BASE_URL$endpoint")
  status_code=$(echo "$curl_output" | awk '{print $NF}')
  curl_output=$(echo "$curl_output" | sed 's/[0-9][0-9][0-9] //') # Remove the status code from output for cleaner logging

  echo "Curl Output: $curl_output"
  echo "Status Code: $status_code"

  if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
    echo "Request successful."
  else
    echo "Request failed."
  fi
  echo "----------------------------------------"
}

# Function to check if the server is running
check_server_status() {
  if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200"; then
    return 0  # Server is running
  else
    return 1  # Server is not running
  fi
}

# Give the server some time to start
sleep 2  # Wait for 2 seconds

# Check if the server is running before proceeding
echo "Checking server status..."
if check_server_status; then
  echo "Server is running."

  # Test /agent/update endpoint
  echo "Testing /agent/update endpoint..."
  make_post_request "/agent/update" '{ "message": "This is an update from the agent." }'

  # Test /agent/done endpoint
  echo "Testing /agent/done endpoint..."
  make_post_request "/agent/done" '{ "status": "completed", "details": "Agent finished successfully." }'
else
  echo "Error: Server is not running. Please start the server before running this script."
  exit 1
fi

echo "Script finished."
