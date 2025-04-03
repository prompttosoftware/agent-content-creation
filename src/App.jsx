// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import VideoGrid from './VideoGrid';
import { getAgentContent, removeAgentContent } from './AgentContentStore';

function App() {
  const [agents, setAgents] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeGrid = async () => {
      // Fetch initial agent data (example - replace with actual data fetching)
      // Assuming agent data is fetched and an array of agent objects is returned
      // Each agent object should have an 'id' property.
      // Example: [{id: 'agent1', ...}, {id: 'agent2', ...}]
      // Replace this with your actual data fetching logic
      const initialAgents =  [
        { id: 'agent1' },
        { id: 'agent2' },
      ];

      setAgents(initialAgents);
      setInitialized(true);
    };

    if (!initialized) {
      initializeGrid();
    }
  }, [initialized]);

  const handleAgentRemoved = (agentId) => {
    // Handle the removal of an agent.  This should
    // remove the agent from the agents array.
      setAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentId));
      removeAgentContent(agentId);
  };

  return (
    <div className="App">
      {initialized && <VideoGrid agents={agents} onAgentRemoved={handleAgentRemoved} />}
      {!initialized && <p>Loading...</p>}
    </div>
  );
}

export default App;