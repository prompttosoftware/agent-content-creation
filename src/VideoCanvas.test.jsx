// VideoCanvas.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoCanvas from './VideoCanvas';
import { createCanvas, loadImage } from 'canvas';

jest.mock('canvas', () => {
  const mockedCanvas = {
    getContext: jest.fn(() => ({
      clearRect: jest.fn(),
      fillText: jest.fn(),
      drawImage: jest.fn(),
      font: '',
      fillStyle: ''
    })),
    toDataURL: jest.fn(() => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+gHwN/8BwD+KAAhOAAeugEA2wAAAAASUVORK5CYII='),
  };
  return {
    createCanvas: jest.fn(() => mockedCanvas),
    loadImage: jest.fn(() => Promise.resolve({ width: 10, height: 5 })),
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
    const canvas = await screen.findByRole('canvas');
    const ctx = canvas.getContext('2d');
    expect(ctx.fillText).toHaveBeenCalledWith('Hello, world! ', expect.any(Number), expect.any(Number));
  });

  it('draws image content correctly', async () => {
    const mockContent = [{ type: 'image', imageUrl: 'test.jpg' }];
    render(<VideoCanvas videoWidth={200} videoHeight={100} agentContent={mockContent} />);
    const canvas = await screen.findByRole('canvas');
    const ctx = canvas.getContext('2d');
    expect(ctx.drawImage).toHaveBeenCalled();
  });

  it('handles missing agent content gracefully', () => {
    render(<VideoCanvas videoWidth={200} videoHeight={100} />);
    const canvasElement = screen.getByRole('canvas');
    expect(canvasElement).toBeInTheDocument();
  });

  it('handles image loading errors gracefully', async () => {
    jest.mock('canvas', () => {
      const mockedCanvas = {
        getContext: jest.fn(() => ({
          clearRect: jest.fn(),
          fillText: jest.fn(),
          drawImage: jest.fn(),
          font: '',
          fillStyle: ''
        })),
        toDataURL: jest.fn(() => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+gHwN/8BwD+KAAhOAAeugEA2wAAAAASUVORK5CYII='),
      };
      return {
        createCanvas: jest.fn(() => mockedCanvas),
        loadImage: jest.fn(() => Promise.reject(new Error('Image load error'))),
      };
    });

    const mockContent = [{ type: 'image', imageUrl: 'test.jpg' }];
    render(<VideoCanvas videoWidth={200} videoHeight={100} agentContent={mockContent} />);
    const canvasElement = await screen.findByRole('canvas');
    const ctx = canvasElement.getContext('2d');
    expect(ctx.drawImage).not.toHaveBeenCalled();
  });
});
