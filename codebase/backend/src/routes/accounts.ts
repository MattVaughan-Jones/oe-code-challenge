import express, { Request, Response, NextFunction } from 'express'
import { getAccountsWithBalances } from '../controllers/accounts'
import { getPaymentsByAccount } from '../controllers/payments'

const router = express.Router()

router.get('/', getAccountsWithBalances)
router.get('/:accountId/payments', getPaymentsByAccount)

export default router
