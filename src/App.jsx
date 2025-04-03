// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import VideoGrid from './VideoGrid';
import { getAgentContent } from './AgentContentStore';

function App() {
  const [agents, setAgents] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeGrid = async () => {
      // Fetch initial agent data
      const initialAgents = await getAgentContent();
      if (initialAgents && initialAgents.length > 0) {
        setAgents(initialAgents);
        setInitialized(true);
      }
    };

    if (!initialized) {
      initializeGrid();
    }
  }, [initialized]);

  return (
    <div className="App">
      {initialized && <VideoGrid agents={agents} />}
      {!initialized && <p>Loading...</p>}
    </div>
  );
}

export default App;
