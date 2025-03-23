// src/index.ts
import express from 'express';
import { generateVideo } from './video/videoGenerator';
import { getAuthURL, getTokens, refreshAccessToken } from './youtube/youtube';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/auth/url', async (req, res) => {
    try {
        const authUrl = await getAuthURL();
        res.status(200).send(authUrl);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating auth URL');
    }
});

app.post('/done', async (req, res) => {
    try {
        const { authorizationCode, videoId } = req.body;
        console.log("Received authorization code:", authorizationCode);
        console.log("Received videoId:", videoId);

        // 1. Get tokens using the authorization code
        const tokens = await getTokens(authorizationCode);
        console.log("Received tokens:", tokens);

        // In a real application, you'd store these tokens securely.

        // 2.  Use tokens to upload video, but for now, just return 200
        res.status(200).send({ message: 'Done received', videoUrl: `http://youtube.com/watch?v=${videoId}` });

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error processing /done' });
    }
});

export default app; // Export the app instance

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}
