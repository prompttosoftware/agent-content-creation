import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoGrid from './VideoGrid';
import '@testing-library/jest-dom';

describe('VideoGrid Component', () => {

    const createMockAgents = (count) => {
        return Array.from({ length: count }, (_, i) => ({ id: `agent${i + 1}`, name: `Agent ${i + 1}` }));
    };

    it('renders the correct number of video elements for 1 agent', () => {
        const mockAgents = createMockAgents(1);
        render(<VideoGrid agents={mockAgents} />);
        expect(screen.getAllByTestId('video-item').length).toBe(1);
    });

    it('renders the correct number of video elements for 2 agents', () => {
        const mockAgents = createMockAgents(2);
        render(<VideoGrid agents={mockAgents} />);
        expect(screen.getAllByTestId('video-item').length).toBe(2);
    });

    it('renders the correct number of video elements for 3 agents', () => {
        const mockAgents = createMockAgents(3);
        render(<VideoGrid agents={mockAgents} />);
        expect(screen.getAllByTestId('video-item').length).toBe(3);
    });

    it('renders the correct number of video elements for 4 agents', () => {
        const mockAgents = createMockAgents(4);
        render(<VideoGrid agents={mockAgents} />);
        expect(screen.getAllByTestId('video-item').length).toBe(4);
    });

    it('renders the correct number of video elements for 5 agents', () => {
        const mockAgents = createMockAgents(5);
        render(<VideoGrid agents={mockAgents} />);
        expect(screen.getAllByTestId('video-item').length).toBe(5);
    });

    it('renders the correct number of video elements for 6 agents', () => {
        const mockAgents = createMockAgents(6);
        render(<VideoGrid agents={mockAgents} />);
        expect(screen.getAllByTestId('video-item').length).toBe(6);
    });

    it('renders the correct number of video elements for 7 agents', () => {
        const mockAgents = createMockAgents(7);
        render(<VideoGrid agents={mockAgents} />);
        expect(screen.getAllByTestId('video-item').length).toBe(7);
    });

    it('renders the correct number of video elements for 0 agents', () => {
        const mockAgents = createMockAgents(0);
        render(<VideoGrid agents={mockAgents} />);
        expect(screen.queryAllByTestId('video-item').length).toBe(0);
    });
});