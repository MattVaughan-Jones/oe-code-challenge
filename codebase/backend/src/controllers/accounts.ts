import { Request, Response } from 'express'
import { MOCK_ENERGY_ACCOUNTS_API } from '../mockAPIs/energyAccountsAPIMock'
import { MOCK_DUE_CHARGES_API } from '../mockAPIs/dueChargesAPIMock'
import { DueCharge, EnergyAccount, EnergyAccountWithBalance } from '../types/types'
import { getPaymentsByAccount } from '../clients/paymentClient'

export const calculateAccountBalance = async (
  account: EnergyAccount,
  charges: DueCharge[]
): Promise<number> => {
  const accountCharges = charges.filter((charge) => charge.accountId === account.id)
  const chargesTotal = accountCharges.reduce((sum, charge) => sum + charge.amount, 0)

  const payments = await getPaymentsByAccount(account.id)
  const paymentsTotal = payments.reduce((sum, payment) => sum + payment.amount, 0)

  return paymentsTotal - chargesTotal
}

export const getAccountsWithBalances = async (_req: Request, res: Response) => {
  try {
    const [accounts, charges] = await Promise.all([
      MOCK_ENERGY_ACCOUNTS_API(),
      MOCK_DUE_CHARGES_API(),
    ])

    const accountsWithBalances: EnergyAccountWithBalance[] = await Promise.all(
      accounts.map(async (account) => ({
        ...account,
        balance: await calculateAccountBalance(account, charges),
      }))
    )

    res.json(accountsWithBalances)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accounts' })
  }
}
