import { Request, Response } from 'express'
import { validatePaymentData } from '../util/paymentValidation'
import { savePayment, getPaymentsByAccount as getPayments } from '../clients/paymentClient'
import { v4 } from 'uuid'
import { StoredPayment } from '../models/Payment'

export const processPayment = async (req: Request, res: Response) => {
  try {
    const { accountId, amount, cardNumber, expiry, cvv } = req.body

    const validationError = validatePaymentData({
      accountId,
      amount,
      cardNumber,
      expiry,
      cvv,
    })

    if (validationError) {
      return res.status(400).json({ error: validationError })
    }

    const payment: StoredPayment = {
      accountId,
      amount: parseFloat(amount),
      id: v4(),
      timestamp: new Date().toISOString(),
    }

    await savePayment(payment)
    res.json({ success: true, message: 'Payment processed successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' })
  }
}

export const getPaymentsByAccount = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params
    const payments = await getPayments(accountId)
    res.json(payments)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment history' })
  }
}
