// tests/routes/done.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { doneHandler } from '../../src/routes/done';
import { generateVideo } from '../../src/video/videoGenerator';

const app = express();
app.use(express.json());

vi.mock('../../src/video/videoGenerator', () => {
  return {
    generateVideo: vi.fn()
  };
});

describe('POST /done endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (generateVideo as any).mockClear();
  });

  it('should return a 200 status code and video URL on success', async () => {
    (generateVideo as any).mockResolvedValue('mocked_video_url');
    app.post('/done', doneHandler);
    const response = await request(app)
      .post('/done')
      .send({ agentCount: 5, containerWidth: 640, containerHeight: 480, text: 'test' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ video: 'mocked_video_url' });
    expect(generateVideo).toHaveBeenCalledWith(5, 640, 480, 'test');
  });

  it('should return a 400 status code if agentCount is invalid', async () => {
    app.post('/done', doneHandler);
    const response = await request(app)
      .post('/done')
      .send({ agentCount: 'abc', containerWidth: 640, containerHeight: 480, text: 'test' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid parameters' });
    expect(generateVideo).not.toHaveBeenCalled();
  });

  it('should return a 400 status code if containerWidth is invalid', async () => {
    app.post('/done', doneHandler);
    const response = await request(app)
      .post('/done')
      .send({ agentCount: 5, containerWidth: 'abc', containerHeight: 480, text: 'test' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid parameters' });
    expect(generateVideo).not.toHaveBeenCalled();
  });

  it('should return a 400 status code if containerHeight is invalid', async () => {
    app.post('/done', doneHandler);
    const response = await request(app)
      .post('/done')
      .send({ agentCount: 5, containerWidth: 640, containerHeight: 'abc', text: 'test' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid parameters' });
    expect(generateVideo).not.toHaveBeenCalled();
  });

  it('should return a 400 status code if text is invalid', async () => {
    app.post('/done', doneHandler);
    const response = await request(app)
      .post('/done')
      .send({ agentCount: 5, containerWidth: 640, containerHeight: 480, text: 123 });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid parameters' });
    expect(generateVideo).not.toHaveBeenCalled();
  });

  it('should return a 500 status code on internal server error', async () => {
    (generateVideo as any).mockRejectedValue(new Error('Test error'));
    app.post('/done', doneHandler);
    const response = await request(app)
      .post('/done')
      .send({ agentCount: 5, containerWidth: 640, containerHeight: 480, text: 'test' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Test error' });
    expect(generateVideo).toHaveBeenCalled();
  });
});