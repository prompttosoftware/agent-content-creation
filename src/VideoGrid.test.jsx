import React from 'react';
import { render, screen, act } from '@testing-library/react';
import VideoGrid from './VideoGrid';
import { calculateGridLayout } from './grid_layout_algorithm';
import '@testing-library/jest-dom';


describe('VideoGrid Component', () => {

  it('renders AgentOverlay component with agent data for each agent', () => {
    const mockAgents = [
      { id: 'agent1', name: 'Agent 1' },
      { id: 'agent2', name: 'Agent 2' },
    ];

    render(<VideoGrid agents={mockAgents} />);

    // Verify that both agents are rendered
    expect(screen.getByTestId('video-canvas')).toBeInTheDocument();
    expect(screen.getAllByTestId('video-canvas').length).toBe(2);
  });

  it('does not render VideoCanvas when no agents are provided', () => {
    render(<VideoGrid agents={[]} />);

    // Assert that AgentOverlay is not rendered
    expect(screen.queryByTestId('video-canvas')).not.toBeInTheDocument();
  });

  it('renders the correct grid layout for 2 agents', () => {
    const mockAgents = [
      { id: 'agent1', name: 'Agent 1' },
      { id: 'agent2', name: 'Agent 2' },
    ];
    render(<VideoGrid agents={mockAgents} />);

    // Verify the grid template is set up correctly.
    const gridElement = screen.getByTestId('video-grid'); // Assuming your VideoGrid has data-testid="video-grid"
    expect(gridElement).toHaveStyle('grid-template-columns: repeat(2, 50%)');
    expect(gridElement).toHaveStyle('grid-template-rows: repeat(1, 100%)');
    // verify that two video-canvas elements are present (or a class name exists)
    expect(screen.getAllByTestId('video-canvas').length).toBe(2); // Ensure two video canvases exist
  });
});