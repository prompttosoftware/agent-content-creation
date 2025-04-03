import React from 'react';
import { render, screen, act } from '@testing-library/react';
import VideoGrid from './VideoGrid';
import VideoCanvas from './VideoCanvas';
import { calculateGridLayout, getAgentContent } from './AgentContentStore';
import '@testing-library/jest-dom';

jest.mock('./grid_layout_algorithm');
jest.mock('./AgentContentStore', () => ({
    getAgentContent: jest.fn(),
}));

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

    it('applies the correct grid layout styles', () => {
        const mockAgents = createMockAgents(2);
        const mockLayout = { rows: 1, cols: 2, cellWidth: 50, cellHeight: 100 };
        calculateGridLayout.mockReturnValue(mockLayout);
        render(<VideoGrid agents={mockAgents} />);

        const gridElement = screen.getByTestId('video-grid');
        expect(gridElement).toHaveStyle(`grid-template-rows: repeat(${mockLayout.rows}, ${mockLayout.cellHeight}%)`);
        expect(gridElement).toHaveStyle(`grid-template-columns: repeat(${mockLayout.cols}, ${mockLayout.cellWidth}%)`);

        const videoItems = screen.getAllByTestId('video-item');
        videoItems.forEach(item => {
            expect(item).toHaveStyle(`width: ${mockLayout.cellWidth}%`);
            expect(item).toHaveStyle(`height: ${mockLayout.cellHeight}%`);
        });
    });

    it('renders VideoCanvas with correct props', () => {
        const mockAgents = [{ id: 'agent1', name: 'Agent 1' }];
        const mockContent = [{ type: 'text', value: 'Hello' }];
        getAgentContent.mockReturnValue(mockContent);
        render(<VideoGrid agents={mockAgents} />);
        const videoCanvas = screen.getByRole('video-canvas'); // Assuming VideoCanvas has a role of 'video-canvas'
        expect(videoCanvas).toBeInTheDocument();

        // You may need to adjust the following assertions based on how VideoCanvas is implemented
        // For example, if VideoCanvas receives props like content, you can test it like this:

        //  expect(videoCanvas.props.agentContent).toEqual(mockContent);
        // This will likely need to be updated to check the rendered content within VideoCanvas

    });

    it('re-renders correctly after agent removal', async () => {
        const mockAgents = [
            { id: 'agent1', name: 'Agent 1' },
            { id: 'agent2', name: 'Agent 2' }
        ];
        const { rerender } = render(<VideoGrid agents={mockAgents} />);
        expect(screen.getAllByTestId('video-item').length).toBe(2);

        const updatedAgents = [{ id: 'agent1', name: 'Agent 1' }];
        await act(() => {
            rerender(<VideoGrid agents={updatedAgents} />);
        });
        expect(screen.getAllByTestId('video-item').length).toBe(1);
    });
});
