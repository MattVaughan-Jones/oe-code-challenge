import React, { useState, useEffect } from 'react'
import { styles } from '../styles/PaymentModal.styles'
import { Payment, EnergyAccountWithBalance } from '../types/types'
import { Loading } from './Loading'
import { fetchPaymentHistory } from '../api/client'

type PaymentHistoryModalProps = {
  account: EnergyAccountWithBalance
  onClose: () => void
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ account, onClose }) => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentHistory = await fetchPaymentHistory(account.id)
        setPayments(paymentHistory)
      } catch (error) {
        console.error('Failed to fetch payment history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [account.id])

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>
          ×
        </button>
        <h2 style={styles.title}>Payment History for Account {account.id}</h2>

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {isLoading ? (
            <Loading />
          ) : payments.length === 0 ? (
            <p>No payment history found for this account.</p>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.id}
                style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{new Date(payment.timestamp).toLocaleDateString()}</span>
                <span>${payment.amount.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
