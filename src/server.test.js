const request = require('supertest');
const app = require('../server'); // Assuming server.js exports the Express app

describe('API Endpoints', () => {
  it('GET /api/hello should return a message', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Hello from the API!');
  });

  it('POST /agent/update should return success', async () => {
      const res = await request(app)
          .post('/agent/update')
          .send({ content: 'test content' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
  });

  it('POST /agent/update with missing content should return 400', async () => {
    const res = await request(app)
        .post('/agent/update')
        .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Content is required');
  });

  it('POST /agent/update with invalid content type should return 400', async () => {
    const res = await request(app)
        .post('/agent/update')
        .send({ content: 123 });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Content must be a string');
  });

  it('POST /agent/done should return success', async () => {
      const res = await request(app)
          .post('/agent/done');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
  });

  afterEach(async () => {
    // Close the server after each test to prevent EADDRINUSE errors
    if (app.close) {
      await new Promise(resolve => app.close(resolve));
    }
  });
});