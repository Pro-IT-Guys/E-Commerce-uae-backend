import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { CurrencyServices } from './currency.service'
import { sendSuccessResponse } from '../../../shared/customResponse'

const createCurrency = catchAsync(async (req: Request, res: Response) => {
  const response = await CurrencyServices.createCurrency(req.body)
  const responseData = {
    data: response,
    message: 'Currency created successfully',
  }
  sendSuccessResponse(res, responseData)
})

const getCurrency = catchAsync(async (req: Request, res: Response) => {
  const response = await CurrencyServices.getCurrency()
  const responseData = {
    data: response,
    message: 'Currency fetched successfully',
  }
  sendSuccessResponse(res, responseData)
})

export const CurrencyController = {
  createCurrency,
  getCurrency,
}
