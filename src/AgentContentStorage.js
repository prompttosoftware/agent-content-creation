// AgentContentStorage.js

/**
 * Class for storing and managing agent content using a Map.
 */
class AgentContentStorage {
  /**
   * Creates a new AgentContentStorage instance.
   */
  constructor() {
    /**
     * The Map used to store agent content.
     * @private
     * @type {Map<string, string>}
     */
    this.agentContentMap = new Map();
  }

  /**
   * Sets the content for a specific agent.
   *
   * @param {string} agentId The ID of the agent.
   * @param {string} content The content to store for the agent.
   * @throws {Error} If agentId or content are not strings.
   */
  setContent(agentId, content) {
    if (typeof agentId !== 'string') {
      throw new Error('agentId must be a string.');
    }
    if (typeof content !== 'string') {
      throw new Error('content must be a string.');
    }
    this.agentContentMap.set(agentId, content);
  }

  /**
   * Gets the content for a specific agent.
   *
   * @param {string} agentId The ID of the agent.
   * @returns {string | undefined} The content for the agent, or undefined if no content is found.
   * @throws {Error} If agentId is not a string.
   */
  getContent(agentId) {
    if (typeof agentId !== 'string') {
      throw new Error('agentId must be a string.');
    }
    return this.agentContentMap.get(agentId);
  }

  /**
   * Deletes the content for a specific agent.
   *
   * @param {string} agentId The ID of the agent.
   * @returns {boolean} True if the content was deleted, false otherwise.
   * @throws {Error} If agentId is not a string.
   */
  deleteContent(agentId) {
    if (typeof agentId !== 'string') {
      throw new Error('agentId must be a string.');
    }
    return this.agentContentMap.delete(agentId);
  }

  /**
   * Returns the size of the storage (number of agent content entries).
   *
   * @returns {number} The size of the storage.
   */
  size() {
    return this.agentContentMap.size;
  }
}

export default AgentContentStorage;