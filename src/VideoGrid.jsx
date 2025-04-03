import React, { useMemo, useEffect, useState } from 'react';
import './VideoGrid.css';
import VideoCanvas from './VideoCanvas';
import { calculateGridLayout } from './grid_layout_algorithm';
import { getAgentContent } from './AgentContentStore';

function VideoGrid({ agents, onAgentRemoved }) {
  const [agentContentMap, setAgentContentMap] = useState({});
  const [gridStyle, setGridStyle] = useState({
    rows: 1,
    cols: 1,
    cellWidth: 100,
    cellHeight: 100
  });
  const numberOfAgents = agents.length;
  const { rows, cols, cellWidth, cellHeight } = useMemo(() => calculateGridLayout(numberOfAgents), [numberOfAgents, gridStyle]);

  const gridStyleComputed = {
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

  useEffect(() => {
    // Recalculate layout when an agent is removed
    if (onAgentRemoved) {
      const newNumberOfAgents = agents.length;
      const newLayout = calculateGridLayout(newNumberOfAgents);
      setGridStyle({
        rows: newLayout.rows,
        cols: newLayout.cols,
        cellWidth: newLayout.cellWidth,
        cellHeight: newLayout.cellHeight
      });
    }
  }, [agents, onAgentRemoved, gridStyle]);

  return (
    <div className="video-grid" style={gridStyleComputed}>
      {agents.map((agent, index) => {
        const agentContent = agentContentMap[agent.id];
        return (
          <div key={agent.id} className="video-item" style={{
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