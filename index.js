const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// POST endpoint to receive text data with agent ID.
app.post('/text', (req, res) => {
  const { agentId, text } = req.body;
  if (!agentId || !text) {
    return res.status(400).send('Missing agentId or text');
  }
  console.log(`Received text from agent ${agentId}:`, text);
  res.status(200).send('Text received');
});

// POST endpoint to receive image data with agent ID.
app.post('/image', (req, res) => {
  const { agentId, imageData } = req.body;
  if (!agentId || !imageData) {
    return res.status(400).send('Missing agentId or imageData');
  }
  console.log(`Received image from agent ${agentId}:`, imageData);
  res.status(200).send('Image received');
});

// POST endpoint to receive agent ID to remove from video.
app.post('/done', (req, res) => {
  const { agentId } = req.body;
  if (!agentId) {
    return res.status(400).send('Missing agentId');
  }
  console.log(`Agent ${agentId} is done`);
  res.status(200).send('Done received');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});