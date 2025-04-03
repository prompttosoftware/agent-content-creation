import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import VideoCanvas from './VideoCanvas';
import { createCanvas, loadImage } from 'canvas';

// Mock the canvas element and its context

jest.mock('canvas', () => {
  const mockedContext = {
    clearRect: jest.fn(),
    fillText: jest.fn(),
    drawImage: jest.fn(),
    font: '',
    fillStyle: ''
  };

  const mockedCanvas = {
    getContext: jest.fn(() => mockedContext),
    toDataURL: jest.fn(() => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+gHwN/8BwD+KAAhOAAeugEA2wAAAAASUVORK5CYII='),
    width: 200,
    height: 100,
  };

  return {
    createCanvas: jest.fn(() => mockedCanvas),
    loadImage: jest.fn(() => Promise.resolve({ width: 10, height: 5, height: 5, naturalWidth: 10, naturalHeight: 5 })),
  };
});


describe('VideoCanvas Component', () => {
  it('renders a canvas element', () => {
    render(<VideoCanvas videoWidth={100} videoHeight={100} agentContent={[]} />);
    const canvasElement = screen.getByRole('canvas');
    expect(canvasElement).toBeInTheDocument();
  });

  it('draws text content correctly', async () => {
    const mockContent = [{ type: 'text', value: 'Hello, world!' }];
    render(<VideoCanvas videoWidth={200} videoHeight={100} agentContent={mockContent} />);
    const canvas = screen.getByRole('canvas');
    const ctx = canvas.getContext('2d');
    await waitFor(() => {
        expect(ctx.fillText).toHaveBeenCalledWith('Hello, world!', expect.any(Number), expect.any(Number));
    });
  });

  it('draws image content correctly', async () => {
    const mockContent = [{ type: 'image', imageUrl: 'test.jpg' }];
    render(<VideoCanvas videoWidth={200} videoHeight={100} agentContent={mockContent} />);
    const canvas = screen.getByRole('canvas');
    const ctx = canvas.getContext('2d');
    await waitFor(() => {
        expect(ctx.drawImage).toHaveBeenCalled();
    });
  });

  it('handles missing agent content gracefully', () => {
    render(<VideoCanvas videoWidth={200} videoHeight={100} />);
    const canvasElement = screen.getByRole('canvas');
    expect(canvasElement).toBeInTheDocument();
  });

  it('handles image loading errors gracefully', async () => {
    const mockedLoadImage = jest.fn(() => Promise.reject(new Error('Image load error')));
    jest.mock('canvas', () => {
        const mockedContext = {
            clearRect: jest.fn(),
            fillText: jest.fn(),
            drawImage: jest.fn(),
            font: '',
            fillStyle: ''
          };

        const mockedCanvas = {
            getContext: jest.fn(() => mockedContext),
            toDataURL: jest.fn(() => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+gHwN/8BwD+KAAhOAAeugEA2wAAAAASUVORK5CYII='),
            width: 200,
            height: 100,
          };

      return {
        createCanvas: jest.fn(() => mockedCanvas),
        loadImage: mockedLoadImage,
      };
    });

    const mockContent = [{ type: 'image', imageUrl: 'test.jpg' }];
    render(<VideoCanvas videoWidth={200} videoHeight={100} agentContent={mockContent} />);
    const canvasElement = screen.getByRole('canvas');
    const ctx = canvasElement.getContext('2d');
    await waitFor(() => {
        expect(ctx.drawImage).not.toHaveBeenCalled();
    });
  });
});