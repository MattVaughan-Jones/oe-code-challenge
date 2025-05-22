import { getPaymentsByAccount, savePayment } from './paymentClient'
import { paymentRecords } from '../data/paymentStore'
import { StoredPayment } from '../models/Payment'

jest.mock('../data/paymentStore', () => ({
  paymentRecords: [],
}))

describe('paymentClient', () => {
  beforeEach(() => {
    paymentRecords.length = 0
  })

  describe('getPaymentsByAccount', () => {
    it('returns empty array when no payments exist', async () => {
      const payments = await getPaymentsByAccount('A-0001')
      expect(payments).toEqual([])
    })

    it('returns payments for specific account', async () => {
      const testPayments: StoredPayment[] = [
        {
          id: 'P-0001',
          accountId: 'A-0001',
          amount: 100,
          timestamp: '2024-03-01T10:00:00Z',
        },
        {
          id: 'P-0002',
          accountId: 'A-0002',
          amount: 200,
          timestamp: '2024-03-01T11:00:00Z',
        },
        {
          id: 'P-0003',
          accountId: 'A-0001',
          amount: 300,
          timestamp: '2024-03-01T12:00:00Z',
        },
      ]

      paymentRecords.push(...testPayments)

      const payments = await getPaymentsByAccount('A-0001')
      expect(payments).toHaveLength(2)
      expect(payments).toEqual([testPayments[0], testPayments[2]])
    })

    it('handles non-existent account ID', async () => {
      const testPayment: StoredPayment = {
        id: 'P-0001',
        accountId: 'A-0001',
        amount: 100,
        timestamp: '2024-03-01T10:00:00Z',
      }
      paymentRecords.push(testPayment)

      const payments = await getPaymentsByAccount('NON-EXISTENT')
      expect(payments).toEqual([])
    })
  })

  describe('savePayment', () => {
    it('successfully saves a payment', async () => {
      const newPayment: StoredPayment = {
        id: 'P-0001',
        accountId: 'A-0001',
        amount: 100,
        timestamp: '2024-03-01T10:00:00Z',
      }

      await savePayment(newPayment)
      expect(paymentRecords).toHaveLength(1)
      expect(paymentRecords[0]).toEqual(newPayment)
    })

    it('adds multiple payments correctly', async () => {
      const payments: StoredPayment[] = [
        {
          id: 'P-0001',
          accountId: 'A-0001',
          amount: 100,
          timestamp: '2024-03-01T10:00:00Z',
        },
        {
          id: 'P-0002',
          accountId: 'A-0002',
          amount: 200,
          timestamp: '2024-03-01T11:00:00Z',
        },
      ]

      await Promise.all(payments.map((payment) => savePayment(payment)))

      expect(paymentRecords).toHaveLength(2)
      expect(paymentRecords).toEqual(expect.arrayContaining(payments))
    })
  })
})
