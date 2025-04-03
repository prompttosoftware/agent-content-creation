// AgentOverlay.jsx
import React from 'react';
import './AgentOverlay.css'; // Import the CSS file for styling

function AgentOverlay({ videoWidth, videoHeight, agentContent }) {
  if (!agentContent) {
    return null; // Don't render anything if there's no agent content
  }

  return (
    <div
      className="agent-overlay"
      style={{
        width: videoWidth,
        height: videoHeight,
      }}
    >
      <div className="overlay-content">
        {agentContent.text && <p className="agent-text">{agentContent.text}</p>}
        {agentContent.imageUrl && (
          <img
            src={agentContent.imageUrl}
            alt="Agent"
            className="agent-image"
          />
        )}
      </div>
    </div>
  );
}

export default AgentOverlay;