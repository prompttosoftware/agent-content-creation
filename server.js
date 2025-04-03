// server.js

import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadVideo } from './src/youtube/upload.js'; // Import uploadVideo
import { generateAuthUrl, initiateAuth, handleAuthCode } from './src/youtube/auth.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination folder for uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Serve the upload form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

// Route to initiate Google authentication
app.get('/auth/google', (req, res) => {
    const authUrl = initiateAuth();
    res.redirect(authUrl);
});

// Route to handle the Google authentication callback
app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    try {
        const tokens = await handleAuthCode(code);
        res.send('Authentication successful! You can now upload videos.  <a href="/">Go back to upload form</a>');
    } catch (error) {
        console.error('Error handling auth code:', error);
        res.status(500).send('Authentication failed.');
    }
});

// Handle video uploads
app.post('/upload', upload.single('video'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const { title, description, categoryId, privacyStatus, tags } = req.body;
        const filePath = req.file.path;

        const videoMetadata = {
            title: title || 'Untitled Video',
            description: description || '',
            categoryId: categoryId || '22', // Default category
            privacyStatus: privacyStatus || 'private',
            tags: tags ? tags.split(',') : [],
        };

        const videoId = await uploadVideo(filePath, videoMetadata);
        res.send(`Video uploaded successfully! Video ID: ${videoId}`);

    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).send(`Upload failed: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
