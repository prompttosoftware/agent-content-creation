// AgentContentStorage.test.js
import AgentContentStorage from './AgentContentStorage';

describe('AgentContentStorage', () => {
  let storage;

  beforeEach(() => {
    storage = new AgentContentStorage();
  });

  it('should initialize with an empty storage', () => {
    expect(storage.size()).toBe(0);
  });

  describe('setContent', () => {
    it('should set content for an agent', () => {
      storage.setContent('agent1', 'content1');
      expect(storage.size()).toBe(1);
    });

    it('should overwrite existing content for an agent', () => {
      storage.setContent('agent1', 'content1');
      storage.setContent('agent1', 'content2');
      expect(storage.getContent('agent1')).toBe('content2');
      expect(storage.size()).toBe(1);
    });

    it('should throw an error if agentId is not a string', () => {
      expect(() => storage.setContent(123, 'content1')).toThrow('agentId must be a string.');
    });

    it('should throw an error if content is not a string', () => {
      expect(() => storage.setContent('agent1', 123)).toThrow('content must be a string.');
    });
  });

  describe('getContent', () => {
    it('should return content for an existing agent', () => {
      storage.setContent('agent1', 'content1');
      expect(storage.getContent('agent1')).toBe('content1');
    });

    it('should return undefined for a non-existent agent', () => {
      expect(storage.getContent('agent2')).toBeUndefined();
    });

    it('should throw an error if agentId is not a string', () => {
      expect(() => storage.getContent(123)).toThrow('agentId must be a string.');
    });
  });

  describe('deleteContent', () => {
    it('should delete content for an existing agent', () => {
      storage.setContent('agent1', 'content1');
      const result = storage.deleteContent('agent1');
      expect(result).toBe(true);
      expect(storage.getContent('agent1')).toBeUndefined();
      expect(storage.size()).toBe(0);
    });

    it('should return false if deleting content for a non-existent agent', () => {
      const result = storage.deleteContent('agent2');
      expect(result).toBe(false);
      expect(storage.size()).toBe(0);
    });

    it('should throw an error if agentId is not a string', () => {
      expect(() => storage.deleteContent(123)).toThrow('agentId must be a string.');
    });
  });

  describe('size', () => {
    it('should return the correct size of the storage', () => {
      storage.setContent('agent1', 'content1');
      storage.setContent('agent2', 'content2');
      expect(storage.size()).toBe(2);
    });
  });
});