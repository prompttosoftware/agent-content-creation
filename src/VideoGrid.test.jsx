import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoGrid from './VideoGrid';
import { calculateGridLayout } from './grid_layout_algorithm';

// Mock the calculateGridLayout function
jest.mock('./grid_layout_algorithm', () => ({
  calculateGridLayout: jest.fn(),
}));

describe('VideoGrid Component', () => {
  it('renders without crashing', () => {
    render(<VideoGrid agents={[]} containerWidth={100} containerHeight={100} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('calls calculateGridLayout with the correct parameters', async () => {
    const agents = [{ id: 1 }, { id: 2 }];
    const containerWidth = 200;
    const containerHeight = 100;
    const mockLayout = { rows: 1, cols: 2, cellWidth: 1, cellHeight: 1 };
    calculateGridLayout.mockReturnValue(mockLayout);

    render(<VideoGrid agents={agents} containerWidth={containerWidth} containerHeight={containerHeight} />);

    await waitFor(() => {
      expect(calculateGridLayout).toHaveBeenCalledWith(agents.length, containerWidth / containerHeight);
    });
  });

  it('renders video items based on the agents prop', () => {
    const agents = [{ id: 1 }, { id: 2 }];
    render(<VideoGrid agents={agents} containerWidth={200} containerHeight={100} />);
    expect(screen.getByText('Agent ID: 1')).toBeInTheDocument();
    expect(screen.getByText('Agent ID: 2')).toBeInTheDocument();
  });

  it('applies grid layout styles correctly when layout is available', async () => {
    const agents = [{ id: 1 }, { id: 2 }];
    const containerWidth = 200;
    const containerHeight = 100;
    const mockLayout = { rows: 1, cols: 2, cellWidth: 1, cellHeight: 1 };
    calculateGridLayout.mockReturnValue(mockLayout);

    render(<VideoGrid agents={agents} containerWidth={containerWidth} containerHeight={containerHeight} />);

    await waitFor(() => {
      const gridElement = screen.getByRole('grid');
      expect(gridElement).toHaveStyle('grid-template-columns: repeat(2, 50%)');
      expect(gridElement).toHaveStyle('grid-template-rows: repeat(1, 100%)');
    });
  });

  it('renders an empty grid when no agents are provided', () => {
    render(<VideoGrid agents={[]} containerWidth={100} containerHeight={100} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
});
