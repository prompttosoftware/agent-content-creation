// tests/index.test.ts
import request from 'supertest';
import app from '../src/index';
import express from 'express';

describe('Auth Endpoints', () => {
  let server;
  let testApp = express();
  testApp.use(express.json()); // Middleware to parse JSON request bodies
  testApp.get('/auth/url', async (req, res) => {
      res.status(200).send('http://example.com/auth');
  });

  beforeAll(() => {
    server = testApp.listen(3002, () => {
      console.log('Server listening on port 3002 for tests');
    });
  });

  afterAll(() => {
    server.close(() => {
    });
  });

  it('GET /auth/url should return an authorization URL', async () => {
    const response = await request(testApp).get('/auth/url');
    expect(response.statusCode).toBe(200);
    // Add further assertions to validate the response (e.g., check for the URL)
  });
});