import React, { useMemo, useEffect, useState } from 'react';
import './VideoGrid.css';
import VideoCanvas from './VideoCanvas';
import { calculateGridLayout } from './grid_layout_algorithm';
import { getAgentContent } from './AgentContentStore';

function VideoGrid({ agents }) {
  const [agentContentMap, setAgentContentMap] = useState({});
  const numberOfAgents = agents.length;
  const { rows, cols, cellWidth, cellHeight } = useMemo(() => calculateGridLayout(numberOfAgents), [numberOfAgents]);

  const gridStyle = {
    display: 'grid',
    gridTemplateRows: `repeat(${rows}, ${cellHeight}%)`,
    gridTemplateColumns: `repeat(${cols}, ${cellWidth}%)`,
    width: '100%', // Ensure the grid takes the full width of its container
    height: '100%', // Ensure the grid takes the full height of its container
  };

  // Update agent content map when agents prop changes
  useEffect(() => {
    const newAgentContentMap = {};
    agents.forEach((agent) => {
      const content = getAgentContent(agent.id);
      newAgentContentMap[agent.id] = Array.isArray(content) ? content : [content];
    });
    setAgentContentMap(newAgentContentMap);
  }, [agents]);

  return (
    <div className="video-grid" style={gridStyle}>
      {agents.map((agent, index) => {
        const agentContent = agentContentMap[agent.id];
        return (
          <div key={index} className="video-item" style={{
            width: `${cellWidth}%`,
            height: `${cellHeight}%`
          }}>
            <VideoCanvas
              videoWidth={cellWidth * 1920 / 100}
              videoHeight={cellHeight * 1080 / 100}
              agentContent={agentContent}
            />
          </div>
        );
      })}
    </div>
  );
}

export default VideoGrid;