// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { removeAgentContent } = require('./src/AgentContentStore');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/agent/done', (req, res) => {
  const { agentId } = req.body;

  if (!agentId) {
    return res.status(400).send('agentId is required');
  }

  try {
    removeAgentContent(agentId);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error removing agent content:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});