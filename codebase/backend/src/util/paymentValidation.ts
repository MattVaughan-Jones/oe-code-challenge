type PaymentValidationData = {
  accountId: string
  amount: string
  cardNumber: string
  expiry: string
  cvv: string
}

export const validatePaymentData = (data: PaymentValidationData): string | null => {
  const { accountId, amount, cardNumber, expiry, cvv } = data
  // Account validation
  if (!accountId) {
    return 'Account ID is required'
  }

  // Amount validation
  if (!amount) {
    return 'Payment amount is required'
  }

  if (isNaN(parseFloat(amount))) {
    return 'Payment amount must be a number'
  }

  if (parseFloat(amount) <= 0) {
    return 'Payment amount must be greater than zero'
  }

  if (!/^\d+(\.\d{0,2})?$/.test(amount)) {
    return 'Invalid payment amount format'
  }

  // Card number validation
  if (!cardNumber) {
    return 'Card number is required'
  }

  if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
    return 'Card number must be 16 digits'
  }

  // Expiry validation
  if (!expiry) {
    return 'Expiry date is required'
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return 'Expiry date must be in MM/YY format'
  }

  const [month, year] = expiry.split('/')
  const monthNum = parseInt(month, 10)
  if (monthNum > 12) {
    return 'Invalid expiry month'
  }

  const now = new Date()
  const cardExpires = new Date(2000 + parseInt(year, 10), monthNum - 1)
  if (cardExpires < now) {
    return 'Card has expired'
  }

  // CVV validation
  if (!cvv) {
    return 'CVV is required'
  }

  if (!/^\d{3,4}$/.test(cvv)) {
    return 'CVV must be 3 or 4 digits'
  }

  return null
}
