const API_BASE_URL = 'http://localhost:3001/api'

export const fetchAccounts = async () => {
  const response = await fetch(`${API_BASE_URL}/accounts`)
  if (!response.ok) {
    throw new Error('Failed to fetch accounts')
  }
  return response.json()
}

export const makePayment = async (
  accountId: string,
  paymentData: {
    amount: string
    cardNumber: string
    expiry: string
    cvv: string
  }
) => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...paymentData, accountId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Payment failed')
  }

  return response.json()
}

export const fetchPaymentHistory = async (accountId: string) => {
  const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/payments`)
  if (!response.ok) {
    throw new Error('Failed to fetch payment history')
  }
  return response.json()
}
