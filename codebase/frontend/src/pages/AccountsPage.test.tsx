import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { AccountsPage } from './AccountsPage'
import { fetchAccounts } from '../api/client'

jest.mock('../api/client', () => ({
  fetchAccounts: jest.fn(),
}))

const mockFetchAccounts = fetchAccounts as jest.MockedFunction<typeof fetchAccounts>

const renderPageAndWaitForLoad = async () => {
  render(<AccountsPage />)

  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })
}

describe('AccountsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetchAccounts.mockResolvedValue([
      {
        id: 'mock-account-0001',
        type: 'ELECTRICITY',
        address: '1 Test St',
        meterNumber: '123',
        balance: 50,
      },
      {
        id: 'mock-account-0002',
        type: 'GAS',
        address: '2 Test St',
        volume: 100,
        balance: 30,
      },
    ])
  })

  test('shows loading state initially', () => {
    render(<AccountsPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('renders accounts after loading', async () => {
    await renderPageAndWaitForLoad()

    expect(screen.getByText('1 Test St')).toBeInTheDocument()
    expect(screen.getByText('2 Test St')).toBeInTheDocument()
    expect(screen.getByText('Balance: $50.00')).toBeInTheDocument()
    expect(screen.getByText('Balance: $30.00')).toBeInTheDocument()
  })

  test('filters accounts by type', async () => {
    await renderPageAndWaitForLoad()

    const select = screen.getByLabelText('Energy Type')
    fireEvent.change(select, { target: { value: 'ELECTRICITY' } })

    expect(screen.getByText('1 Test St')).toBeInTheDocument()
    expect(screen.queryByText('2 Test St')).not.toBeInTheDocument()
  })

  test('filters accounts by address search', async () => {
    await renderPageAndWaitForLoad()

    fireEvent.change(screen.getByPlaceholderText('Search by address...'), {
      target: { value: '1 Test' },
    })

    expect(screen.getByText('1 Test St')).toBeInTheDocument()
    expect(screen.queryByText('2 Test St')).not.toBeInTheDocument()
  })

  test('handles API error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockFetchAccounts.mockRejectedValue(new Error('API Error'))

    await renderPageAndWaitForLoad()

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch data:', expect.any(Error))

    consoleErrorSpy.mockRestore()
  })

  test('opens payment modal when Make Payment is clicked', async () => {
    await renderPageAndWaitForLoad()

    fireEvent.click(screen.getAllByText('Make a Payment')[0])

    expect(screen.getByText('Make a payment')).toBeInTheDocument()
    expect(screen.getByText('How much would you like to pay?')).toBeInTheDocument()
  })

  test('opens payment history modal when View Payment History is clicked', async () => {
    await renderPageAndWaitForLoad()

    fireEvent.click(screen.getAllByText('View Payments History')[0])

    expect(screen.getByText(/Payment History for Account/)).toBeInTheDocument()
  })

  test('combines type and address filters', async () => {
    await renderPageAndWaitForLoad()

    fireEvent.change(screen.getByLabelText('Energy Type'), {
      target: { value: 'ELECTRICITY' },
    })

    fireEvent.change(screen.getByPlaceholderText('Search by address...'), {
      target: { value: '2 Test' },
    })

    expect(screen.queryByText('1 Test St')).not.toBeInTheDocument()
    expect(screen.queryByText('2 Test St')).not.toBeInTheDocument()
  })
})
