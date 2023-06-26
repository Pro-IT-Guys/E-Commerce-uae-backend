import express from 'express'
import { UserRoute } from '../modules/user/user.route'
import { AuthRoute } from '../modules/auth/auth.route'
import { BrandRoute } from '../modules/productBrand/brand.route'
import { TypeRoute } from '../modules/productType/type.route'
import { ProductRoute } from '../modules/product/product.route'
import { DeliveryFeeRoute } from '../modules/deliveryFee/deliveryFee.route'
import { locationRoute } from '../modules/location/location.route'
import { OrderRoute } from '../modules/order/order.route'
import { PaymentRoute } from '../modules/payment/payment.route'

const router = express.Router()

const routes = [
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/users',
    route: UserRoute,
  },
  {
    path: '/brand',
    route: BrandRoute,
  },
  {
    path: '/type',
    route: TypeRoute,
  },
  {
    path: '/product',
    route: ProductRoute,
  },
  {
    path: '/fee',
    route: DeliveryFeeRoute,
  },
  {
    path: '/location',
    route: locationRoute,
  },
  {
    path: '/order',
    route: OrderRoute,
  },
  {
    path: '/payment',
    route: PaymentRoute,
  },
]

routes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
