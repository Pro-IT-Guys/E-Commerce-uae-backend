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
import { ChatRoute } from '../modules/chat/chat.route'
import { MessageRoute } from '../modules/Message/message.route'
import { CartRoute } from '../modules/cart/cart.route'
import { ReviewRoute } from '../modules/review/review.route'
import { OfferRoute } from '../modules/offer/offer.route'
import { ImageUploadRoute } from '../modules/imageUpload/imageUpload.route'
import { TermsConditionRoute } from '../modules/terms-condition/terms.route'
import { PrivacyPolicyRoute } from '../modules/privacyPolicy/privacy.route'
import { ReturnPolicyRoute } from '../modules/returnPoilcy/return.route'
import { CuponRoute } from '../modules/cupon/cupon.route'
import { CurrencyRoute } from '../modules/currency/currency.route'
// import { OfferRoute } from '../modules/offer/offer.route'

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
  {
    path: '/chat',
    route: ChatRoute,
  },
  {
    path: '/message',
    route: MessageRoute,
  },
  {
    path: '/cart',
    route: CartRoute,
  },
  {
    path: '/review',
    route: ReviewRoute,
  },
  {
    path: '/offer',
    route: OfferRoute,
  },
  {
    path: '/image',
    route: ImageUploadRoute,
  },
  {
    path: '/terms-condition',
    route: TermsConditionRoute,
  },
  {
    path: '/privacy-policy',
    route: PrivacyPolicyRoute,
  },
  {
    path: '/return-policy',
    route: ReturnPolicyRoute,
  },
  {
    path: '/cupon',
    route: CuponRoute,
  },
  {
    path: '/currency',
    route: CurrencyRoute,
  },
]

routes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
