import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoGrid from './VideoGrid';

const mockAgents = [
  { id: 'agent1', name: 'Agent One' },
  { id: 'agent2', name: 'Agent Two' },
];

test('renders agent data correctly', () => {
  render(<VideoGrid agents={mockAgents} />);
  mockAgents.forEach(agent => {
    const element = screen.getByText(`Agent ID: ${agent.id}`);
    expect(element).toBeInTheDocument();
  });
});
