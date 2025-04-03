const request = require('supertest');
const { app, startServer, stopServer } = require('../server');
const findFreePort = require('find-free-port');

describe('API Endpoints', () => {
  let server;
  let port; // Store the port the server is running on.

  beforeAll(async () => {
    // Find a free port
    [port] = await findFreePort(3000, 3010); // Search for a free port between 3000 and 3010
    // Start the server on the free port
    server = await startServer(port);
  });

  afterAll(async () => {
    await stopServer(server);
  });

  it('should return 200 OK for GET /', async () => {
    const response = await request(app)
      .get('/')
      .timeout(5000); // Increased timeout to 5 seconds
    expect(response.statusCode).toBe(200);
  });

  it('should return 200 OK for GET /api/hello', async () => {
    const response = await request(app)
      .get('/api/hello')
      .timeout(5000); // Increased timeout to 5 seconds
    expect(response.statusCode).toBe(200);
  });

  it('should return 200 OK for POST /agent/update with valid content', async () => {
    const response = await request(app)
      .post('/agent/update')
      .send({ content: 'test content' })
      .timeout(5000); // Increased timeout to 5 seconds
    expect(response.statusCode).toBe(200);
  });

  it('should return 400 Bad Request for POST /agent/update without content', async () => {
    const response = await request(app)
      .post('/agent/update')
      .send({})
      .timeout(5000); // Increased timeout to 5 seconds
    expect(response.statusCode).toBe(400);
  });

  it('should return 200 OK for POST /agent/done', async () => {
    const response = await request(app)
        .post('/agent/done')
        .timeout(5000); // Increased timeout to 5 seconds
    expect(response.statusCode).toBe(200);
  });


  // Add more tests for different endpoints and edge cases here
});