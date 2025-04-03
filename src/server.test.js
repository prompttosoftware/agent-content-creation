import request from 'supertest';
import { app, startServer, stopServer } from '../server.js';

describe('API Endpoints', () => {
  let server;
  let appInstance;

  beforeAll(async () => {
    const { server: s, app: a } = await startServer();
    server = s;
    appInstance = a;
  }, 10000);

  afterAll(async () => {
    await stopServer();
  });

  it('should respond with 200 for /api/hello', async () => {
    const response = await request(appInstance).get('/api/hello');
    expect(response.statusCode).toBe(200);
  });

  it('should respond with 200 for /agent/update', async () => {
    const response = await request(appInstance).post('/agent/update').send({ content: 'test' });
    expect(response.statusCode).toBe(200);
  });

  it('should respond with 200 for /agent/done', async () => {
    const response = await request(appInstance).post('/agent/done');
    expect(response.statusCode).toBe(200);
  });

  it('should handle invalid routes with 404', async () => {
    const response = await request(appInstance).get('/nonexistent');
    expect(response.statusCode).toBe(404);
  });
});