// server.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/agent/update', (req, res) => {
  const { agentId, type, content } = req.body;
  console.log('Received agent update:');
  console.log('  agentId:', agentId);
  console.log('  type:', type);
  console.log('  content:', content);
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});