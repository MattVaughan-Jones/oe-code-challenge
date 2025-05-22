export type EnergyType = 'GAS' | 'ELECTRICITY'

export type DueCharge = {
  id: string
  accountId: string
  date: string
  amount: number
}

export type EnergyAccount = {
  id: string
  type: EnergyType
  address: string
  meterNumber?: string
  volume?: number
}

export type EnergyAccountWithBalance = EnergyAccount & {
  balance: number
}

export type PaymentRequest = {
  accountId: string
  amount: string
  cardNumber: string
  expiry: string
  cvv: string
}

export type Payment = {
  id: string
  accountId: string
  amount: number
  timestamp: string
}
