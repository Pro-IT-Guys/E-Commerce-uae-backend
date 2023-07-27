import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { UserValidation } from '../user/user.validation'
import { AuthController } from './auth.controller'

const router = express.Router()

router.post(
  '/',
  validateRequest(UserValidation.createUserZodSchema),
  AuthController.signupUser
)
router.post('/verify', AuthController.verifyOtp)
router.post('/resend_otp', AuthController.resendOtp)
router.post('/login', AuthController.loginUser)
router.get('/me', AuthController.loggedInUser)
router.post('/reset_password', AuthController.resetPassword)

export const AuthRoute = router
