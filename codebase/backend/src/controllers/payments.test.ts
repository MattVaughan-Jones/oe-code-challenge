import { Request, Response } from 'express'
import { processPayment, getPaymentsByAccount } from './payments'
import { savePayment, getPaymentsByAccount as getPayments } from '../clients/paymentClient'
import { v4 } from 'uuid'

jest.mock('../clients/paymentClient')
jest.mock('uuid')

describe('Payment Controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  const mockV4 = v4 as jest.MockedFunction<typeof v4>

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    }
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    }
    jest.clearAllMocks()
  })

  describe('processPayment', () => {
    const validPaymentData = {
      accountId: 'test-account',
      amount: '100.00',
      cardNumber: '4242424242424242',
      expiry: '12/25',
      cvv: '123',
    }

    beforeEach(() => {
      mockRequest.body = validPaymentData
    })

    it('should process valid payment successfully', async () => {
      mockV4.mockReturnValue('test-uuid' as unknown as Uint8Array<ArrayBufferLike>)

      await processPayment(mockRequest as Request, mockResponse as Response)

      expect(savePayment).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-uuid',
          accountId: 'test-account',
          amount: 100.0,
        })
      )
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Payment processed successfully',
      })
    })

    it('should return 400 for validation error', async () => {
      mockRequest.body = { ...validPaymentData, accountId: '' }

      await processPayment(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Account ID is required',
      })
    })

    it('should return 500 when saving payment fails', async () => {
      ;(savePayment as jest.Mock).mockRejectedValue(new Error('Database error'))

      await processPayment(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Payment processing failed',
      })
    })
  })

  describe('getPaymentsByAccount', () => {
    beforeEach(() => {
      mockRequest.params = { accountId: 'test-account' }
    })

    it('should return payments for valid account', async () => {
      const mockPayments = [{ id: 'payment-1', amount: 100 }]
      ;(getPayments as jest.Mock).mockResolvedValue(mockPayments)

      await getPaymentsByAccount(mockRequest as Request, mockResponse as Response)

      expect(getPayments).toHaveBeenCalledWith('test-account')
      expect(mockResponse.json).toHaveBeenCalledWith(mockPayments)
    })

    it('should return 500 when fetching payments fails', async () => {
      ;(getPayments as jest.Mock).mockRejectedValue(new Error('Database error'))

      await getPaymentsByAccount(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to fetch payment history',
      })
    })
  })
})
