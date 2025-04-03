const request = require('supertest');
const { app, startServer, stopServer } = require('../server');

describe('API Endpoints', () => {
  let server;

  beforeAll(async () => {
    server = await startServer();
  }, 10000);

  afterAll(async () => {
    await stopServer();
  }, 10000);

  it('GET /api/hello should return a message', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
  }, 10000);

  it('POST /agent/update should return success with valid content', async () => {
    const res = await request(app).post('/agent/update').send({ content: 'test content' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  }, 10000);

  it('POST /agent/update should return 400 if content is missing', async () => {
    const res = await request(app).post('/agent/update').send({});
    expect(res.statusCode).toEqual(400);
  }, 10000);

  it('POST /agent/update should return 400 if content is not a string', async () => {
    const res = await request(app).post('/agent/update').send({ content: 123 });
    expect(res.statusCode).toEqual(400);
  }, 10000);

    it('POST /agent/update should return 400 if content is an empty string', async () => {
        const res = await request(app).post('/agent/update').send({ content: '' });
        expect(res.statusCode).toEqual(400);
    }, 10000);

  it('POST /agent/done should return success', async () => {
    const res = await request(app).post('/agent/done');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  }, 10000);

    it('POST /agent/update should return 500 on server error', async () => {
        // Mock the agentContentStorage to throw an error
        jest.mock('../AgentContentStorage', () => ({
            updateContent: jest.fn().mockRejectedValue(new Error('Simulated server error')),
        }));
        const res = await request(app).post('/agent/update').send({ content: 'test content' });
        expect(res.statusCode).toEqual(500);
    }, 15000);

});
