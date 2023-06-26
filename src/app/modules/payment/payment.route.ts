import express from 'express'
import { PaymentController } from './payment.controller'

const router = express.Router()

router.post('/', PaymentController.processPayment)

export const PaymentRoute = router
