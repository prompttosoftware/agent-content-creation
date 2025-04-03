// server.js
const express = require('express');
const cors = require('cors');
const { setAgentContent, removeAgentContent } = require('./AgentContentStore');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Placeholder for /agent/update endpoint (to be implemented later)
app.post('/agent/update', (req, res) => {
  // Placeholder: Handle agent updates
  res.send('Agent update received');
});

// Implement /agent/done endpoint
app.post('/agent/done', (req, res) => {
  const { agentId } = req.body;

  if (!agentId) {
    return res.status(400).send('Missing agentId');
  }

  try {
    removeAgentContent(agentId);
    res.send(`Agent ${agentId} removed`);
  } catch (error) {
    console.error('Error removing agent:', error);
    res.status(500).send('Error removing agent');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});