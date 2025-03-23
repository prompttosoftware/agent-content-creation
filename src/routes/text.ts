// Import necessary modules
import express, { Request, Response } from 'express';
import { generateVideo } from '../video/videoGenerator';

const router = express.Router();

// Define the route for handling text input
router.post('/', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    // Validate the input (you can add more robust validation)
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Placeholder: Call video generation function with text and agent information
    const video = generateVideo(5, 640, 480, text); // Example: 5 agents, 640x480 video

    // Return the generated video (or a reference to it)
    res.status(200).json({ video });
  } catch (error: any) {
    console.error('Error processing text:', error);
    res.status(500).json({ error: 'Failed to process text' });
  }
});

export default router;
