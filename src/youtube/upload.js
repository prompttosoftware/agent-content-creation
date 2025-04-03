// src/youtube/upload.js

import { google } from 'googleapis';
import fs from 'fs';
import { getAccessToken } from './auth.js';
import { parseYouTubeError } from '../utils/errorHandling.js';
import path from 'path'; // Import path module

/**
 * Uploads a video to YouTube.
 * @param {string} videoFilePath - The path to the video file.
 * @param {object} metadata - The video metadata (title, description, etc.).
 * @param {string} metadata.title - The title of the video.
 * @param {string} metadata.description - The description of the video.
 * @param {string} metadata.privacyStatus - The privacy status of the video ('public', 'private', 'unlisted').
 * @returns {Promise<string|null>} - The video ID if the upload is successful, or null if it fails.
 */
async function uploadVideo(videoFilePath, metadata) {
    try {
        // 1. Get the access token.
        const accessToken = await getAccessToken();

        const youtube = google.youtube({
            version: 'v3',
            auth: accessToken,
        });

        const { title, description, privacyStatus } = metadata;

        // Validate required metadata
        if (!title) {
            throw new Error("Video title is required.");
        }
        if (!privacyStatus) {
            throw new Error("Privacy status is required.");
        }

        // 2. Read the video file.
        const videoBuffer = fs.readFileSync(videoFilePath);
        const fileSize = videoBuffer.length;

        // 3. Prepare the request.
        const res = await youtube.videos.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: title,
                    description: description || '',
                    categoryId: '22', // Default to 'People & Blogs'
                },
                status: {
                    privacyStatus: privacyStatus,
                },
            },
            media: {
                body: videoBuffer,
            },
        }, {
            onUploadProgress: (event) => {
                const progress = (event.bytesRead / fileSize) * 100;
                console.log(`${Math.round(progress)}% uploaded`);
            },
        });

        // 4. Handle the response.
        const videoId = res.data.id;
        console.log(`Video uploaded successfully. Video ID: ${videoId}`);
        return videoId;

    } catch (error) {
        console.error('Error uploading video:', error);
        throw parseYouTubeError(error);
    }
}

// Example usage (requires a test video and authentication setup)
async function runUploadExample() {
    const videoFilePath = path.join(process.cwd(), 'test_video.mp4'); // Use path.join for cross-platform compatibility
    const videoMetadata = {
        title: 'Test Upload Video',
        description: 'This video was uploaded using the YouTube API.',
        privacyStatus: 'unlisted', // Or 'public' or 'private'
    };

    try {
        const videoId = await uploadVideo(videoFilePath, videoMetadata);
        if (videoId) {
            console.log(`Video ID: ${videoId}`);
        } else {
            console.log('Video upload failed.');
        }
    } catch (error) {
        console.error('Error during upload example:', error);
    }
}

// Run the example if the script is executed directly (not imported as a module)
if (process.argv[1] === import.meta.url) {
    runUploadExample();
}


module.exports = uploadVideo;