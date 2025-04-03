import React, { useState, useEffect } from 'react';
import { uploadVideo } from '../youtube/upload'; // Assuming you have an upload function
import { parseYouTubeError } from '../utils/errorHandling'; // Assuming you have an error handling utility
import { initiateAuth, handleAuthCode, getAccessToken } from '../youtube/auth'; // Import authentication functions

/**
 * YouTubeUpload Component
 * Handles the upload of a video to YouTube.
 */
const YouTubeUpload = ({ videoFile, metadata, handleUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [videoDataUrl, setVideoDataUrl] = useState(null); // State to store the data URL
  const [isAuthenticating, setIsAuthenticating] = useState(false); // State to indicate authentication in progress
  const [authenticationUrl, setAuthenticationUrl] = useState(null); // Store the authentication URL
  const [accessToken, setAccessToken] = useState(null); // Store the access token

  useEffect(() => {
    // Check for required environment variables
    if (
      !process.env.REACT_APP_YOUTUBE_API_KEY ||
      !process.env.REACT_APP_YOUTUBE_CLIENT_ID ||
      !process.env.REACT_APP_YOUTUBE_CLIENT_SECRET ||
      !process.env.REACT_APP_YOUTUBE_REDIRECT_URI
    ) {
      setUploadError('Missing required environment variables for YouTube upload.');
    }

    // Check if we have an access token already.  If so, we're authenticated.
    const storedTokens = localStorage.getItem('youtube_tokens');
    if (storedTokens) {
      setAccessToken(true); // Simplified:  assume if tokens exist, we're authenticated.
    }
  }, []);

  const handleUploadClick = async () => {
    if (!videoFile || !metadata || !handleUpload) {
      setUploadError('Missing required props for upload.');
      return;
    }

    // Ensure we have an access token before uploading.
    try {
        await getAccessToken();
    } catch (authError) {
        setUploadError(authError.message || "Authentication failed. Please try again.");
        return; // Stop the upload process if authentication fails.
    }

    setUploading(true);
    setUploadError(null);
    setUploadComplete(false);

    try {
      // Read the video file
      const reader = new FileReader();
      reader.onload = async (event) => {
        const videoDataUrl = event.target.result; // Get the data URL
        setVideoDataUrl(videoDataUrl); // Store the data URL in state
        // Construct upload parameters.  Adjust as needed.
        const uploadParams = {
          filePath: videoFile, // Keep file path, now that the data URL is stored.
          metadata,
        };

        // Call the handleUpload callback, passing the video file and metadata
        if (handleUpload) {
          await handleUpload(videoFile, metadata);
        }

        // Example using the uploadVideo function (replace with your actual upload logic)
        const accessToken = localStorage.getItem('youtube_access_token');

        //The uploadVideo function is updated to accept the video file and dataURL as well as the access token.
        const uploadResponse = await uploadVideo(videoFile, videoDataUrl, uploadParams.metadata, accessToken);

        console.log('Video ID:', uploadResponse.id);
        setVideoId(uploadResponse.id);
        
        setUploadComplete(true);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setUploadError('Error reading video file.');
      };

      reader.readAsDataURL(videoFile);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(parseYouTubeError(error));
    } finally {
      setUploading(false);
    }
  };

  const handleAuthentication = async () => {
    setIsAuthenticating(true);
    setUploadError(null);

    try {
      // 1. Initiate authentication and get the URL
      const authUrl = initiateAuth();
      if (!authUrl) {
          throw new Error("Could not generate authentication URL.  Check your credentials.");
      }
      setAuthenticationUrl(authUrl);
      // 2. Redirect the user to the authentication URL (in a new tab/window, or using a modal)
      // This part depends on how you want to handle the user flow.  For now, we'll just show the URL.
      console.log("Please authenticate with YouTube:", authUrl);
      //Consider opening the authUrl in a new tab.
      window.open(authUrl, "_blank");

    } catch (error) {
      console.error('Authentication initiation error:', error);
      setUploadError(parseYouTubeError(error));
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Function to handle the authentication code (from the redirect)
  const handleAuthCodeCallback = async (code) => {
    setIsAuthenticating(true);
    setUploadError(null);

    try {
      // Exchange the authorization code for tokens
      await handleAuthCode(code);

      // Indicate successful authentication
      setAccessToken(true);  // Set to true to indicate the user is authenticated.
    } catch (error) {
      console.error('Authentication code exchange error:', error);
      setUploadError(parseYouTubeError(error));
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Placeholder for handling the redirect from YouTube (e.g., after the user authenticates)
  useEffect(() => {
    // This part assumes you have a way to get the authorization code from the URL
    // For example, you might be using a library like `useSearchParams` or similar.
    // In a real application, you would extract the code from the URL parameters after the user is redirected back.
    // For this example, we'll simulate getting the code from the URL.

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Handle the authentication code
      handleAuthCodeCallback(code);

      // Optionally, remove the code from the URL to prevent it from being processed again.
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []); // Run only on component mount

  if (uploadError) {
    return <p style={{ color: 'red' }}>Error: {uploadError}</p>;
  }

  if (
    !process.env.REACT_APP_YOUTUBE_API_KEY ||
    !process.env.REACT_APP_YOUTUBE_CLIENT_ID ||
    !process.env.REACT_APP_YOUTUBE_CLIENT_SECRET ||
    !process.env.REACT_APP_YOUTUBE_REDIRECT_URI
  ) {
    return <p style={{ color: 'red' }}>Missing required environment variables for YouTube upload.</p>;
  }

  return (
    <div>
      {/* Authentication Button */}
      {!accessToken ? ( // Show the button only if not authenticated
        <button onClick={handleAuthentication} disabled={isAuthenticating}>
          {isAuthenticating ? 'Authenticating...' : 'Authenticate with YouTube'}
        </button>
      ) : (
          <p style={{ color: 'green' }}>Authenticated with YouTube!</p> // Show a message if authenticated.
      )}

      <button onClick={handleUploadClick} disabled={uploading || !accessToken}> {/* Disable if not authenticated */}
        {uploading ? 'Uploading...' : 'Upload to YouTube'}
      </button>
      {uploadComplete && (
          <p style={{ color: 'green' }}>Upload complete! Video ID: {videoId}</p>
      )}
    </div>
  );
};

export default YouTubeUpload;