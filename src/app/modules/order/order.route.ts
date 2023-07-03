import express from 'express'
import { OrderController } from './order.controller'

const router = express.Router()

router.post('/', OrderController.createOrder)
router.get('/', OrderController.getAllOrder)
router.patch('/:id', OrderController.updateOrder)
router.get('/user/:id', OrderController.getOrderByUserId)

export const OrderRoute = router
