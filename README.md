# Agent-Content-Creation: Node.js YouTube Video Creation App

## Description

This project is a Node.js application that generates and uploads YouTube videos based on content updates received from "agents."  The application allows agents to send text and image updates, which are then dynamically displayed in a grid layout within a video frame.  Upon receiving a "done" signal from an agent, that agent's content is removed from the video. The application then uploads the generated video to YouTube.

## Features

*   **API Endpoints (Express.js):**
    *   `POST /agent/update`: Receives text or image updates from agents.
    *   `POST /agent/done`:  Signals that an agent is finished providing content.
*   **Dynamic Video Generation:**
    *   Maintains a state of active agents and their content.
    *   Implements a dynamic grid layout for displaying agent content.  The layout adjusts based on the number of active agents.
    *   Renders agent content (text and images) within their respective grid sections.
    *   Handles dynamic updates:  When content is updated for an agent, the video frame is re-rendered.
    *   Handles agent "done" signals: When an agent is marked as done, its content is removed, and the video frame is re-rendered.
*   **YouTube API Integration:**
    *   Uploads generated videos to YouTube.
    *   Supports authentication with the YouTube API (OAuth 2.0 recommended).
    *   Allows configuration of video metadata (title, description, tags, etc.).

## Technologies Used

*   **Node.js:** JavaScript runtime environment.
*   **npm:** Node Package Manager.
*   **Express.js:** Web application framework for API endpoints.
*   **Video Editing Library:** (e.g., `fluent-ffmpeg`, `node-canvas`)  Used for video composition and editing (exact choice depends on project implementation).
*   **YouTube API Library:** (e.g., `googleapis`) For interacting with the YouTube API.

## Installation and Setup

1.  **Prerequisites:**
    *   Node.js and npm installed.
    *   (Depending on video editing library):  System dependencies may be required (e.g., FFmpeg for `fluent-ffmpeg`).
2.  **Project Initialization:**
    ```bash
    git clone <repository_url>  # Replace with your repository URL if applicable.
    cd <project_directory>  # Navigate into the project directory.
    npm init -y # Initialize a package.json file if not already present.
    ```

3.  **Installation:**
    ```bash
    npm install
    ```
    This command will install all the project dependencies listed in the `package.json` file.

4.  **Configuration:**
    *   **YouTube API Credentials:** Set up a project in the Google Cloud Console and obtain API credentials (client ID, client secret, etc.).  Store these securely (e.g., environment variables).
    *   **Other Configuration:**  Consider environment variables for other settings like video title, description defaults, and file paths.

## Local Execution Instructions

1.  **Install Node.js and npm:**
    *   If you don't have them, download and install the latest LTS version of Node.js from [https://nodejs.org/](https://nodejs.org/).  npm is included with the Node.js installation.
2.  **Clone the repository:**
    ```bash
    git clone <repository_url>  # Replace with your repository URL
    cd agent-content-creation # Navigate to the project directory
    ```
3.  **Install project dependencies:**
    ```bash
    npm install
    ```
    This command will install all the necessary packages listed in the `package.json` file.
4.  **Run the application:**
    ```bash
    node server.js
    ```
    This will start the server.  Make sure you have configured the necessary environment variables.
5.  **Send requests to the API (using curl or Postman):**
    *   The server will typically run on `http://localhost:3000` (or similar).  Adjust the URL if necessary.
    *   **Example using `curl` for `/agent/update`:**
        ```bash
        curl -X POST -H "Content-Type: application/json" -d '{"agentId": "testAgent", "type": "text", "content": "Hello from local"}' http://localhost:3000/agent/update
        ```
    *   **Example using `curl` for `/agent/done`:**
        ```bash
        curl -X POST -H "Content-Type: application/json" -d '{"agentId": "testAgent"}' http://localhost:3000/agent/done
        ```
    *   Use Postman or another API testing tool to send similar requests.

## Usage

1.  **Start the Server:**
    ```bash
    node server.js
    ```
    (Replace `server.js` with the name of your main application file.)

2.  **Send Agent Updates (using a tool like curl or Postman):**
    *   **`/agent/update` (POST):**
        ```bash
        curl -X POST -H "Content-Type: application/json" -d '{
          "agentId": "agent1",
          "type": "text",
          "content": "Hello from agent 1!"
        }' http://localhost:3000/agent/update
        ```
        ```bash
        curl -X POST -H "Content-Type: application/json" -d '{
          "agentId": "agent2",
          "type": "image",
          "content": "<base64_encoded_image_data>"  //Replace with your base64 encoded image data
        }' http://localhost:3000/agent/update
        ```

3.  **Signal Agent Completion (using a tool like curl or Postman):**
    *   **`/agent/done` (POST):**
        ```bash
        curl -X POST -H "Content-Type: application/json" -d '{
          "agentId": "agent1"
        }' http://localhost:3000/agent/done
        ```

4.  **Video Generation and Upload:** The application will automatically generate a video and upload it to YouTube based on the agent updates and the configuration.  Check your console output for progress.

## API Endpoints

*   **`/agent/update` (POST)**
    *   **Request Body:**
        *   `agentId` (string):  Unique identifier for the agent.
        *   `type` (string):  Either `"text"` or `"image"`.
        *   `content` (string):  The content of the update.  Text content or base64 encoded image data.
    *   **Response:**
        *   (Success) HTTP status 200 OK
        *   (Error) HTTP status 500 Internal Server Error (or other appropriate error status) and a JSON object describing the error.

*   **`/agent/done` (POST)**
    *   **Request Body:**
        *   `agentId` (string):  Unique identifier for the agent.
    *   **Response:**
        *   (Success) HTTP status 200 OK
        *   (Error) HTTP status 500 Internal Server Error (or other appropriate error status) and a JSON object describing the error.

## Project Structure (Example)

```
Agent-Content-Creation/
├── server.js           # Main application file (or similar)
├── package.json
├── .env                 # (Optional) Store environment variables
├── video/
│   ├── temp/         # Directory for temporary video frames (e.g., images)
│   └── output.mp4   # Output video file
├── epic/             # Directory for Epic breakdowns and related files
│   ├── epic1.txt
│   ├── epic2.txt
│   ├── epic3.txt
│   ├── epic4.txt
│   └── epic5.txt
└── README.md
```

##  Epics and Progress

*   **Epic 1: Project Setup and API Endpoints** -  (Status: In Progress/Completed - Update as progress occurs)  [Refer to `epic/epic1.txt` for details]
*   **Epic 2: Video Grid Layout and Dynamic Agent Display** - (Status:  To Do) [Refer to `epic/epic2.txt` for details]
*   **Epic 3: YouTube API Integration and Video Upload** - (Status: To Do) [Refer to `epic/epic3.txt` for details]
*   **Epic 4: Agent 'Done' Endpoint and Grid Removal Logic** - (Status: To Do) [Refer to `epic/epic4.txt` for details]
*   **Epic 5: Local Execution and Testing** - (Status: To Do) [Refer to `epic/epic5.txt` for details]

## Testing

*   **Unit Tests:** (To be implemented) Write unit tests for individual functions and components.
*   **Integration Tests:** (To be implemented) Test the interaction between API endpoints and video generation logic.
*   **Manual Testing:**  Test the application by sending updates and signals via tools like `curl` or Postman.  Verify the video output and YouTube upload.

## Contributing

Contributions are welcome!  Please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them.
4.  Submit a pull request.

## License

(Specify the license for your project here, e.g., MIT License).
