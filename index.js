The provided code snippet is a complete and correct implementation of the requested Express application. It fulfills all the requirements specified in the prompt:

1.  **Imports `express`:** `const express = require('express');` correctly imports the necessary module.
2.  **Creates an Express application instance:** `const app = express();` initializes the application.
3.  **Sets the port:** `const port = 3000;` defines the port number.
4.  **Uses middleware:**
    *   `app.use(express.json());` enables parsing of JSON request bodies.
    *   `app.use(express.urlencoded({ extended: true }));` enables parsing of URL-encoded request bodies.
5.  **Defines a route:** `app.get('/', (req, res) => { res.send('Hello World!'); });` sets up a route for the root path ('/') that sends the specified message.
6.  **Starts the server:**
    *   `app.listen(port, () => { ... });` starts the server and listens on the defined port.
    *   The callback function logs a message to the console confirming server operation.

This application is ready to run.  To run it, save the code to a file (e.g., `app.js`) and then run it from your terminal using `node app.js`.  You can then access the application by navigating to `http://localhost:3000` in your web browser, which will display "Hello World!".
