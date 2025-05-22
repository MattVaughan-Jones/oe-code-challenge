import React from 'react'
import { styles } from '../styles/PaymentModal.styles'

type SuccessfulPaymentModalProps = {
  onClose: () => void
}

export const SuccessfulPaymentModal: React.FC<SuccessfulPaymentModalProps> = ({ onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={{ marginBottom: '24px' }}>Your payment has been processed successfully.</p>
        <button onClick={onClose} style={{ cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  )
}
