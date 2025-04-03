// src/AgentContentStore.js

const agentContent = new Map();

/**
 * Sets the content for a given agent ID.
 * @param {string} agentId The ID of the agent.
 * @param {string} content The content to store for the agent.
 */
export const setAgentContent = (agentId, content) => {
  agentContent.set(agentId, content);
};

/**
 * Retrieves the content for a given agent ID.
 * @param {string} agentId The ID of the agent.
 * @returns {string|undefined} The content for the agent, or undefined if not found.
 */
export const getAgentContent = (agentId) => {
  return agentContent.get(agentId);
};

/**
 * Removes the content for a given agent ID.
 * @param {string} agentId The ID of the agent.
 */
export const removeAgentContent = (agentId) => {
    agentContent.delete(agentId);
}
