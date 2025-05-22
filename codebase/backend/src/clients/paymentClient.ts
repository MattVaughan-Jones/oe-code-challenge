import { StoredPayment } from '../models/Payment'
import { paymentRecords } from '../data/paymentStore'

export const getPaymentsByAccount = async (accountId: string): Promise<StoredPayment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const accountPayments = paymentRecords.filter((p) => p.accountId === accountId)
      resolve(accountPayments)
    }, 500)
  })
}

export const savePayment = async (payment: StoredPayment): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      paymentRecords.push(payment)
      resolve()
    }, 500)
  })
}
