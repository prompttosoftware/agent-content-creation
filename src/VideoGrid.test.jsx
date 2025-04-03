import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoGrid from './VideoGrid';
import AgentOverlay from './AgentOverlay';
import '@testing-library/jest-dom';

// Mock AgentOverlay to prevent it from rendering actual content
jest.mock('./AgentOverlay', () => {
  return jest.fn(() => <div data-testid="mock-agent-overlay"></div>);
});

describe('VideoGrid Component', () => {

  it('renders AgentOverlay component with agent data for each agent', () => {
    const mockAgents = [
      { id: 1, name: 'Agent 1', agentContent: { text: 'Agent 1 Info' } },
      { id: 2, name: 'Agent 2', agentContent: { imageUrl: 'image1.jpg' } },
    ];

    render(<VideoGrid agents={mockAgents} />);

    // Assert that AgentOverlay is rendered twice (once per agent)
    expect(AgentOverlay).toHaveBeenCalledTimes(mockAgents.length);

    // Assert that AgentOverlay is called with correct agent props.
    mockAgents.forEach((agent, index) => {
      expect(AgentOverlay).toHaveBeenCalledWith(
        expect.objectContaining({ agent: agent }),
        expect.any(Object) // Added this to match the call with any other props that AgentOverlay might receive.
      );  });
  });

  it('does not render AgentOverlay when no agents are provided', () => {
    render(<VideoGrid agents={[]} />);

    // Assert that AgentOverlay is not rendered
    expect(AgentOverlay).not.toHaveBeenCalled();
  });
});