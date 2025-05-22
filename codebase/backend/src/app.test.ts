import request from 'supertest'
import app from './app'

jest.mock('./clients/paymentClient', () => ({
  getPaymentsByAccount: jest.fn().mockResolvedValue([]),
}))

jest.mock('./mockAPIs/energyAccountsAPIMock', () => ({
  MOCK_ENERGY_ACCOUNTS_API: jest.fn().mockResolvedValue([]),
}))

jest.mock('./mockAPIs/dueChargesAPIMock', () => ({
  MOCK_DUE_CHARGES_API: jest.fn().mockResolvedValue([]),
}))

describe('Express App', () => {
  describe('Health Check', () => {
    it('GET /health returns 200 and ok status', async () => {
      const response = await request(app).get('/health').expect(200)

      expect(response.body).toEqual({ status: 'ok' })
    })
  })

  describe('Security Headers', () => {
    it('includes Helmet security headers', async () => {
      const response = await request(app).get('/health')

      expect(response.headers['x-dns-prefetch-control']).toBe('off')
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN')
      expect(response.headers['x-content-type-options']).toBe('nosniff')
    })
  })

  describe('CORS', () => {
    it('allows CORS requests', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000')
        .expect(200)

      expect(response.headers['access-control-allow-origin']).toBe('*')
    })
  })

  describe('JSON Parsing', () => {
    it('rejects unsupported media types with 415', async () => {
      const testData = 'raw text data'
      const response = await request(app)
        .post('/api/payments')
        .send(testData)
        .set('Content-Type', 'text/plain')
        .expect(415)

      expect(response.body).toEqual({
        error: 'Unsupported Media Type',
        message: 'Content-Type must be application/json',
      })
    })

    it('parses JSON request bodies', async () => {
      const testData = { test: 'data' }
      const response = await request(app)
        .post('/api/payments')
        .send(testData)
        .set('Content-Type', 'application/json')

      expect(response.status).not.toBe(415)
    })
  })

  describe('API Routes', () => {
    it('mounts the accounts router at /api/accounts', async () => {
      const response = await request(app).get('/api/accounts')
      expect(response.status).toBe(200)
    })

    it('mounts the payments router at /api/payments', async () => {
      const response = await request(app).get('/api/payments/test-account')
      expect(response.status).toBe(404)
    })
  })

  describe('Error Handling', () => {
    it('returns 404 for unknown routes', async () => {
      await request(app).get('/non-existent-route').expect(404)
    })
  })
})
