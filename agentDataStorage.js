// agentDataStorage.js

const agentData = {};

function storeAgentData(agentId, data) {
  agentData[agentId] = data;
}

function getAgentData(agentId) {
  return agentData[agentId];
}

module.exports = {
  storeAgentData,
  getAgentData
};
