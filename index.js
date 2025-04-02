const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json

// Placeholder for video generation function.  This will be replaced with actual logic.
async function triggerVideoCreation(text, image) {
  console.log('Triggering video creation...');
  // TODO: Implement actual video creation logic here.  This might involve
  // calling another service, queueing a job, etc.
  // For now, just log the received data.
  if (text) {
    console.log('Text:', text);
  }
  if (image) {
    console.log('Image data received.');
  }
  return { success: true, message: 'Video creation triggered (placeholder).' };
}

app.post('/api/process-data', async (req, res) => {
  try {
    const { text, image } = req.body;

    // Input validation and sanitation
    if (!text && !image) {
      return res.status(400).json({ error: 'Invalid request body: must contain "text" or "image".' });
    }

    if (text && typeof text !== 'string') {
      return res.status(400).json({ error: 'Invalid input: "text" must be a string.' });
    }

    // Basic image data validation (assuming base64 encoded string)
    if (image && typeof image !== 'string') {
      return res.status(400).json({ error: 'Invalid input: "image" must be a string.' });
    }

    if (image && !image.startsWith('data:image/')) {
        return res.status(400).json({error: 'Invalid input: "image" must be a valid image data URI.'});
    }

    const creationResult = await triggerVideoCreation(text, image);

    if (creationResult.success) {
      res.status(200).json({ message: 'Data processed and video creation triggered successfully.', details: creationResult.message });
    } else {
      console.error('Video creation failed:', creationResult.message);
      res.status(500).json({ error: 'Failed to trigger video creation.', details: creationResult.message });
    }

  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Backend API listening at http://localhost:${port}`);
});