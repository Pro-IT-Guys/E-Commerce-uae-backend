import express from 'express'
import { DeliveryFeeController } from './deliveryFee.controller'

const router = express.Router()

// router.post('/', DeliveryFeeController.createFee)
router.post('/get_fee', DeliveryFeeController.getFeeOfLocation)
router.get('/all', DeliveryFeeController.getAllFees)
router.post('/', DeliveryFeeController.createFee)
router.patch('/:id', DeliveryFeeController.updateFee)

export const DeliveryFeeRoute = router
