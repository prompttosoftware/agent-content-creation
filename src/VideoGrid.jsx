import React, { useState, useEffect } from 'react';
import './VideoGrid.css';
import { calculateGridLayout } from './grid_layout_algorithm';

function VideoGrid({ agents, containerWidth, containerHeight }) {
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    if (agents && containerWidth && containerHeight) {
      const numAgents = agents.length;
      const targetAspectRatio = containerWidth / containerHeight;
      const newLayout = calculateGridLayout(numAgents, targetAspectRatio);
      setLayout(newLayout);
    }
  }, [agents, containerWidth, containerHeight]);

  if (!layout || !agents || agents.length === 0) {
    return <div className="video-grid" role="grid"></div>;
  }

  const { rows, cols, cellWidth, cellHeight } = layout;

  return (
    <div className="video-grid" role="grid" style={{
      gridTemplateColumns: `repeat(${cols}, ${100 / cols}%)`,
      gridTemplateRows: `repeat(${rows}, ${100 / rows}%)`,
      height: '100%',
      width: '100%',
    }}>
      {agents.map((agent, index) => {
        return (
          <div key={agent.id} className="video-item" style={{
            //gridColumn: `${(index % cols) + 1}`, // Example, not needed now
            //gridRow: `${Math.floor(index / cols) + 1}`, // Example, not needed now
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Placeholder for video or content */}
            <p>Agent ID: {agent.id}</p>
          </div>
        );
      })}
    </div>
  );
}

export default VideoGrid;
