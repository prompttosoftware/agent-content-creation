import React, { useState, useRef, useEffect } from 'react';
import { initiateAuth, handleAuthCode, refreshAccessToken, authenticate } from '../youtube/auth';
import { uploadVideo } from '../youtube/upload';
import { parseYouTubeError } from '../utils/errorHandling';

/**
 * YouTubeUpload Component
 * Handles authentication, video details input, file upload, and progress display.
 */
const YouTubeUpload = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null); // Store the refresh token
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
    const [videoId, setVideoId] = useState(null);
    const fileInputRef = useRef(null);

    // --- Authentication ---

    useEffect(() => {
        const loadTokens = async () => {
            try {
                const storedTokens = JSON.parse(localStorage.getItem('youtube_tokens'));
                if (storedTokens?.access_token) {
                    setAccessToken(storedTokens.access_token);
                }
                if (storedTokens?.refresh_token) {
                    setRefreshToken(storedTokens.refresh_token);
                }
            } catch (error) {
                console.error("Error loading tokens from localStorage:", error);
            }
        };

        loadTokens();

        // Handle OAuth Callback - This runs when the app redirects back after OAuth
        const handleOAuthCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');

            if (code) {
                try {
                    const tokens = await handleAuthCode(code); // Use the auth function.
                    setAccessToken(tokens.access_token);
                    setRefreshToken(tokens.refresh_token);
                    // Store tokens in local storage
                    localStorage.setItem('youtube_tokens', JSON.stringify(tokens));

                    // Clear the URL params to avoid re-running this logic on refresh
                    window.history.replaceState({}, document.title, window.location.pathname);

                } catch (error) {
                    console.error('Error exchanging authorization code for tokens:', error);
                    setUploadError(parseYouTubeError(error));  // Use error handling
                }
            }
        };

        handleOAuthCallback(); // Check for and handle the OAuth code

    }, []);

    useEffect(() => {
        const refresh = async () => {
            if (refreshToken && accessToken) {
                try {
                    const newAccessToken = await refreshAccessToken(refreshToken);
                    setAccessToken(newAccessToken);
                    console.log("Access token refreshed successfully.");
                } catch (error) {
                    console.error("Failed to refresh access token:", error);
                    // Handle refresh token failure (e.g., clear tokens and re-authenticate)
                    localStorage.removeItem('youtube_tokens');
                    setAccessToken(null);
                    setRefreshToken(null);
                    setUploadError("Session expired. Please re-authenticate.");
                }
            }
        };

        // Refresh the token every hour (3600 seconds) - adjust as needed.
        const intervalId = setInterval(refresh, 3600 * 1000);

        return () => clearInterval(intervalId);
    }, [refreshToken, accessToken]);

    /**
     *  Initiates the OAuth flow to get an access token.
     */
    const handleAuthClick = async () => {
        try {
            const authUrl = initiateAuth();
            if (authUrl) {
                window.location.href = authUrl;
            } else {
                setUploadError("Could not generate authorization URL.  Please check your configuration.");
            }
        } catch (error) {
            setUploadError(parseYouTubeError(error));
        }
    };


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
            // Use the uploadVideo function from the upload.js file.
            const videoId = await uploadVideo( 
                videoFile, // Pass the file object
                videoDetails,
                accessToken,
            );
            console.log('Video uploaded successfully! Video ID:', videoId);
            setVideoId(videoId);
            setUploadComplete(true);
        } catch (error) {
            console.error('Upload error:', error);
            setUploadError(parseYouTubeError(error)); // Use error handling
        } finally {
            setUploading(false);
        }
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

                        {uploadComplete && (
                            <div>
                                <p style={{ color: 'green' }}>Upload complete!</p>
                                {videoId && (
                                    <p>Video ID: <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">{videoId}</a></p>
                                )}
                            </div>
                        )}

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
