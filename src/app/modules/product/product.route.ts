import express from 'express'
import { ProductController } from './product.controller'
// import validateRequest from '../../middlewares/validateRequest'
// import { ProductValidation } from './product.velidation'
import uploadMiddleware from '../../middlewares/productFileUpload'
import formatArrayFields from '../../middlewares/formatArrayField'

const router = express.Router()

router.post(
  '/',
  // validateRequest(ProductValidation.createProductZodSchema),
  uploadMiddleware,
  formatArrayFields,
  ProductController.createProduct
)
router.get('/:id', ProductController.getProductById)
router.get('/path/:path', ProductController.getProductByPath)
router.get('/sku/:sku', ProductController.getProductBySku)
router.get('/', ProductController.getAllProduct)
router.patch(
  '/:id',
  uploadMiddleware,
  formatArrayFields,
  ProductController.updateProduct
)
router.delete('/:id', ProductController.deleteProduct)

export const ProductRoute = router
