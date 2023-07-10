'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.PaymentRoute = void 0
const express_1 = __importDefault(require('express'))
const payment_controller_1 = require('./payment.controller')
const router = express_1.default.Router()
router.post('/stripe', payment_controller_1.PaymentController.stripePayment)
router.post('/paypal', payment_controller_1.PaymentController.paypalPayment)
router.post(
  '/paypal/webhook',
  payment_controller_1.PaymentController.handlePayPalWebhookForVerifyPayment
)
exports.PaymentRoute = router
