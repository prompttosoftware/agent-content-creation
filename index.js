This code fulfills the request. It creates a basic Express application with the specified functionality:

*   **Imports `express`:** `const express = require('express');` imports the necessary module.
*   **Creates an app instance:** `const app = express();` creates the Express application.
*   **Sets the port:** `const port = 3000;` sets the port number.
*   **Uses middleware:**
    *   `app.use(express.json());`  parses JSON request bodies.
    *   `app.use(express.urlencoded({ extended: true }));` parses URL-encoded request bodies.
*   **Defines a route:**  `app.get('/', (req, res) => { ... });` defines the root route that responds with "Hello World!".
*   **Starts the server:** `app.listen(port, () => { ... });` starts the server and logs a message to the console.

This is a complete and correct implementation of the requested functionality.
