const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies (allows for nested objects in the body)
app.use(express.urlencoded({ extended: true }));

// Route for the root path ('/')
app.get('/', (req, res) => {
  res.send('Hello World!'); // Sends 'Hello World!' as the response to the client
});

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server running on port ${port}`); // Logs a message to the console when the server starts
});