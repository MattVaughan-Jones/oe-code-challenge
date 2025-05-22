import express from 'express'
import { getPaymentsByAccount, processPayment } from '../controllers/payments'
import { checkAccountExists } from '../middleware/accountExists'

const router = express.Router()

router.post('/', checkAccountExists, processPayment)
router.get('/:accountId', checkAccountExists, getPaymentsByAccount)

export default router
