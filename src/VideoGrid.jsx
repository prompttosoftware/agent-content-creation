import React from 'react';
import './VideoGrid.css';
import AgentOverlay from './AgentOverlay';

function VideoGrid({ agents }) {
  return (
    <div className="video-grid">
      {agents.map((agent, index) => (
        <div key={index} className="video-item">
          {/* Placeholder for video stream or canvas */}
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
