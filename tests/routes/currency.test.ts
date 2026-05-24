import request from 'supertest'
import app from '../../src/server.js'
import dotenv from 'dotenv'
import { type CreateCurrencyResponse, DeleteCurrencyResponse, GetCurrencyResponse, UpdateCurrencyResponse } from '../../src/types/currency.js'
import { type ErrorResponse } from '../../src/types/error.js'
import { generateExpiredToken, generateValidToken } from '../helpers/tokenHelpers.js'

dotenv.config({
  quiet: true
})

let VALID_TOKEN: string
let EXPIRED_TOKEN: string
const testUser = { userId: 1, username: 'TestUser', role: 'TestUser' }

beforeAll(() => {
  VALID_TOKEN = generateValidToken(testUser)
  EXPIRED_TOKEN = generateExpiredToken(testUser)
})

describe('Currency API', () => {
  describe('GET /currency', () => {
    test('Gets a list of currencies if the VALID_TOKEN is valid', async () => {
      const response = await request(app)
        .get('/currency')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .expect(200)

      expect(response.body).toHaveProperty('currencies')
      expect(response.body).toHaveProperty('count')
    })

    test('401 error when leaving a VALID_TOKEN', async () => {
      await request(app)
        .get('/currency')
        .expect(401)
    })

    test('401 error due to invalid header format', async () => {
      await request(app)
        .get('/currency')
        .set('Authorization', `Bearara ${VALID_TOKEN}`)
        .expect(401)
    })

    test('403 error for invalid VALID_TOKEN', async () => {
      await request(app)
        .get('/currency')
        .set('Authorization', `Bearer invalid_token`)
        .expect(403)
    })
    test('403 error for expired token', async () => {
      await request(app)
        .get('/currency')
        .set('Authorization', `Bearer ${EXPIRED_TOKEN}`)
        .expect(403)
    })
  })

  describe('GET /currency:id', () => {
    test('Returns currency by id', async () => {
      const createRes = await request(app)
        .post('/currency')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send({ name: 'Bitcoin', ticker: 'BTC' })

      const created = createRes.body as CreateCurrencyResponse
      const currencyId = created.currency.id

      const response = await request(app)
        .get(`/currency/${currencyId}`)
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .expect(200)

      const body = response.body as GetCurrencyResponse

      expect(body.currency.id).toBe(currencyId)
      expect(body.currency.name).toBe('Bitcoin')
      expect(body.currency.ticker).toBe('BTC')
    })

    test('404 error for non-existent id', async () => {
      const response = await request(app)
        .get(`/currency/${404}`)
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .expect(404)

      const body = response.body as ErrorResponse
      expect(body.error).toBe('Not Found')
      expect(body.message).toBe('Currency not found')
    })
  })

  describe('POST /currency', () => {
    test('creates a currency with valid data', async () => {
      const response = await request(app)
        .post('/currency')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send({ name: 'Ethereum', ticker: 'ETH' })
        .expect(201)

      const body = response.body as CreateCurrencyResponse

      expect(body.currency.name).toBe('Ethereum')
      expect(body.currency.ticker).toBe('ETH')
    })

    test('400 Error: Data format is invalid', async () => {
      await request(app)
        .post('/currency')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send({ test: 'Ethereum', test2: 'ETH' })
        .expect(400)
    })

    test('400 error:  When data is missing', async () => {
      await request(app)
        .post('/currency')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .expect(400)
    })
  })

  describe('PUT /currency/:id', () => {
    test('should update existing currency', async () => {
      const created = await request(app)
        .post('/currency')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send({ name: 'Cardano', ticker: 'ADA' })

      const createdBody = created.body as CreateCurrencyResponse
      const currentId = createdBody.currency.id

      const response = await request(app)
        .put(`/currency/${currentId}`)
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send({ ticker: 'New ticker' })
        .expect(200)

      const responseBody = response.body as UpdateCurrencyResponse
      expect(responseBody.currency.id).toBe(currentId)
      expect(responseBody.currency.name).toBe('Cardano')
      expect(responseBody.currency.ticker).toBe('New ticker'.toUpperCase())
    })

    test('404 Error: no such entry exists', async () => {
      await request(app)
        .put('/currency/-10')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send({ ticker: 'New ticker' })
        .expect(404)
    })
  })

  describe('DELETE /currency/:id', () => {
    test('The entry exists and was successfully deleted', async () => {
      const created = await request(app)
        .post('/currency')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send({ name: 'Ripple', ticker: 'XRP' })

      const createdBody = created.body as CreateCurrencyResponse
      const currentId = createdBody.currency.id

      const response = await request(app)
        .delete(`/currency/${currentId}`)
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .expect(200)

      const responseBody = response.body as DeleteCurrencyResponse

      expect(responseBody.message).toBe('Currency removed')
    })

    test('404 Error: no such entry exists', async () => {
      await request(app)
        .delete('/currency/-10')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .send({ ticker: 'New ticker' })
        .expect(404)
    })
  })
})
