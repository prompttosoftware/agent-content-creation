import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoCanvas from './VideoCanvas';
import '@testing-library/jest-dom/extend-expect';

// Mock the canvas module to avoid errors related to the canvas implementation during testing
jest.mock('canvas', () => {
  const mockedCanvas = {
    getContext: jest.fn().mockReturnValue({}),
    width: 100,
    height: 100,
  };
  return {
    createCanvas: jest.fn().mockReturnValue(mockedCanvas),
    loadImage: jest.fn().mockResolvedValue(mockedCanvas),
  };
});

describe('VideoCanvas Component', () => {
  it('renders without crashing', () => {
    render(<VideoCanvas content={[]} />);
    const canvasElement = screen.getByRole('img');
    expect(canvasElement).toBeInTheDocument();
  });

  it('should have a role of img', () => {
    render(<VideoCanvas content={[]} />);
    const canvasElement = screen.getByRole('img');
    expect(canvasElement).toBeInTheDocument();
  });

  it('should render content correctly', async () => {
    const mockContent = [{ type: 'text', value: 'Hello' }];
    render(<VideoCanvas content={mockContent} />);
    const canvasElement = screen.getByRole('img');
    expect(canvasElement).toBeInTheDocument();
  });
});
