import request from 'supertest';
import { app, startServer, stopServer } from './server.js';
import { google } from 'googleapis'; // Import googleapis directly
import fs from 'fs';
import path from 'path';

// Mock the googleapis library
jest.mock('googleapis', () => ({
    google: {
        youtube: jest.fn(() => ({
            videos: {
                insert: jest.fn(),
            },
        })),
        auth: {
            OAuth2: jest.fn().mockImplementation(() => ({
                setCredentials: jest.fn(),
                generateAuthUrl: jest.fn().mockReturnValue('authUrl'),
            })),
        },
    },
}));

// Mock fs module
jest.mock('fs', () => ({
    ...jest.requireActual('fs'), // Use the real fs module for other functions
    readFileSync: jest.fn(),
    createReadStream: jest.fn().mockReturnValue({}), // Mock createReadStream
    statSync: jest.fn().mockReturnValue({ size: 100 }), // Mock statSync
}));


describe('API Endpoints - Error Handling and Logging', () => {
    let server;
    let appInstance;

    beforeAll(async () => {
        await startServer().then(({ server: s, app: a }) => {
            server = s;
            appInstance = a;
        });
    }, 10000);

    afterAll(async () => {
        await stopServer();
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should handle authentication errors gracefully', async () => {
        // Mock fs.readFileSync to simulate a credentials loading error
        fs.readFileSync.mockImplementation((path) => {
            if (path.endsWith('credentials.json')) {
                throw new Error('Failed to read credentials');
            } else if (path.endsWith('token.json')) {
                throw new Error('Failed to read token');
            }
        });

        const response = await request(appInstance)
            .post('/api/upload-video')
            .send({ videoPath: 'path/to/video.mp4', videoTitle: 'Test Title', videoDescription: 'Test Description' });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Failed to load credentials.  Ensure credentials.json exists and is valid.');
    });

    it('should handle video upload errors (invalid video path)', async () => {
        // Mock the uploadVideo function to throw an error
        const mockAuthorize = jest.fn().mockResolvedValue({});
        const mockUploadVideo = jest.fn().mockRejectedValue(new Error('File not found'));
        jest.spyOn(global, 'authorize').mockImplementation(mockAuthorize);
        jest.spyOn(global, 'uploadVideo').mockImplementation(mockUploadVideo);

        const response = await request(appInstance)
            .post('/api/upload-video')
            .send({ videoPath: 'invalid/path/to/video.mp4', videoTitle: 'Test Title', videoDescription: 'Test Description' });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Failed to upload video.  Please check your video file and try again.');
    });

    it('should handle video upload errors (insufficient permissions - 403)', async () => {
        // Mock the uploadVideo function to throw a 403 error
        const mockAuthorize = jest.fn().mockResolvedValue({});
        const mockUploadVideo = jest.fn().mockRejectedValue({ code: 403, message: 'Forbidden' });
        jest.spyOn(global, 'authorize').mockImplementation(mockAuthorize);
        jest.spyOn(global, 'uploadVideo').mockImplementation(mockUploadVideo);

        const response = await request(appInstance)
            .post('/api/upload-video')
            .send({ videoPath: 'path/to/video.mp4', videoTitle: 'Test Title', videoDescription: 'Test Description' });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('You do not have permission to upload videos.  Check your Google Cloud project permissions.');
    });

    it('should handle video upload errors (400 - invalid request parameters)', async () => {
        // Mock the uploadVideo function to throw a 400 error
        const mockAuthorize = jest.fn().mockResolvedValue({});
        const mockUploadVideo = jest.fn().mockRejectedValue({ code: 400, message: 'Bad Request' });
        jest.spyOn(global, 'authorize').mockImplementation(mockAuthorize);
        jest.spyOn(global, 'uploadVideo').mockImplementation(mockUploadVideo);

        const response = await request(appInstance)
            .post('/api/upload-video')
            .send({ videoPath: 'path/to/video.mp4', videoTitle: 'Test Title', videoDescription: 'Test Description' });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Invalid request parameters. Please check the video title and description.');
    });

    it('should handle successful video upload', async () => {
        // Mock the uploadVideo function to return a video ID
        const mockAuthorize = jest.fn().mockResolvedValue({});
        const mockUploadVideo = jest.fn().mockResolvedValue('video-id-123');
        jest.spyOn(global, 'authorize').mockImplementation(mockAuthorize);
        jest.spyOn(global, 'uploadVideo').mockImplementation(mockUploadVideo);


        const response = await request(appInstance)
            .post('/api/upload-video')
            .send({ videoPath: 'path/to/video.mp4', videoTitle: 'Test Title', videoDescription: 'Test Description' });

        expect(response.statusCode).toBe(200);
        expect(response.body.videoId).toBe('video-id-123');
    });

    it('should handle missing required fields in upload-video request', async () => {
        const response = await request(appInstance)
            .post('/api/upload-video')
            .send({ videoPath: 'path/to/video.mp4' }); // Missing videoTitle and videoDescription

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('videoPath, videoTitle, and videoDescription are required');
    });

    it('should handle authentication errors (invalid token)', async () => {
        // Simulate an invalid token by mocking the authorize function
        fs.readFileSync.mockImplementation( (path) => {
            if (path.endsWith('token.json')) {
                throw new Error('Token is invalid')
            }
            return 'valid';
        });

        const response = await request(appInstance)
            .post('/api/upload-video')
            .send({ videoPath: 'path/to/video.mp4', videoTitle: 'Test Title', videoDescription: 'Test Description' });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Failed to load credentials.  Ensure credentials.json exists and is valid.');
    });
});