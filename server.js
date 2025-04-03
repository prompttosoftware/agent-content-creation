const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

app.post('/agent/update', (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    if (typeof content !== 'string') {
        return res.status(400).json({ error: 'Content must be a string' });
    }
    res.json({ status: 'success' });
});

app.post('/agent/done', (req, res) => {
    res.json({ status: 'success' });
});

// Error handling for the API endpoint
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

let server;

function startServer() {
  return new Promise((resolve, reject) => {
    server = app.listen(port, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`Server running on port ${port}`);
        resolve(server);
      }
    });
  });
}

async function stopServer() {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Server stopped');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  app, // Export the app instance
  startServer, // Export the startServer function
  stopServer, // Export the stopServer function
};
