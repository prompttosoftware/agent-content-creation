const request = require('supertest');
const express = require('express');
const { authorize, uploadVideo } = require('./youtube/upload'); // Corrected import path
const { handleApiError } = require('./src/utils/errorHandling');
const app = require('../server'); // Import your Express app

// Mock the youtube/upload module
jest.mock('./youtube/upload');

describe('API Endpoints - Error Handling and Logging', () => {
    let appInstance;
    let server;

    beforeAll(() => {
        // Start the server before all tests
        server = app.listen(3001, () => {
            console.log('Server listening at http://localhost:3001');
        });
        appInstance = app;
    });

    afterAll((done) => {
        // Close the server after all tests
        if (server) {
            if (server) {
                server.close(done);
            }
        }
    });

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('should respond with 200 for /api/hello', async () => {
        const response = await request(appInstance).get('/api/hello');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello, world!');
    });

    it('should respond with 200 for /agent/update', async () => {
        const response = await request(appInstance).post('/agent/update');
        expect(response.statusCode).toBe(200);
    });

    it('should respond with 200 for /agent/done', async () => {
        const response = await request(appInstance).post('/agent/done');
        expect(response.statusCode).toBe(200);
    });

    it('should handle invalid routes with 404', async () => {
        const response = await request(appInstance).get('/invalid-route');
        expect(response.statusCode).toBe(404);
    });

    it('should handle authentication errors gracefully', async () => {
        // Mock authorize to simulate authentication failure
        const mockAuthorize = jest.fn().mockRejectedValue(new Error('Failed to load credentials.  Ensure credentials.json exists and is valid.'));
        jest.mock('./youtube/upload', () => ({
            ...jest.requireActual('./youtube/upload'),
            authorize: mockAuthorize,
            uploadVideo
        }));

        const response = await request(appInstance)
            .post('/api/upload-video')
            .send({ videoPath: 'path/to/video.mp4', videoTitle: 'Test Title', videoDescription: 'Test Description' });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Failed to load credentials.  Ensure credentials.json exists and is valid.');
    });

    it('should handle video upload errors (invalid video path)', async () => {
        // Mock authorize to simulate authentication success
        const mockAuthorize = jest.fn().mockResolvedValue({});
        // Mock uploadVideo to simulate a file not found error
        const mockUploadVideo = jest.fn().mockRejectedValue(new Error('File not found'));
        jest.mock('./youtube/upload', () => ({
            ...jest.requireActual('./youtube/upload'),
            authorize: mockAuthorize,
            uploadVideo: mockUploadVideo
        }));

        const response = await request(appInstance)
            .post('/api/upload-video')
            .send({ videoPath: 'path/to/video.mp4', videoTitle: 'Test Title', videoDescription: 'Test Description' });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('File not found');
    });

    it('should handle video upload errors (insufficient permissions - 403)', async () => {
        // Mock authorize to simulate authentication success
        const mockAuthorize = jest.fn().mockResolvedValue({});
        // Mock uploadVideo to simulate a 403 error
        const mockUploadVideo = jest.fn().mockRejectedValue({ code: 403, message: 'Forbidden' });
        jest.mock('./youtube/upload', () => ({
            ...jest.requireActual('./youtube/upload'),
            authorize: mockAuthorize,
            uploadVideo: mockUploadVideo
        }));

        const response = await request(appInstance)
            .post('/api/upload-video')
            .send({ videoPath: 'path/to/video.mp4', videoTitle: 'Test Title', videoDescription: 'Test Description' });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Forbidden');
    });

    it('should handle video upload errors (400 - invalid request parameters)', async () => {
        // Mock authorize to simulate authentication success
        const mockAuthorize = jest.fn().mockResolvedValue({});
        // Mock uploadVideo to simulate a 400 error
        const mockUploadVideo = jest.fn().mockRejectedValue({ code: 400, message: 'Bad Request' });
        jest.mock('./youtube/upload', () => ({
            ...jest.requireActual('./youtube/upload'),
            authorize: mockAuthorize,
            uploadVideo: mockUploadVideo
        }));

        const response = await request(appInstance)
            .post('/api/upload-video')
            .send({ videoPath: 'path/to/video.mp4', videoTitle: 'Test Title', videoDescription: 'Test Description' });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Bad Request');
    });

    it('should handle successful video upload', async () => {
        // Mock authorize to simulate authentication success
        const mockAuthorize = jest.fn().mockResolvedValue({});
        // Mock uploadVideo to simulate a successful upload
        const mockUploadVideo = jest.fn().mockResolvedValue('video-id-123');
        jest.mock('./youtube/upload', () => ({
            ...jest.requireActual('./youtube/upload'),
            authorize: mockAuthorize,
            uploadVideo: mockUploadVideo
        }));

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
        // Mock authorize to simulate authentication failure
        const mockAuthorize = jest.fn().mockRejectedValue(new Error('Failed to load credentials.  Ensure credentials.json exists and is valid.'));
        jest.mock('./youtube/upload', () => ({
            ...jest.requireActual('./youtube/upload'),
            authorize: mockAuthorize,
            uploadVideo
        }));

        const response = await request(appInstance)
            .post('/api/upload-video')
            .send({ videoPath: 'path/to/video.mp4', videoTitle: 'Test Title', videoDescription: 'Test Description' });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Failed to load credentials.  Ensure credentials.json exists and is valid.');
    });
});