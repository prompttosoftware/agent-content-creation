// src/App.js
import React, { useState, useEffect } from 'react';
import VideoGrid from './VideoGrid';

function App() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching agents (replace with actual API call)
    const fetchAgents = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      const mockAgents = [
        { id: 'agent1', name: 'Agent One' },
        { id: 'agent2', name: 'Agent Two' },
      ];
      setAgents(mockAgents);
      setLoading(false);
    };

    fetchAgents();
  }, []);

  const removeAgent = (agentId) => {
    setAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div data-testid="app-container">
      <VideoGrid agents={agents} removeAgent={removeAgent} />
    </div>
  );
}

export default App;
