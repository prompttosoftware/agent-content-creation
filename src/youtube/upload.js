// src/youtube/upload.js
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { authenticate } from './auth.js';
import { handleApiError, handleUnexpectedError } from '../utils/errorHandling.js';
import ffmpeg from 'fluent-ffmpeg';

const CHUNK_SIZE = 256 * 1024; // 256KB - Adjust as needed for your network and video size

/**
 * Uploads a video to YouTube.
 * @param {string} filePath - The path to the video file.
 * @param {object} videoMetadata - The video metadata (title, description, etc.).
 * @returns {Promise<string>} - The video ID.
 * @throws {Error} - If the upload fails.
 */
async function uploadVideo(filePath, videoMetadata) {
    console.log(`Starting video upload for: ${filePath}`); // Add logging at the start
    try {
        const { client: authClient } = await authenticate(); // Get the authenticated client
        const youtube = google.youtube({ version: 'v3', auth: authClient });

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            const errorMessage = `Video file not found: ${filePath}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        const fileSize = fs.statSync(filePath).size;
        const fileSizeInMB = (fileSize / (1024*1024)).toFixed(2);
        console.log(`File ${filePath} exists. Size: ${fileSizeInMB} MB`); // Log file size

        const uploadStartTime = new Date(); // Start time for upload duration calculation

        const uploadResponse = await youtube.videos.insert(
            {
                part: 'snippet,status',
                requestBody: {
                    snippet: {
                        title: videoMetadata.title,
                        description: videoMetadata.description,
                        categoryId: videoMetadata.categoryId || '22', // Default to 'People & Blogs'
                        tags: videoMetadata.tags || [],
                    },
                    status: {
                        privacyStatus: videoMetadata.privacyStatus || 'private',
                    },
                },
                media: {
                    mimeType: 'video/mp4', // e.g., 'video/mp4' - MUST BE PROVIDED
                    body: fs.createReadStream(filePath),
                },
            },
            {
                onUploadProgress: (event) => {
                    const progress = (event.bytesRead / fileSize) * 100;
                    console.log(`${Math.round(progress)}% done`);
                },
            }
        );

        const uploadEndTime = new Date(); // End time for upload duration calculation
        const uploadDuration = (uploadEndTime.getTime() - uploadStartTime.getTime()) / 1000; // in seconds

        const videoId = uploadResponse.data.id;
        console.log(`Video uploaded successfully. Video ID: ${videoId}. Upload duration: ${uploadDuration} seconds`);
        return videoId;
    } catch (error) {
        console.error('Error uploading video:', error);
        const errorMessage = handleApiError(error, 'uploadVideo');
        throw new Error(errorMessage); // Throw a more descriptive error
    }
}

export { uploadVideo };