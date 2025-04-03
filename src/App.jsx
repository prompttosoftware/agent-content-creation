// App.jsx
import React, { useState } from 'react';
import VideoGrid from './VideoGrid';
import VideoCanvas from './VideoCanvas';

function App() {
  const [agents, setAgents] = useState([
    { id: 1, name: 'Agent 1', text: 'Hello from Agent 1', imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Agent 2', text: 'Hello from Agent 2', imageUrl: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Agent 3', text: 'Hello from Agent 3', imageUrl: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Agent 4', text: 'Hello from Agent 4', imageUrl: 'https://via.placeholder.com/150' },
  ]);

  return (
    <div className="App">
      <VideoGrid agents={agents} />
      <VideoCanvas width={640} height={480} />
    </div>
  );
}

export default App;