import express from 'express'
import { CartController } from './cart.controller'

const router = express.Router()

router.post('/', CartController.addToCart)
router.patch('/quantity/:id/:productId', CartController.updateProductQuantity)
router.patch('/:id', CartController.updateCart)
router.patch('/bulk/:id', CartController.bulkUpdateCart)
router.get('/user/:id', CartController.getCartByUserId)
router.get('/:id', CartController.getCartByCartId)
router.delete('/remove/:id/:productId', CartController.deleteAProductFromCart)
router.delete('/:id', CartController.deleteCart)

export const CartRoute = router
