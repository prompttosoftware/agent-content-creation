# Agent Content Creation

## Introduction

This document provides instructions for setting up and running the Agent Content Creation application locally for development and testing.

## Prerequisites

*   Node.js and npm (or yarn) installed on your system.
*   Docker and Docker Compose installed on your system.

## Installation

1.  Clone the repository (if you haven't already).
2.  Navigate to the project directory.
3.  Install dependencies using npm or yarn:
    ```bash
    npm install
    # or
    yarn install
    ```

## Running the Application Locally with Docker

1.  Build and start the Docker containers:
    ```bash
    docker-compose up --build -d
    ```
    This command will build the Docker image and start the application in detached mode.
2.  The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Running Tests

1.  Ensure Docker containers are running (if not, run `docker-compose up --build -d`).
2.  Run the test suite:
    ```bash
    docker-compose exec agent-content-creation npm test
    # or
    docker-compose exec agent-content-creation yarn test
    ```

## Troubleshooting

*   **Dependency Issues:** If you encounter errors related to missing dependencies, ensure you have installed all dependencies using `npm install` or `yarn install`. If you're running tests within Docker, ensure the dependencies are installed inside the container.
*   **Port Conflicts:** If the application fails to start due to a port conflict, ensure that no other process is using the same port (e.g., 3000). You may need to stop the conflicting process or configure the application to use a different port.  When running in Docker, the port is mapped from the container to the host machine, so ensure port 3000 is available on your host.
*   **Test Failures:** If tests are failing, carefully review the error messages. Common causes include incorrect component rendering, missing dependencies in test setup, or issues with the test environment configuration.  When running tests within Docker, ensure that the test environment is correctly configured inside the container (e.g., jest-dom setup).

## Testing Strategy

*   **Unit Tests:** Test individual components and functions in isolation.  Focus on verifying the correct behavior of the building blocks of the application.
*   **Integration Tests:** Test interactions between different components and modules. This includes verifying the correct flow of data and communication.
*   **End-to-End Tests (Future Implementation):** Simulate user interactions to test the application from start to finish. This will allow us to verify that the entire application functions as expected.
