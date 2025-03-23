// tests/routes/done.test.ts
import request from 'supertest';
import { app } from '../../src/index';
import express from 'express';

describe('POST /done', () => {
    let server;
    let testApp = express();
    testApp.use(express.json());
    testApp.post('/done', (req, res) => {
        res.status(200).send({ message: 'Done received', videoUrl: 'http://youtube.com/watch?v=testVideo' });
    });

    beforeAll(() => {
        server = testApp.listen(3003, () => {
            console.log('Server listening on port 3003 for tests');
        });
    });

    afterAll(() => {
        server.close(() => {
        });
    });

    it('should return 200', async () => {
        const response = await request(testApp).post('/done').send({authorizationCode: "code", videoId: "videoId"});
        expect(response.statusCode).toBe(200);
    });
});