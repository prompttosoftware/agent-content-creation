// VideoGrid.jsx
import React from 'react';
import './VideoGrid.css';
import AgentOverlay from './AgentOverlay';

function VideoGrid({ videos, agentData }) {
  return (
    <div className="video-grid-container">
      {videos.map((video, index) => {
        const agentContent = agentData && agentData[index];

        return (
          <div key={index} className="video-item">
            <video src={video.src} controls />
            <p>{video.title}</p>
            <AgentOverlay
              videoWidth="100%" // Use percentage for dynamic sizing
              videoHeight="100%" // Use percentage for dynamic sizing
              agentContent={agentContent}
            />
          </div>
        );
      })}
    </div>
  );
}

export default VideoGrid;