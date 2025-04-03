import React, { useState, useRef, useEffect } from 'react';
import { google } from 'googleapis';

const CLIENT_ID = process.env.REACT_APP_YOUTUBE_CLIENT_ID; // Get from .env
const CLIENT_SECRET = process.env.REACT_APP_YOUTUBE_CLIENT_SECRET; // Get from .env
const REDIRECT_URI = process.env.REACT_APP_YOUTUBE_REDIRECT_URI; // Get from .env (e.g., http://localhost:3000/oauth2callback)
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
];

/**
 * YouTubeUpload Component
 * Handles authentication, video details input, file upload, and progress display.
 */
const YouTubeUpload = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoDetails, setVideoDetails] = useState({
    title: '',
    description: '',
    category: '22', // Default to People & Blogs
    privacyStatus: 'private',
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);


  // --- Authentication ---

  /**
   *  Initiates the OAuth flow to get an access token.
   */
  const handleAuthClick = async () => {
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    // Redirect the user to the authentication URL
    window.location.href = authUrl; // Or open in a new window/tab

  };


  useEffect(() => {
    // Handle OAuth Callback - This runs when the app redirects back after OAuth
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          const oauth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
          );

          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens); // Store credentials
          setAccessToken(tokens.access_token);
          // You might want to store the refresh token as well, for future use.

          // Clear the URL params to avoid re-running this logic on refresh
          window.history.replaceState({}, document.title, window.location.pathname);

        } catch (error) {
          console.error('Error exchanging authorization code for tokens:', error);
          setUploadError('Authentication failed. Please try again.');
        }
      }
    };

    handleOAuthCallback(); // Check for and handle the OAuth code

  }, []);



  // --- Video Details Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoDetails({ ...videoDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };


  // --- Upload Functionality ---

  /**
   *  Uploads the video to YouTube.
   */
  const handleUpload = async () => {
    if (!accessToken) {
      setUploadError('Please authenticate with YouTube first.');
      return;
    }

    if (!videoFile) {
      setUploadError('Please select a video file.');
      return;
    }

    setUploading(true);
    setUploadComplete(false);
    setUploadError(null);
    setUploadProgress(0);


    try {
        const youtube = google.youtube({
            version: 'v3',
            auth: accessToken
        });


        const res = await youtube.videos.insert(
            {
                part: 'snippet,status',
                requestBody: {
                    snippet: {
                        title: videoDetails.title,
                        description: videoDetails.description,
                        categoryId: videoDetails.category,
                    },
                    status: {
                        privacyStatus: videoDetails.privacyStatus,
                    },
                },
                media: {
                    mimeType: videoFile.type,
                    body:  createReadableStream(videoFile),  // Pass a readable stream
                },
            },
            {
                onUploadProgress: (evt) => {
                    const progress = parseInt((evt.bytesTransferred / videoFile.size) * 100, 10);
                    setUploadProgress(progress);
                },
            }
        );


        if (res.status === 200) {
            setUploadComplete(true);
            // Optionally, store the video ID for future use.
            console.log('Video uploaded successfully! Video ID:', res.data.id);
        } else {
            throw new Error(`Upload failed: ${res.status} - ${res.statusText}`);
        }

    } catch (error) {
        console.error('Upload error:', error);
        let errorMessage = 'Upload failed. Please try again.';

        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error.message; // Get the error message from the API
        }

        setUploadError(errorMessage);
    } finally {
        setUploading(false);
    }
  };


  // Helper to create a readable stream (important for large files)
  const createReadableStream = (file) => {
    const reader = new FileReader();
    const chunkSize = 1024 * 1024 * 5; // 5MB chunks
    let offset = 0;

    return new ReadableStream({
      start(controller) {
        function push() {
          const slice = file.slice(offset, offset + chunkSize);
          reader.readAsArrayBuffer(slice);
        }

        reader.onload = () => {
          const buffer = reader.result;
          controller.enqueue(new Uint8Array(buffer));
          offset += buffer.byteLength;
          if (offset < file.size) {
            push();
          } else {
            controller.close();
          }
        };
        reader.onerror = (error) => {
          controller.error(error);
        };

        push();
      },
    });
  };




  // --- UI Rendering ---

  return (
    <div>
      <h2>YouTube Video Upload</h2>

      {!accessToken ? (
        <button onClick={handleAuthClick}>Authenticate with YouTube</button>
      ) : (
        <div>
          <p>Authenticated with YouTube.</p>

          {uploadError && <p style={{ color: 'red' }}>Error: {uploadError}</p>}

          <form>
            <div>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={videoDetails.title}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={videoDetails.description}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                name="category"
                value={videoDetails.category}
                onChange={handleInputChange}
              >
                {/* Add more category options as needed */}
                <option value="22">People & Blogs</option>
                <option value="27">Education</option>
                <option value="10">Music</option>
              </select>
            </div>

            <div>
              <label htmlFor="privacyStatus">Privacy:</label>
              <select
                id="privacyStatus"
                name="privacyStatus"
                value={videoDetails.privacyStatus}
                onChange={handleInputChange}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </div>

            <div>
              <label htmlFor="videoFile">Choose Video:</label>
              <input
                type="file"
                id="videoFile"
                accept="video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>

            {uploading && (
              <div>
                <p>Uploading... {uploadProgress}%</p>
                <progress value={uploadProgress} max="100" />
              </div>
            )}

            {uploadComplete && <p style={{ color: 'green' }}>Upload complete!</p>}

            <button type="button" onClick={handleUpload} disabled={uploading}>
              Upload
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default YouTubeUpload;