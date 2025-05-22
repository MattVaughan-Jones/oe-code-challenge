export enum EnergyType {
  GAS = 'GAS',
  ELECTRICITY = 'ELECTRICITY',
}

export type EnergyAccount = {
  id: string
  type: EnergyType
  address: string
  meterNumber?: string
  volume?: number
}

export type DueCharge = {
  id: string
  accountId: string
  date: string
  amount: number
}

export type EnergyAccountWithBalance = EnergyAccount & {
  balance: number
}
