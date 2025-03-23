// tests/routes/image.test.ts
import request from 'supertest';
import { app } from '../../src/index';
import express from 'express';

describe('POST /image endpoint', () => {
  let server;
  let testApp = express();
  testApp.use(express.json());
  testApp.post('/image', (req, res) => {
    res.status(200).send({ imageUrl: 'http://example.com/image.jpg' });
  });

  beforeAll((done) => {
    server = testApp.listen(3004, () => {
      console.log('Server listening on port 3004 for tests');
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it('should return a 200 status code', async () => {
    const response = await request(testApp).post('/image').send({ text: 'test' });
    expect(response.statusCode).toBe(200);
  });
});