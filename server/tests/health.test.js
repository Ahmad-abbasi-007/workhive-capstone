const request = require('supertest');
const app = require('../app');

describe('Health check', () => {
  test('reports the API as healthy', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
