// Backend API for Agent Content Creation

const express = require('express');
const app = express();
const port = 3000;
const { exec } = require('child_process');

// In-memory data store (replace with a database in the future)
let agentData = {
  name: "Example Agent",
  script: "This is an example script."
};

app.use(express.json()); // for parsing application/json

// Endpoint to get agent data
app.get('/agent', (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] [INFO] Received request for agent data`);
    res.json(agentData);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [ERROR] Error getting agent data:`, error);
    res.status(500).json({ error: `Error getting agent data: ${error.message}` });
  }
});

// Endpoint to trigger video generation (placeholder)
app.post('/video', (req, res) => {
  console.log(`[${new Date().toISOString()}] [INFO] Video generation triggered!`);

  try {
    // Execute video generation module
    exec('node ../video-generation-module/index.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`[${new Date().toISOString()}] [ERROR] Video generation failed: ${error}`);
        return res.status(500).send(`Video generation failed: ${error}`);
      }
      if (stderr) {
        console.error(`[${new Date().toISOString()}] [ERROR] Video generation stderr: ${stderr}`);
      }
      console.log(`[${new Date().toISOString()}] [INFO] Video generation stdout: ${stdout}`);

      res.send('Video generation triggered.');
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [ERROR] An unexpected error occurred: ${error}`);
    res.status(500).send(`An unexpected error occurred: ${error}`);
  }
});

app.listen(port, () => {
  console.log(`[${new Date().toISOString()}] [INFO] Backend API listening at http://localhost:${port}`);
});