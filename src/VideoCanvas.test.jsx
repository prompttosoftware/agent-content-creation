import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VideoCanvas from './VideoCanvas';

// Mock the canvas and its context
jest.mock('canvas', () => {
    const mockCanvas = {
        getContext: jest.fn(() => ({
            clearRect: jest.fn(),
            drawImage: jest.fn()
        }))
    };
    return {
        createCanvas: jest.fn(() => mockCanvas),
        ...jest.requireActual('canvas'), // Keep other canvas functionalities
    };
});

describe('VideoCanvas component', () => {
  it('renders without crashing', () => {
    render(<VideoCanvas videoWidth={640} videoHeight={480} agentContent={[]} />);
    // You can add more specific assertions here if needed,
    // e.g., checking for the existence of a canvas element.
    const canvasElement = screen.getByRole('img'); // Or another suitable role or selector
    expect(canvasElement).toBeInTheDocument();
  });
});