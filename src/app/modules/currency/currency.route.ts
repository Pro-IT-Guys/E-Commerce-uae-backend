import express from 'express'
import { CurrencyController } from './currency.controller'

const router = express.Router()

router.post('/', CurrencyController.createCurrency)
router.get('/', CurrencyController.getCurrency)

export const CurrencyRoute = router
