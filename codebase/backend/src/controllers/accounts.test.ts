import { Request, Response } from 'express'
import { calculateAccountBalance, getAccountsWithBalances } from './accounts'
import { MOCK_ENERGY_ACCOUNTS_API } from '../mockAPIs/energyAccountsAPIMock'
import { MOCK_DUE_CHARGES_API } from '../mockAPIs/dueChargesAPIMock'
import { getPaymentsByAccount } from '../clients/paymentClient'
import { EnergyType } from '../types/types'

jest.mock('../mockAPIs/energyAccountsAPIMock')
jest.mock('../mockAPIs/dueChargesAPIMock')
jest.mock('../clients/paymentClient')

const mockEnergyAccountsAPI = jest.mocked(MOCK_ENERGY_ACCOUNTS_API)
const mockDueChargesAPI = jest.mocked(MOCK_DUE_CHARGES_API)
const mockGetPaymentsByAccount = jest.mocked(getPaymentsByAccount)

describe('calculateAccountBalance', () => {
  const mockAccount = { id: 'A-0001', type: EnergyType.ELECTRICITY, address: 'Test Address' }

  beforeEach(() => {
    mockGetPaymentsByAccount.mockResolvedValue([])
  })

  test('calculates balance correctly with charges and payments', async () => {
    const mockCharges = [
      { id: 'C1', accountId: 'A-0001', date: '2024-03-01', amount: 50 },
      { id: 'C2', accountId: 'A-0001', date: '2024-03-02', amount: 30 },
    ]
    mockGetPaymentsByAccount.mockResolvedValue([
      { id: 'P1', accountId: 'A-0001', amount: 100, timestamp: '2024-03-01' },
    ])

    const balance = await calculateAccountBalance(mockAccount, mockCharges)
    expect(balance).toBe(20)
  })

  test('returns 0 for account with no charges or payments', async () => {
    mockGetPaymentsByAccount.mockResolvedValue([])
    const balance = await calculateAccountBalance(mockAccount, [])
    expect(balance).toBe(0)
  })

  test('only includes charges for the specified account', async () => {
    const mockCharges = [
      { id: 'C1', accountId: 'A-0001', date: '2024-03-01', amount: 50 },
      { id: 'C2', accountId: 'A-0002', date: '2024-03-02', amount: 30 },
    ]
    mockGetPaymentsByAccount.mockResolvedValue([
      { id: 'P1', accountId: 'A-0001', amount: 75, timestamp: '2024-03-01' },
    ])

    const balance = await calculateAccountBalance(mockAccount, mockCharges)
    expect(balance).toBe(25)
  })
})

describe('getAccountsWithBalances', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    }
    mockGetPaymentsByAccount.mockReset()
  })

  test('returns accounts with calculated balances', async () => {
    const accounts = [
      { id: 'A-0001', type: EnergyType.ELECTRICITY, address: '1 Test St', meterNumber: '123' },
      { id: 'A-0002', type: EnergyType.GAS, address: '2 Test St', volume: 100 },
    ]

    const charges = [
      { id: 'D-0001', accountId: 'A-0001', date: '2025-04-01', amount: 30 },
      { id: 'D-0002', accountId: 'A-0001', date: '2025-04-08', amount: 20 },
      { id: 'D-0003', accountId: 'A-0002', date: '2025-03-25', amount: 50 },
    ]

    mockEnergyAccountsAPI.mockResolvedValue(accounts)
    mockDueChargesAPI.mockResolvedValue(charges)
    mockGetPaymentsByAccount
      .mockResolvedValueOnce([
        { id: 'P1', accountId: 'A-0001', amount: 100, timestamp: '2024-03-01' },
      ])
      .mockResolvedValueOnce([
        { id: 'P2', accountId: 'A-0002', amount: 75, timestamp: '2024-03-01' },
      ])

    await getAccountsWithBalances(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.json).toHaveBeenCalledWith([
      { ...accounts[0], balance: 50 },
      { ...accounts[1], balance: 25 },
    ])
  })

  test('handles MOCK_ENERGY_ACCOUNTS_API API error correctly', async () => {
    mockEnergyAccountsAPI.mockRejectedValue(new Error('mock error'))

    await getAccountsWithBalances(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch accounts' })
  })

  test('handles MOCK_DUE_CHARGES_API API error correctly', async () => {
    mockDueChargesAPI.mockRejectedValue(new Error('mock error'))

    await getAccountsWithBalances(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch accounts' })
  })

  test('handles empty account list', async () => {
    mockEnergyAccountsAPI.mockResolvedValue([])
    mockDueChargesAPI.mockResolvedValue([])

    await getAccountsWithBalances(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.json).toHaveBeenCalledWith([])
  })
})
