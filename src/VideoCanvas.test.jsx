import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoCanvas from './VideoCanvas';
//import '@testing-library/jest-dom/extend-expect';

// Mock the canvas module to avoid errors related to the canvas implementation during testing
jest.mock('canvas', () => {
  return {
    getContext: () => ({}),
    width: 100,
    height: 100,
  };
});

describe('VideoCanvas component', () => {
  it('renders without crashing', () => {
    render(<VideoCanvas />);
    expect(screen.getByRole('canvas')).toBeInTheDocument();
  });
});