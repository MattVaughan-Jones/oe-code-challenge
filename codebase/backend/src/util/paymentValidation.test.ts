import { validatePaymentData } from './paymentValidation'

describe('validatePaymentData', () => {
  const validData = {
    accountId: 'A-0001',
    amount: '100.00',
    cardNumber: '4242424242424242',
    expiry: '12/25',
    cvv: '123',
  }

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-03-01'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('returns null for valid payment data', () => {
    const result = validatePaymentData(validData)
    expect(result).toBeNull()
  })

  describe('Account ID validation', () => {
    it('requires accountId', () => {
      const result = validatePaymentData({
        ...validData,
        accountId: '',
      })
      expect(result).toBe('Account ID is required')
    })
  })

  describe('Amount validation', () => {
    test('should reject missing amount', () => {
      const result = validatePaymentData({
        ...validData,
        amount: '',
      })
      expect(result).toBe('Payment amount is required')
    })

    test('should reject non-numeric amount', () => {
      const result = validatePaymentData({
        ...validData,
        amount: 'abc',
      })
      expect(result).toBe('Payment amount must be a number')
    })

    test('should reject zero amount', () => {
      const result = validatePaymentData({
        ...validData,
        amount: '0',
      })
      expect(result).toBe('Payment amount must be greater than zero')
    })

    test('should reject negative amount', () => {
      const result = validatePaymentData({
        ...validData,
        amount: '-10',
      })
      expect(result).toBe('Payment amount must be greater than zero')
    })

    test('should reject invalid decimal format', () => {
      const result = validatePaymentData({
        ...validData,
        amount: '10.999',
      })
      expect(result).toBe('Invalid payment amount format')
    })

    test('should reject invalid decimal format', () => {
      const result = validatePaymentData({
        ...validData,
        amount: '10.99.9',
      })
      expect(result).toBe('Invalid payment amount format')
    })
  })

  describe('Card number validation', () => {
    test('should reject missing card number', () => {
      const result = validatePaymentData({
        ...validData,
        cardNumber: '',
      })
      expect(result).toBe('Card number is required')
    })

    test('should reject card number with too few digits', () => {
      const result = validatePaymentData({
        ...validData,
        cardNumber: '411111',
      })
      expect(result).toBe('Card number must be 16 digits')
    })

    const cardNumberWithSpaces = '4111 1111 1111 1111'
    test('should accept card number with spaces', () => {
      const result = validatePaymentData({
        ...validData,
        cardNumber: cardNumberWithSpaces,
      })
      expect(result).toBeNull()
    })

    test('should accept card number without spaces', () => {
      const result = validatePaymentData({
        ...validData,
        cardNumber: cardNumberWithSpaces.replace(' ', ''),
      })
      expect(result).toBeNull()
    })
  })

  describe('Expiry validation', () => {
    test('should reject missing expiry', () => {
      const result = validatePaymentData({
        ...validData,
        expiry: '',
      })
      expect(result).toBe('Expiry date is required')
    })

    test('should reject invalid expiry format', () => {
      const result = validatePaymentData({
        ...validData,
        expiry: '1225',
      })
      expect(result).toBe('Expiry date must be in MM/YY format')
    })

    test('should reject expiry with single-digit month', () => {
      const result = validatePaymentData({
        ...validData,
        expiry: '1/25',
      })
      expect(result).toBe('Expiry date must be in MM/YY format')
    })

    test('should reject invalid month', () => {
      const result = validatePaymentData({
        ...validData,
        expiry: '13/25',
      })
      expect(result).toBe('Invalid expiry month')
    })

    test('should reject expired card', () => {
      const result = validatePaymentData({
        ...validData,
        expiry: '12/20',
      })
      expect(result).toBe('Card has expired')
    })
  })

  describe('CVV validation', () => {
    test('should reject missing CVV', () => {
      const result = validatePaymentData({
        ...validData,
        cvv: '',
      })
      expect(result).toBe('CVV is required')
    })

    test('should reject CVV with invalid format', () => {
      const result = validatePaymentData({
        ...validData,
        cvv: '12',
      })
      expect(result).toBe('CVV must be 3 or 4 digits')
    })

    test('should accept 3-digit CVV', () => {
      const result = validatePaymentData({
        ...validData,
        cvv: '123',
      })
      expect(result).toBeNull()
    })

    test('should accept 4-digit CVV', () => {
      const result = validatePaymentData({
        ...validData,
        cvv: '1234',
      })
      expect(result).toBeNull()
    })
  })

  test('returns multiple errors when multiple fields are invalid', () => {
    const result = validatePaymentData({
      accountId: '',
      amount: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    })
    expect(result).toBe('Account ID is required')
  })
})
