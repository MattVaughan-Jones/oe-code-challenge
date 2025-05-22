import { endOfMonth, isBefore } from 'date-fns'
export type FormErrors = {
  amount?: string
  cardNumber?: string
  expiry?: string
  cvv?: string
}

export const validatePaymentForm = (
  amount: string,
  cardNumber: string,
  expiry: string,
  cvv: string
): FormErrors => {
  const errors: FormErrors = {}

  // Amount validation
  if (!amount) {
    errors.amount = 'Amount is required'
  } else if (parseFloat(amount) <= 0) {
    errors.amount = 'Amount must be greater than 0'
  } else if (!/^\d+(\.\d{0,2})?$/.test(amount)) {
    errors.amount = 'Invalid amount'
  }

  // Card number validation (basic)
  if (!cardNumber) {
    errors.cardNumber = 'Card number is required'
  } else if (removeSpaces(cardNumber).length !== 16) {
    errors.cardNumber = 'Card number must be 16 digits'
  } else if (!/^\d{16}$/.test(removeSpaces(cardNumber))) {
    errors.cardNumber = 'Card number must contain only numbers'
  }

  // Expiry validation (MM/YY format)
  const [month, year] = expiry.split('/')
  if (!expiry) {
    errors.expiry = 'Expiry date is required'
  } else if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    errors.expiry = 'Use MM/YY format'
  } else if (+month > 12) {
    errors.expiry = 'Month must be less than 12'
  } else {
    const now = new Date()
    const cardExpires = endOfMonth(new Date(`20${year}-${month}-01`)) // start of next month
    if (isBefore(cardExpires, now)) {
      errors.expiry = 'Card has expired'
    }
  }

  // CVV validation
  if (!cvv) {
    errors.cvv = 'CVV is required'
  } else if (cvv.length < 3 || cvv.length > 4) {
    errors.cvv = 'CVV must be 3 or 4 digits'
  } else if (!/^\d{3,4}$/.test(cvv)) {
    errors.cvv = 'CVV must contain only numbers'
  }

  return errors
}

function removeSpaces(input: string) {
  return input.replace(/\s/g, '')
}
