import React, { useMemo } from 'react';
import './VideoGrid.css';
import AgentOverlay from './AgentOverlay';
import { calculateGridLayout } from './grid_layout_algorithm';

function VideoGrid({ agents }) {
  const numberOfAgents = agents.length;
  const { rows, cols, cellWidth, cellHeight } = useMemo(() => calculateGridLayout(numberOfAgents), [numberOfAgents]);

  const gridStyle = {
    display: 'grid',
    gridTemplateRows: `repeat(${rows}, ${cellHeight}%)`,
    gridTemplateColumns: `repeat(${cols}, ${cellWidth}%)`,
    width: '100%', // Ensure the grid takes the full width of its container
    height: '100%', // Ensure the grid takes the full height of its container
  };

  return (
    <div className="video-grid" style={gridStyle}>
      {agents.map((agent, index) => (
        <div key={index} className="video-item" style={{
          width: `${cellWidth}%`,
          height: `${cellHeight}%`
        }}>
          <div className="video-placeholder">
            Video Placeholder {index + 1}
            <AgentOverlay agent={agent} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoGrid;