import request from 'supertest'
import app from '../src/server.js'

describe('404 Not Found', () => {
  
  test('should return 404 for GET /unknown', async () => {
    const response = await request(app)
                              .get('/unknown')
                              .expect(404);

    expect(response.body).toEqual({ error: 'Not found' })
  })

  test('should return 404 for POST /unknown', async () => {
    const response = await request(app)
                              .post('/unknown')
                              .send({test: 'data'})
                              .expect(404)

    expect(response.body).toHaveProperty('error', 'Not found')
  })

  test ('should return 404 for POST /status', async () => {
    const response = await request(app)
                            .post('/status')
                            .send({test: 'data'})
                            .expect(404)

    expect(response.body).toHaveProperty('error', 'Not found')
  })
})
