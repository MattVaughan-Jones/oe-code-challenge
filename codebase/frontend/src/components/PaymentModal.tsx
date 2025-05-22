import React, { useState } from 'react'
import { EnergyAccountWithBalance } from '../types/types'
import { styles } from '../styles/PaymentModal.styles'
import { formStyles } from '../styles/form.styles'
import { FormErrors, validatePaymentForm } from '../util/paymentFormValidation'
import { makePayment } from '../api/client'

type PaymentModalProps = {
  account: EnergyAccountWithBalance
  onClose: () => void
  onSuccess: () => Promise<void>
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ account, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const validateForm = (): boolean => {
    const newErrors = validatePaymentForm(amount, cardNumber, expiry, cvv)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '')
    const groups = digits.match(/.{1,4}/g) || []
    return groups.join(' ').substr(0, 19) // 16 digits + 3 spaces
  }

  const formatExpiry = (value: string): string => {
    const digits = value.replace(/\D/g, '')
    if (digits.length >= 2) {
      return `${digits.substr(0, 2)}/${digits.substr(2, 2)}`
    }
    return digits
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError(null)

    if (validateForm()) {
      setIsProcessing(true)
      try {
        await makePayment(account.id, {
          amount,
          cardNumber,
          expiry,
          cvv,
        })
        await onSuccess()
      } catch (error) {
        setPaymentError(error instanceof Error ? error.message : 'Payment failed')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton} disabled={isProcessing}>
          ×
        </button>

        <h2 style={styles.title}>Make a payment</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>How much would you like to pay?</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                ...styles.input,
                ...(errors.amount ? formStyles.errorInput : {}),
              }}
              placeholder="Amount"
              disabled={isProcessing}
            />
            {errors.amount && <div style={formStyles.errorText}>{errors.amount}</div>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>How would you like to pay?</label>
            <input
              type="text"
              value={formatCardNumber(cardNumber)}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
              style={{
                ...styles.input,
                marginBottom: '12px',
                ...(errors.cardNumber ? formStyles.errorInput : {}),
              }}
              placeholder="Card number"
              maxLength={19}
              disabled={isProcessing}
            />
            {errors.cardNumber && <div style={formStyles.errorText}>{errors.cardNumber}</div>}

            <div style={styles.cardDetailsRow}>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                style={{
                  ...styles.halfWidthInput,
                  ...(errors.expiry ? formStyles.errorInput : {}),
                }}
                placeholder="MM/YY"
                maxLength={5}
                disabled={isProcessing}
              />
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substr(0, 4))}
                style={{
                  ...styles.halfWidthInput,
                  ...(errors.cvv ? formStyles.errorInput : {}),
                }}
                placeholder="CVV"
                maxLength={4}
                disabled={isProcessing}
              />
            </div>
            {errors.expiry && <div style={formStyles.errorText}>{errors.expiry}</div>}
            {errors.cvv && <div style={formStyles.errorText}>{errors.cvv}</div>}
          </div>

          {paymentError && (
            <div style={{ ...formStyles.errorText, marginBottom: '12px' }}>{paymentError}</div>
          )}

          <button
            type="submit"
            style={{
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.7 : 1,
            }}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay'}
          </button>
        </form>
      </div>
    </div>
  )
}
