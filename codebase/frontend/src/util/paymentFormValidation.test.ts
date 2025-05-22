import { validatePaymentForm } from './paymentFormValidation'

describe('validatePaymentForm', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-03-01'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('returns no errors for valid input', () => {
    const result = validatePaymentForm('100.00', '4242424242424242', '12/25', '123')
    expect(result).toEqual({})
  })

  describe('amount validation', () => {
    test('requires amount', () => {
      const result = validatePaymentForm('', '4242424242424242', '12/25', '123')
      expect(result).toEqual({
        amount: 'Amount is required',
      })
    })

    test('rejects negative amounts', () => {
      const result = validatePaymentForm('-100', '4242424242424242', '12/25', '123')
      expect(result).toEqual({
        amount: 'Amount must be greater than 0',
      })
    })

    test('rejects zero', () => {
      const result = validatePaymentForm('0', '4242424242424242', '12/25', '123')
      expect(result).toEqual({
        amount: 'Amount must be greater than 0',
      })
    })

    test('rejects non-numeric amount', () => {
      const result = validatePaymentForm('abc', '4242424242424242', '12/25', '123')
      expect(result).toEqual({
        amount: 'Invalid amount',
      })
    })
  })

  describe('card number validation', () => {
    test('accepts card number with spaces', () => {
      const result = validatePaymentForm('100', '4242 4242 4242 4242', '12/25', '123')
      expect(result).toEqual({})
    })

    test('accepts card number without spaces', () => {
      const result = validatePaymentForm('100', '4242424242424242', '12/25', '123')
      expect(result).toEqual({})
    })

    test('requires card number', () => {
      const result = validatePaymentForm('100', '', '12/25', '123')
      expect(result).toEqual({
        cardNumber: 'Card number is required',
      })
    })

    test('rejects card number with less than 16 digits', () => {
      const result = validatePaymentForm('100', '424242424242', '12/25', '123')
      expect(result).toEqual({
        cardNumber: 'Card number must be 16 digits',
      })
    })

    test('rejects card number with more than 16 digits', () => {
      const result = validatePaymentForm('100', '42424242424242424', '12/25', '123')
      expect(result).toEqual({
        cardNumber: 'Card number must be 16 digits',
      })
    })

    test('rejects card number with non-numeric characters (excluding spaces)', () => {
      const result = validatePaymentForm('100', '4242abcd42424242', '12/25', '123')
      expect(result).toEqual({
        cardNumber: 'Card number must contain only numbers',
      })
    })
  })

  describe('expiry validation', () => {
    test('requires expiry', () => {
      const result = validatePaymentForm('100', '4242424242424242', '', '123')
      expect(result).toEqual({
        expiry: 'Expiry date is required',
      })
    })

    test('validates MM/YY format', () => {
      const result = validatePaymentForm('100', '4242424242424242', '1225', '123')
      expect(result).toEqual({
        expiry: 'Use MM/YY format',
      })
    })

    test('rejects invalid month', () => {
      const result = validatePaymentForm('100', '4242424242424242', '13/25', '123')
      expect(result).toEqual({
        expiry: 'Month must be less than 12',
      })
    })

    test('rejects expired card (previous month)', () => {
      const result = validatePaymentForm('100', '4242424242424242', '02/24', '123')
      expect(result).toEqual({
        expiry: 'Card has expired',
      })
    })

    test('rejects expired card (same month, previous year)', () => {
      const result = validatePaymentForm('100', '4242424242424242', '03/23', '123')
      expect(result).toEqual({
        expiry: 'Card has expired',
      })
    })

    test('accepts current month', () => {
      const result = validatePaymentForm('100', '4242424242424242', '03/24', '123')
      expect(result).toEqual({})
    })

    test('accepts future month', () => {
      const result = validatePaymentForm('100', '4242424242424242', '04/24', '123')
      expect(result).toEqual({})
    })
  })

  describe('cvv validation', () => {
    test('requires cvv', () => {
      const result = validatePaymentForm('100', '4242424242424242', '12/25', '')
      expect(result).toEqual({
        cvv: 'CVV is required',
      })
    })

    test('rejects cvv with less than 3 digits', () => {
      const result = validatePaymentForm('100', '4242424242424242', '12/25', '12')
      expect(result).toEqual({
        cvv: 'CVV must be 3 or 4 digits',
      })
    })

    test('accepts 3 digit cvv', () => {
      const result = validatePaymentForm('100', '4242424242424242', '12/25', '123')
      expect(result).toEqual({})
    })

    test('accepts 4 digit cvv', () => {
      const result = validatePaymentForm('100', '4242424242424242', '12/25', '1234')
      expect(result).toEqual({})
    })

    test('rejects cvv with more than 4 digits', () => {
      const result = validatePaymentForm('100', '4242424242424242', '12/25', '12345')
      expect(result).toEqual({
        cvv: 'CVV must be 3 or 4 digits',
      })
    })

    test('rejects cvv with non-numeric characters', () => {
      const result = validatePaymentForm('100', '4242424242424242', '12/25', '12a')
      expect(result).toEqual({
        cvv: 'CVV must contain only numbers',
      })
    })
  })

  test('returns multiple errors when multiple fields are invalid', () => {
    const result = validatePaymentForm('', '', '', '')
    expect(result).toEqual({
      amount: 'Amount is required',
      cardNumber: 'Card number is required',
      expiry: 'Expiry date is required',
      cvv: 'CVV is required',
    })
  })
})
