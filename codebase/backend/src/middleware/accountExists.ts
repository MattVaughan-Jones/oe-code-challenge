import { Request, Response, NextFunction } from 'express'
import { MOCK_ENERGY_ACCOUNTS_API } from '../mockAPIs/energyAccountsAPIMock'

export const checkAccountExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = req.params.accountId || req.body.accountId
    if (!accountId) {
      return res.status(400).json({ error: 'Account ID is required' })
    }

    const accounts = await MOCK_ENERGY_ACCOUNTS_API()
    const accountExists = accounts.some((account) => account.id === accountId)

    if (!accountExists) {
      return res.status(404).json({ error: 'Account not found' })
    }

    next()
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify account' })
  }
}
