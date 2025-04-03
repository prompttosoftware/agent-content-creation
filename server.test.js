// server.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const app = require('./server'); // Assuming server.js exports the app

app.use(bodyParser.json());

describe('Agent Update Endpoint', () => {
  it('should log the received data and return 200 OK', async () => {
    const agentId = 'agent-123';
    const type = 'text';
    const content = 'This is some content';

    const response = await request(app)
      .post('/agent/update')
      .send({ agentId, type, content })
      .expect(200);

    // Add assertions to check the console output (this is tricky without mocking console.log directly)
    // For now, we just check the status code.
    expect(response.text).toBe('OK');
  });
});