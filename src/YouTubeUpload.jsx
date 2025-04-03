import React, { useState, useEffect } from 'react';
import { uploadVideo } from '../youtube/upload'; // Assuming you have an upload function
import { parseYouTubeError } from '../utils/errorHandling'; // Assuming you have an error handling utility
import { initiateAuth, handleAuthCode, getAccessToken } from '../youtube/auth'; // Import authentication functions

// Constants
const PRIVACY_STATUSES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  UNLISTED: 'unlisted',
};

/**
 * Component for uploading videos to YouTube.
 *
 * @param {object} props - Component props.
 * @param {File} props.videoFile - The video file to upload.
 * @param {object} props.metadata - Metadata for the video (title, description, privacy status).
 * @param {function} props.handleUpload - Optional function to handle the upload process externally.
 * @returns {JSX.Element} The YouTubeUpload component.
 */
const YouTubeUpload = ({
  videoFile,
  metadata,
  handleUpload,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [videoDataUrl, setVideoDataUrl] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authenticationUrl, setAuthenticationUrl] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacyStatus, setPrivacyStatus] = useState(PRIVACY_STATUSES.PRIVATE);

  // Effect to check for environment variables and access token on component mount
  useEffect(() => {
    const checkEnvVars = () => {
      if (
        !process.env.REACT_APP_YOUTUBE_API_KEY ||
        !process.env.REACT_APP_YOUTUBE_CLIENT_ID ||
        !process.env.REACT_APP_YOUTUBE_CLIENT_SECRET ||
        !process.env.REACT_APP_YOUTUBE_REDIRECT_URI
      ) {
        setUploadError('Missing required environment variables for YouTube upload.');
        return false;
      }
      return true;
    };

    if (!checkEnvVars()) {
      return;
    }

    const storedTokens = localStorage.getItem('youtube_tokens');
    if (storedTokens) {
      setAccessToken(true);
    }
  }, []);

  /**
   * Handles the authentication process with YouTube.
   */
  const handleAuthentication = async () => {
    setIsAuthenticating(true);
    setUploadError(null);

    try {
      const authUrl = initiateAuth();
      if (!authUrl) {
        throw new Error(
          "Could not generate authentication URL. Check your credentials.",
        );
      }
      setAuthenticationUrl(authUrl);
      window.open(authUrl, '_blank'); // Open in a new tab or window
    } catch (error) {
      console.error('Authentication initiation error:', error);
      setUploadError(parseYouTubeError(error));
    } finally {
      setIsAuthenticating(false);
    }
  };

  /**
   * Handles the authentication code callback after successful authentication.
   *
   * @param {string} code - The authorization code.
   */
  const handleAuthCodeCallback = async (code) => {
    setIsAuthenticating(true);
    setUploadError(null);

    try {
      await handleAuthCode(code);
      setAccessToken(true);
    } catch (error) {
      console.error('Authentication code exchange error:', error);
      setUploadError(parseYouTubeError(error));
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Effect to handle the auth code from the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      handleAuthCodeCallback(code);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  /**
   * Reads the video file and returns a data URL.
   *
   * @param {File} file - The video file.
   * @returns {Promise<string>} A promise that resolves with the data URL.
   */
  const readVideoFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject('Error reading video file.');
      };
      reader.readAsDataURL(file);
    });
  };

  /**
   * Uploads the video to YouTube.
   */
  const uploadVideoToYouTube = async () => {
    if (!videoFile) {
      setUploadError('Please select a video file.');
      return;
    }
    if (!title) {
      setUploadError('Please enter a title for the video.');
      return;
    }

    try {
      await getAccessToken();
    } catch (authError) {
      setUploadError(
        authError.message || 'Authentication failed. Please try again.',
      );
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadComplete(false);

    const uploadMetadata = {
      title,
      description,
      privacyStatus,
    };

    try {
      const dataUrl = await readVideoFile(videoFile);
      setVideoDataUrl(dataUrl);

      if (handleUpload) {
        await handleUpload(videoFile, uploadMetadata);
      }

      const accessToken = localStorage.getItem('youtube_access_token');
      const uploadResponse = await uploadVideo(videoFile, dataUrl, uploadMetadata, accessToken);

      console.log('Video ID:', uploadResponse.id);
      setVideoId(uploadResponse.id);
      setUploadComplete(true);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(parseYouTubeError(error));
    } finally {
      setUploading(false);
    }
  };

  if (uploadError) {
    return <p style={{ color: 'red' }}>Error: {uploadError}</p>;
  }

  if (
    !process.env.REACT_APP_YOUTUBE_API_KEY ||
    !process.env.REACT_APP_YOUTUBE_CLIENT_ID ||
    !process.env.REACT_APP_YOUTUBE_CLIENT_SECRET ||
    !process.env.REACT_APP_YOUTUBE_REDIRECT_URI
  ) {
    return (
      <p style={{ color: 'red' }}>
        Missing required environment variables for YouTube upload.
      </p>
    );
  }

  return (
    <div>
      {!accessToken && (
        <button onClick={handleAuthentication} disabled={isAuthenticating}>
          {isAuthenticating ? 'Authenticating...' : 'Authenticate with YouTube'}
        </button>
      )}

      {accessToken && (
        <p style={{ color: 'green' }}>Authenticated with YouTube!</p>
      )}

      <div>
        <label htmlFor='title'>Title:</label>
        <input
          type='text'
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='description'>Description:</label>
        <textarea
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='privacy'>Privacy:</label>
        <select
          id='privacy'
          value={privacyStatus}
          onChange={(e) => setPrivacyStatus(e.target.value)}
        >
          <option value={PRIVACY_STATUSES.PUBLIC}>Public</option>
          <option value={PRIVACY_STATUSES.PRIVATE}>Private</option>
          <option value={PRIVACY_STATUSES.UNLISTED}>Unlisted</option>
        </select>
      </div>

      <button onClick={uploadVideoToYouTube} disabled={uploading || !accessToken}>
        {uploading ? 'Uploading...' : 'Upload to YouTube'}
      </button>

      {uploadComplete && (
        <p style={{ color: 'green' }}>Upload complete! Video ID: {videoId}</p>
      )}
    </div>
  );
};

export default YouTubeUpload;
