export type PaymentRequest = {
  accountId: string
  amount: string
  cardNumber: string
  expiry: string
  cvv: string
}

export type StoredPayment = {
  id: string
  accountId: string
  amount: number
  timestamp: string
}
