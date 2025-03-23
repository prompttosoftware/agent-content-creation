// src/youtube/youtube.ts
import { google } from 'googleapis';

const youtube = google.youtube('v3');

// Define your OAuth 2.0 credentials here.  You'll get these from the Google Cloud Console.
const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'YOUR_REDIRECT_URI' // e.g., 'http://localhost:3000/oauth2callback'
);

async function getAuthUrl() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload'],
  });
  return authUrl;
}

async function getToken(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
}

async function uploadVideo(accessToken: string, videoPath: string, videoTitle: string, videoDescription: string) {
  oauth2Client.setCredentials({ access_token: accessToken });

  try {
    const res = await youtube.videos.insert(
      {
        auth: oauth2Client,
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: videoTitle,
            description: videoDescription,
            categoryId: '22', // Example: People & Blogs
          },
          status: {
            privacyStatus: 'private', // or 'public', 'unlisted'
          },
        },
        media: {
          mimeType: 'video/mp4', // or the correct MIME type
          body: require('fs').createReadStream(videoPath),
        },
      }
    );
    console.log('Video uploaded:', res.data.id);
    return res.data.id;
  } catch (err) {
    console.error('Error uploading video:', err);
    throw err;
  }
}


export {
  getAuthUrl,
  getToken,
  uploadVideo,
  oauth2Client
};
