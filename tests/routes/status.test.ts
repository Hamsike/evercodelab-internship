import request from 'supertest';
import app from '../../src/server';

describe('GET /status', () => {
  test('should return "ok"', async () => {
    const response = await request(app)
      .get('/status')
      .expect(200);

    expect(response.text).toBe('ok');
  });
});

