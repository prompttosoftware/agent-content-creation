const express = require('express');
const app = express();
const port = 3001; // Changed port to avoid EADDRINUSE

app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.send('Hello, world!');
});

app.post('/agent/update', (req, res) => {
  // Handle agent update
  res.status(200).send();
});

app.post('/agent/done', (req, res) => {
  // Handle agent done
  res.status(200).send();
});

let server;

function startServer() {
  return new Promise((resolve) => {
    server = app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
      resolve({ server, app });
    });
  });
}

function stopServer() {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) {
          console.error('Error closing server:', err);
          reject(err);
          return;
        }
        console.log('Server stopped');
        resolve();
      });
    } else {
      console.log('Server not running');
      resolve();
    }
  });
}

module.exports = { app, startServer, stopServer };