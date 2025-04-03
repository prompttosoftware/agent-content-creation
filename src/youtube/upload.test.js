// src/youtube/upload.test.js
import { uploadVideo } from './upload';
import { google } from 'googleapis';
import fs from 'fs';
import { getAccessToken } from './auth';
import { parseYouTubeError } from '../utils/errorHandling';
import createTestVideo from '../scripts/create_test_video'; // Import createTestVideo

// Mock the googleapis module
jest.mock('googleapis');
jest.mock('fs'); // Mock the fs module
jest.mock('./auth'); // Mock the auth module
jest.mock('../utils/errorHandling'); // Mock errorHandling
jest.mock('../scripts/create_test_video'); // Mock createTestVideo

describe('uploadVideo', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    // Reset the accessToken mock
    getAccessToken.mockClear();
    parseYouTubeError.mockClear();
    createTestVideo.mockClear();
    fs.readFileSync.mockClear();
  });

  it('should upload a video successfully with public privacy', async () => {
    // Mock the YouTube API methods
    const mockVideosInsert = jest.fn().mockResolvedValue({
      data: {
        id: 'video_id',
        snippet: { title: 'Test Video' },
      },
      status: 200,
    });
    google.youtube.mockImplementation(() => ({
      videos: {
        insert: mockVideosInsert,
      },
    }));

    // Mock createTestVideo to return a file path
    const mockFilePath = 'test_video.mp4';
    createTestVideo.mockResolvedValue(mockFilePath);

    // Mock fs.readFileSync to return a Buffer
    const mockFileContent = Buffer.from('AAAA');
    fs.readFileSync.mockReturnValue(mockFileContent);

    const metadata = {
      title: 'Test Title',
      description: 'Test Description',
      privacyStatus: 'public',
    };

    const accessToken = 'mockAccessToken';
    getAccessToken.mockResolvedValue(accessToken);

    const videoId = await uploadVideo(mockFilePath, metadata);

    expect(videoId).toBe('video_id');
    expect(mockVideosInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: 'Test Title',
            description: 'Test Description',
            categoryId: '22',
          },
          status: {
            privacyStatus: 'public',
          },
        },
        media: {
          body: mockFileContent,
        },
      })
    );
    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath);
    expect(getAccessToken).toHaveBeenCalled();
  });

  it('should upload a video successfully with private privacy', async () => {
    // Mock the YouTube API methods
    const mockVideosInsert = jest.fn().mockResolvedValue({
      data: {
        id: 'video_id',
        snippet: { title: 'Test Video' },
      },
      status: 200,
    });
    google.youtube.mockImplementation(() => ({
      videos: {
        insert: mockVideosInsert,
      },
    }));

    // Mock createTestVideo to return a file path
    const mockFilePath = 'test_video.mp4';
    createTestVideo.mockResolvedValue(mockFilePath);

    // Mock fs.readFileSync to return a Buffer
    const mockFileContent = Buffer.from('BBBB');
    fs.readFileSync.mockReturnValue(mockFileContent);

    const metadata = {
      title: 'Private Video',
      description: 'This is a private video',
      privacyStatus: 'private',
    };
    const accessToken = 'mockAccessToken';
    getAccessToken.mockResolvedValue(accessToken);

    const videoId = await uploadVideo(mockFilePath, metadata);

    expect(videoId).toBe('video_id');
    expect(mockVideosInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: 'Private Video',
            description: 'This is a private video',
            categoryId: '22',
          },
          status: {
            privacyStatus: 'private',
          },
        },
        media: {
          body: mockFileContent,
        },
      })
    );
    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath);
    expect(getAccessToken).toHaveBeenCalled();
  });

  it('should upload a video successfully with unlisted privacy', async () => {
    // Mock the YouTube API methods
    const mockVideosInsert = jest.fn().mockResolvedValue({
      data: {
        id: 'video_id',
        snippet: { title: 'Test Video' },
      },
      status: 200,
    });
    google.youtube.mockImplementation(() => ({
      videos: {
        insert: mockVideosInsert,
      },
    }));

    // Mock createTestVideo to return a file path
    const mockFilePath = 'test_video.mp4';
    createTestVideo.mockResolvedValue(mockFilePath);

    // Mock fs.readFileSync to return a Buffer
    const mockFileContent = Buffer.from('CCCC');
    fs.readFileSync.mockReturnValue(mockFileContent);


    const metadata = {
      title: 'Unlisted Video',
      description: 'This is an unlisted video',
      privacyStatus: 'unlisted',
    };
    const accessToken = 'mockAccessToken';
    getAccessToken.mockResolvedValue(accessToken);

    const videoId = await uploadVideo(mockFilePath, metadata);

    expect(videoId).toBe('video_id');
    expect(mockVideosInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: 'Unlisted Video',
            description: 'This is an unlisted video',
            categoryId: '22',
          },
          status: {
            privacyStatus: 'unlisted',
          },
        },
        media: {
          body: mockFileContent,
        },
      })
    );
    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath);
    expect(getAccessToken).toHaveBeenCalled();
  });

  it('should handle errors and re-throw after parsing', async () => {
    // Mock the YouTube API methods to simulate an error
    const mockError = new Error('YouTube API error');
    const parsedError = new Error('Parsed error');

    // Mock createTestVideo to return a file path
    const mockFilePath = 'test_video.mp4';
    createTestVideo.mockResolvedValue(mockFilePath);

    // Mock fs.readFileSync to return a Buffer
    const mockFileContent = Buffer.from('AAAA');
    fs.readFileSync.mockReturnValue(mockFileContent);

    const mockVideosInsert = jest.fn().mockRejectedValue(mockError);
    google.youtube.mockImplementation(() => ({
      videos: {
        insert: mockVideosInsert,
      },
    }));
    parseYouTubeError.mockReturnValue(parsedError);
    const accessToken = 'mockAccessToken';
    getAccessToken.mockResolvedValue(accessToken);

    const metadata = {
      title: 'Test Title',
      description: 'Test Description',
      privacyStatus: 'public',
    };

    await expect(uploadVideo(mockFilePath, metadata)).rejects.toThrow(parsedError);
    expect(parseYouTubeError).toHaveBeenCalledWith(mockError);
    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath);
    expect(getAccessToken).toHaveBeenCalled();
  });


  it('should handle a failed upload', async () => {
    // Mock the YouTube API methods to simulate an error
    const mockVideosInsert = jest.fn().mockRejectedValue({
      response: {
        data: {
          error: {
            errors: [{ message: 'Upload failed' }],
          },
        },
        status: 400,
      },
    });
    google.youtube.mockImplementation(() => ({
      videos: {
        insert: mockVideosInsert,
      },
    }));

    // Mock createTestVideo to return a file path
    const mockFilePath = 'test_video.mp4';
    createTestVideo.mockResolvedValue(mockFilePath);

    // Mock fs.readFileSync to return a Buffer
    const mockFileContent = Buffer.from('AAAA');
    fs.readFileSync.mockReturnValue(mockFileContent);

    const metadata = {
      title: 'Test Title',
      description: 'Test Description',
      privacyStatus: 'private',
    };
    const accessToken = 'mockAccessToken';
    getAccessToken.mockResolvedValue(accessToken);
    const expectedError = new Error('Upload failed');

    parseYouTubeError.mockReturnValue(expectedError);

    await expect(uploadVideo(mockFilePath, metadata)).rejects.toThrow(expectedError);
    expect(parseYouTubeError).toHaveBeenCalled();
    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath);
    expect(getAccessToken).toHaveBeenCalled();
  });
});