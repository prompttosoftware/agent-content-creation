import React from 'react';
import './VideoGrid.css';

function VideoGrid({ agents }) {
  return (
    <div className="video-grid">
      {agents.map((agent) => (
        <div key={agent.id} className="video-item">
          {/* Placeholder for video or content */}
          <p>Agent ID: {agent.id}</p>
        </div>
      ))}
    </div>
  );
}

export default VideoGrid;
