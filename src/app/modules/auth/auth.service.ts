import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import ApiError from '../../../errors/ApiError'
import hashPassword from '../../helpers/hashPassword'
import { IUser } from '../user/user.interface'
import userModel from '../user/user.model'
import checkPassword from '../../helpers/checkPassword'
import config from '../../../config'
import { IJwtPayload, IUserResponse } from './auth.interface'
import generateRandomCode from '../../../shared/generateRandomCode'
import sendEmail from '../../helpers/sendEmail'

const signupUser = async (userData: IUser): Promise<IUserResponse> => {
  const { password, ...rest } = userData
  const { email } = userData
  const accessToken = jwt.sign({ email }, config.access_token as string, {
    expiresIn: '1d',
  })

  const verificationCode = generateRandomCode()
  const codeGenerationTimestamp = Date.now()
  const subject = 'Verify your email'
  const message = `Your verification code is ${verificationCode}.\nThis code will expire in 5 minutes.\nDon't share it with anyone`
  const codeSent = sendEmail(email, subject, message)

  if (!codeSent)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Otp code could not be sent')

  const hashedPassword = await hashPassword(password)
  const user = await userModel.create({
    password: hashedPassword,
    ...rest,
    codeGenerationTimestamp,
    verificationCode,
  })
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User creation failed')

  return { accessToken, data: { role: user.role } }
}

const verifyOtp = async (
  email: string,
  verificationCode: string
): Promise<IUserResponse> => {
  const user = await userModel.findOne({ email })
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')

  if (user.verificationCode !== verificationCode) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect otp code')
  }

  const currentTimestamp = Date.now()
  const generationTimestamp = user.codeGenerationTimestamp || 0
  const elapsedTime = currentTimestamp - Number(generationTimestamp)

  if (elapsedTime > 5 * 60 * 1000) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Expired otp code') // if otp code is expired use resend otp button in frontend
  }

  const verified = await userModel.findOneAndUpdate(
    { email },
    { isVerified: true },
    { new: true }
  )

  if (!verified)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Otp verification failed')

  // Schedule the code deletion using setTimeout()
  setTimeout(async () => {
    const updatedData = {
      verificationCode: '',
      codeGenerationTimestamp: '',
    }

    await userModel.findOneAndUpdate({ email }, updatedData, {
      new: true,
    })
  }, 5 * 60 * 1000)

  const accessToken = jwt.sign({ email }, config.access_token as string, {
    expiresIn: '1d',
  })

  return { accessToken, data: { role: user.role } }
}

const resendOtp = async (email: string): Promise<IUserResponse> => {
  const verificationCode = generateRandomCode()
  const codeGenerationTimestamp = Date.now()
  const subject = 'Verify your email'
  const message = `Your verification code is ${verificationCode}.\nThis code will expire in 5 minutes.\nDon't share it with anyone`
  const codeSent = sendEmail(email, subject, message)

  if (!codeSent)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Otp code could not be sent')

  const updatedData = {
    verificationCode,
    codeGenerationTimestamp,
  }

  const user = await userModel.findOneAndUpdate({ email }, updatedData, {
    new: true,
  })
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User creation failed')
  const accessToken = jwt.sign({ email }, config.access_token as string, {
    expiresIn: '1d',
  })

  return { accessToken, data: { role: user.role } }
}

const loginUser = async (userData: IUser): Promise<IUserResponse> => {
  const { password, email } = userData

  const user = await userModel.findOne({ email })
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')

  const passwordMatch = await checkPassword(password, user)
  if (!passwordMatch)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password')

  const accessToken = jwt.sign({ email }, config.access_token as string, {
    expiresIn: '1d',
  })
  return { accessToken, data: { role: user.role } }
}

const loggedInUser = async (token: string): Promise<IUser> => {
  const decodedToken = jwt.verify(
    token,
    config.access_token as string
  ) as IJwtPayload

  const email = decodedToken.email
  const user = await userModel
    .findOne({ email })
    .select({ password: 0, updatedAt: 0, createdAt: 0, __v: 0 })
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')

  return user
}

const resetPassword = async (
  email: string,
  password: string
): Promise<void> => {
  const user = await userModel.findOne({ email })
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')

  const hashedPassword = await hashPassword(password)
  const updatedUser = await userModel.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  )
  if (!updatedUser)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password reset failed')
}

export const AuthService = {
  signupUser,
  verifyOtp,
  resendOtp,
  loginUser,
  loggedInUser,
  resetPassword,
}
