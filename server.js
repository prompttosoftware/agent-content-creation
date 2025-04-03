const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { removeAgentContent } = require('./src/AgentContentStore');
const app = express();
const port = 3000;

// Configure logging (using console for simplicity, consider a library like Winston in production)
const log = (message, level = 'info') => {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`);
};

app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Load credentials - replace with your actual path
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json'); // Ensure this file exists
const TOKEN_PATH = path.join(__dirname, 'token.json'); // Ensure this file exists

// Helper function to load credentials
async function loadCredentials() {
  try {
    const content = fs.readFileSync(CREDENTIALS_PATH);
    return JSON.parse(content);
  } catch (err) {
    log(`Error loading credentials: ${err.message}`, 'error');
    throw new Error('Failed to load credentials.  Ensure credentials.json exists and is valid.');
  }
}

// Helper function to authorize
async function authorize() {
  try {
    const credentials = await loadCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0],
    );

    // Check if we have previously stored a token.
    try {
      const token = fs.readFileSync(TOKEN_PATH);
      oAuth2Client.setCredentials(JSON.parse(token));
      log('Authentication successful (token loaded)', 'info');
      return oAuth2Client;
    } catch (err) {
      // If token doesn't exist or is invalid, obtain a new one.
      log('No existing token or token invalid. Initiating authentication flow.', 'info');
      return await getNewToken(oAuth2Client);
    }
  } catch (err) {
    log(`Authentication error: ${err.message}`, 'error');
    throw err; // Re-throw to be handled by the error handler
  }
}


// Function to obtain a new token
async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload'],
  });

  console.log('Authorize this app by visiting this url:', authUrl);
  //  In a real-world app, you'd provide a way for the user to enter the code.
  //  For this example, we'll just log a message.  The user needs to manually authorize.
  console.log('Please authorize the app and then create token.json with your credentials');
  console.log("Authentication is not fully automated.  See above instructions.")
  throw new Error("Authentication requires manual authorization.  See console output."); // Stop execution, requires manual intervention.  Avoid hanging server.
}

// Function to upload a video
async function uploadVideo(auth, videoPath, videoTitle, videoDescription) {
  try {
    const youtube = google.youtube({ version: 'v3', auth });
    const fileSize = fs.statSync(videoPath).size;

    const res = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: videoTitle,
          description: videoDescription,
        },
        status: {
          privacyStatus: 'private', // or 'public', 'unlisted'
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    },
    {
      // Use this for resumable uploads
      onUploadProgress: (event) => {
        const progress = (event.bytesTransferred / fileSize) * 100;
        log(`Upload progress: ${Math.round(progress)}%`, 'info');
      },
    });

    log(`Video uploaded successfully. Video ID: ${res.data.id}`, 'info');
    return res.data.id;

  } catch (err) {
    log(`Error uploading video: ${err.message}`, 'error');
    //Provide more user-friendly error messages
    if (err.code === 401) {
      throw new Error('Authentication failed. Please check your credentials and token.json.');
    } else if (err.code === 403) {
      throw new Error('You do not have permission to upload videos.  Check your Google Cloud project permissions.');
    } else if (err.code === 400) {
      throw new Error('Invalid request parameters. Please check the video title and description.');
    } else {
      throw new Error('Failed to upload video.  Please check your video file and try again.');
    }
  }
}

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
    const { agentId } = req.body;
    if (!agentId) {
        return res.status(400).json({ error: 'agentId is required' });
    }

    try {
        removeAgentContent(agentId);
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error('Error removing agent content:', error);
        res.status(500).json({ error: 'Failed to remove agent content' });
    }
});

// Example endpoint to upload a video (replace with your video details)
app.post('/api/upload-video', async (req, res) => {
  const { videoPath, videoTitle, videoDescription } = req.body;

  if (!videoPath || !videoTitle || !videoDescription) {
    return res.status(400).json({ error: 'videoPath, videoTitle, and videoDescription are required' });
  }

  try {
    const auth = await authorize();
    const videoId = await uploadVideo(auth, videoPath, videoTitle, videoDescription);
    res.json({ status: 'success', videoId: videoId });

  } catch (error) {
    console.error('API Error during video upload:', error); // For internal debugging
    res.status(500).json({ error: error.message || 'Failed to upload video' }); // Send user-friendly error
  }
});


// Error handling for the API endpoint (centralized)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack); // Log the full stack trace for debugging
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Preserve existing status if set
  res.status(statusCode).json({ error: 'Internal Server Error' });
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
