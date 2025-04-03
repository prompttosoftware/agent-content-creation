// src/server.test.js
import request from 'supertest';
import { app, server } from './server'; // Assuming you export app and server
import { setAgentContent, getAgentContent, removeAgentContent } from './AgentContentStore';
import { calculateGridLayout } from './grid_layout_algorithm';
import chai from 'chai';
const expect = chai.expect;

describe('Agent Endpoints', () => {
  afterEach((done) => {
    // Clean up after each test: clear agent content and close the server.
    for (const key of Object.keys(global.agentContent)) {
      removeAgentContent(key);
    }
    server.close(done); // Close the server after each test
  });

  it('should handle multiple agent updates and a "done" signal correctly', async () => {
    const agent1Id = 'agent1';
    const agent2Id = 'agent2';
    const agent1Content = 'frame1,frame2';
    const agent2Content = 'frame3,frame4';

    // 1. Send updates for multiple agents
    await request(app)
      .post('/agent/update')
      .send({ agentId: agent1Id, content: agent1Content })
      .expect(200);

    await request(app)
      .post('/agent/update')
      .send({ agentId: agent2Id, content: agent2Content })
      .expect(200);

    // Verify content stored
    expect(getAgentContent(agent1Id)).to.equal(agent1Content);
    expect(getAgentContent(agent2Id)).to.equal(agent2Content);

    // Verify grid layout calculation for 2 agents (initial state)
    let layout = calculateGridLayout(2);
    expect(layout.rows).to.equal(1);
    expect(layout.cols).to.equal(2);


    // 2. Send 'done' signal for agent1
    await request(app)
      .post('/agent/done')
      .send({ agentId: agent1Id })
      .expect(200);

    // Verify agent1's content is removed
    expect(getAgentContent(agent1Id)).to.be.undefined;

    // Verify the grid layout adjusts for one remaining agent
    layout = calculateGridLayout(1);
    expect(layout.rows).to.equal(1);
    expect(layout.cols).to.equal(1);

    // Verify agent2's content is still present.
    expect(getAgentContent(agent2Id)).to.equal(agent2Content);
  });

  it('should remove an agent when the "done" endpoint is called', async () => {
    const agentId = 'agent3';
    const agentContent = 'some content';

    // Set up initial state
    setAgentContent(agentId, agentContent);

    // Send the 'done' signal
    await request(app)
      .post('/agent/done')
      .send({ agentId: agentId })
      .expect(200);

    // Verify the agent's content is removed.
    expect(getAgentContent(agentId)).to.be.undefined;
  });

  it('should handle "done" correctly when no content exists for the agent', async () => {
    const agentId = 'nonexistentAgent';

    // Send the 'done' signal for an agent that doesn't exist
    await request(app)
      .post('/agent/done')
      .send({ agentId: agentId })
      .expect(200);

    // Verify that nothing crashes (no content to remove, so it should be a no-op).  Crucially, it shouldn't error.
    expect(getAgentContent(agentId)).to.be.undefined;  // Still undefined, but no error.
  });

  it('should adjust grid layout when multiple agents are removed', async () => {
    const agent1Id = 'agent4';
    const agent2Id = 'agent5';
    const agent3Id = 'agent6';
    const agent1Content = 'content4';
    const agent2Content = 'content5';
    const agent3Content = 'content6';

    // Initialize agents
    setAgentContent(agent1Id, agent1Content);
    setAgentContent(agent2Id, agent2Content);
    setAgentContent(agent3Id, agent3Content);

    // Verify initial grid layout (3 agents)
    let initialLayout = calculateGridLayout(3);
    expect(initialLayout.rows).to.equal(2);
    expect(initialLayout.cols).to.equal(2);

    // Send 'done' for agent1
    await request(app)
      .post('/agent/done')
      .send({ agentId: agent1Id })
      .expect(200);

    // Verify grid layout after removing agent1 (2 agents)
    let layoutAfterAgent1Done = calculateGridLayout(2);
    expect(layoutAfterAgent1Done.rows).to.equal(1);
    expect(layoutAfterAgent1Done.cols).to.equal(2);

    // Send 'done' for agent2
    await request(app)
      .post('/agent/done')
      .send({ agentId: agent2Id })
      .expect(200);

    // Verify grid layout after removing agent2 (1 agent)
    let layoutAfterAgent2Done = calculateGridLayout(1);
    expect(layoutAfterAgent2Done.rows).to.equal(1);
    expect(layoutAfterAgent2Done.cols).to.equal(1);

     // Send 'done' for agent3
     await request(app)
     .post('/agent/done')
     .send({ agentId: agent3Id })
     .expect(200);

    // Verify grid layout after removing agent3 (0 agent)
    let layoutAfterAgent3Done = calculateGridLayout(0);
    expect(layoutAfterAgent3Done.rows).to.equal(1);
    expect(layoutAfterAgent3Done.cols).to.equal(1);
  });

});