const express = require('express');

// Create an express application instance
const app = express();

// Set the port
const port = 3000;

// Use express.json() middleware for parsing application/json
app.use(express.json());

// Use express.urlencoded() middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Define a route for the root path ('/')
app.get('/', (req, res) => {
  // Send 'Hello World!' as a response
  res.send('Hello World!');
});

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message to the console indicating the server is running
  console.log(`Server running on port ${port}`);
});