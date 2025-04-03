import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import YouTubeUpload from './YouTubeUpload';
import { google } from 'googleapis';

// Mock the googleapis library
jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn(() => ({
        generateAuthUrl: jest.fn(() => 'authUrl'),
        getToken: jest.fn(() => Promise.resolve({ tokens: { access_token: 'mockAccessToken' } })),
        setCredentials: jest.fn(),
      })),
    },
    youtube: jest.fn(() => ({
      videos: {
        insert: jest.fn(),
      },
    })),
  },
}));

// Mock FileReader API
global.FileReader = jest.fn(() => ({
  readAsArrayBuffer: jest.fn(),
  onload: jest.fn(),
  onerror: jest.fn(),
  result: new ArrayBuffer(0), // Provide an initial result
}));

// Mock ReadableStream API - needed for the video upload logic
global.ReadableStream = jest.fn(() => ({
    // Implement a basic ReadableStream mock as needed for your component
    //  Consider more robust mocking if the component's stream usage is more complex
    start: jest.fn((controller) => {
      if (controller && controller.enqueue && controller.close) {
        // Simulate data being enqueued and stream closed
        controller.enqueue(new Uint8Array([]));  // Enqueue some initial data
        controller.close();
      }
    }),
  }));



describe('YouTubeUpload Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Clear localStorage if you're using it
    // localStorage.clear(); // If you are using localStorage in the component
    window.location.assign = jest.fn(); // Mock window.location.assign for redirects
    window.history.replaceState = jest.fn(); // Mock replaceState
  });


  it('renders the component initially (before authentication)', () => {
    render(<YouTubeUpload />);
    expect(screen.getByText('YouTube Video Upload')).toBeInTheDocument();
    expect(screen.getByText('Authenticate with YouTube')).toBeInTheDocument();
  });

  it('simulates a successful authentication and renders the authenticated state', async () => {
    render(<YouTubeUpload />);
    const authButton = screen.getByText('Authenticate with YouTube');
    fireEvent.click(authButton);

    // Simulate OAuth callback
    const params = new URLSearchParams();
    params.append('code', 'authCode');
    Object.defineProperty(window, 'location', {
      value: {
        search: `?${params.toString()}`,
        pathname: '/', // Simulate the redirect back
      },
      writable: true,
    });


    // Wait for the effect hook to complete and the component to update
    await waitFor(() => {
      expect(screen.getByText('Authenticated with YouTube.')).toBeInTheDocument();
    });

    expect(google.auth.OAuth2).toHaveBeenCalled();
    expect(window.history.replaceState).toHaveBeenCalled(); // Verify history is updated
  });

  it('simulates file selection and verifies the file is correctly set', () => {
    render(<YouTubeUpload />);
    const fileInput = screen.getByLabelText('Choose Video:');
    const file = new File([''], 'test.mp4', { type: 'video/mp4' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files[0]).toBe(file);
  });

  it('simulates a successful video upload and verifies the success message is displayed', async () => {
    const mockInsert = jest.fn(() =>
      Promise.resolve({
        status: 200,
        data: { id: 'videoId' },
      })
    );
    google.youtube = jest.fn(() => ({
      videos: {
        insert: mockInsert,
      },
    }));

    render(<YouTubeUpload />);

    // Authenticate
    const authButton = screen.getByText('Authenticate with YouTube');
    fireEvent.click(authButton);
    const params = new URLSearchParams();
    params.append('code', 'authCode');
    Object.defineProperty(window, 'location', {
      value: {
        search: `?${params.toString()}`,
        pathname: '/',
      },
      writable: true,
    });
    await waitFor(() => {
      expect(screen.getByText('Authenticated with YouTube.')).toBeInTheDocument();
    });

    // Select a file
    const fileInput = screen.getByLabelText('Choose Video:');
    const file = new File([''], 'test.mp4', { type: 'video/mp4' });
    fireEvent.change(fileInput, { target: { files: [file] } });


    // Fill in video details (title, description, etc.)
    fireEvent.change(screen.getByLabelText('Title:'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'Test Description' } });

    // Click Upload
    const uploadButton = screen.getByText('Upload');
    fireEvent.click(uploadButton);

    // Wait for upload to complete and check success message
    await waitFor(() => {
      expect(screen.getByText('Upload complete!')).toBeInTheDocument();
    });

    expect(mockInsert).toHaveBeenCalled();
  });

  it('simulates a failed video upload and verifies the error message is displayed', async () => {
    const mockInsert = jest.fn(() =>
      Promise.reject({
        response: {
          status: 400,
          data: { error: { message: 'Upload failed' } },
        },
      })
    );
    google.youtube = jest.fn(() => ({
      videos: {
        insert: mockInsert,
      },
    }));

    render(<YouTubeUpload />);

    // Authenticate
    const authButton = screen.getByText('Authenticate with YouTube');
    fireEvent.click(authButton);
    const params = new URLSearchParams();
    params.append('code', 'authCode');
    Object.defineProperty(window, 'location', {
      value: {
        search: `?${params.toString()}`,
        pathname: '/',
      },
      writable: true,
    });
    await waitFor(() => {
      expect(screen.getByText('Authenticated with YouTube.')).toBeInTheDocument();
    });

    // Select a file
    const fileInput = screen.getByLabelText('Choose Video:');
    const file = new File([''], 'test.mp4', { type: 'video/mp4' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Fill in video details (title, description, etc.)
    fireEvent.change(screen.getByLabelText('Title:'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'Test Description' } });

    // Click Upload
    const uploadButton = screen.getByText('Upload');
    fireEvent.click(uploadButton);

    // Wait for the error message
    await waitFor(() => {
        expect(screen.getByText('Error: Upload failed')).toBeInTheDocument();
    });


    expect(mockInsert).toHaveBeenCalled();
  });
});