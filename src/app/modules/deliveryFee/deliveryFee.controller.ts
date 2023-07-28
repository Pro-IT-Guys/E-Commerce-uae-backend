import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { DeliveryFeeService } from './deliveryFee.service'
import { sendSuccessResponse } from '../../../shared/customResponse'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'

const createFee = catchAsync(async (req: Request, res: Response) => {
  const data = await DeliveryFeeService.CreateFee()
  const responseData = {
    data,
    message: 'Delivery fee created successfully',
  }

  sendSuccessResponse(res, responseData)
})

const updateFee = catchAsync(async (req: Request, res: Response) => {
  const { dataPayload } = req.body
  const { id } = req.params

  const data = await DeliveryFeeService.updateFee(id, dataPayload)
  const responseData = {
    data,
    message: 'Delivery fee updated successfully',
  }

  sendSuccessResponse(res, responseData)
})

const getAllFees = catchAsync(async (req: Request, res: Response) => {
  const data = await DeliveryFeeService.getAllFees()
  const responseData = {
    data,
    message: 'Delivery fee fetched successfully',
  }
  sendSuccessResponse(res, responseData)
})

const getFeeOfLocation = catchAsync(async (req: Request, res: Response) => {
  const { countryId, stateCode, city_name } = req.body

  if (!countryId || !stateCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Country and state are required')
  }

  const data = await DeliveryFeeService.getFeeOfLocation(
    countryId,
    stateCode,
    city_name as string
  )
  const responseData = {
    data,
    message: 'Delivery fee fetched successfully',
  }

  sendSuccessResponse(res, responseData)
})

export const DeliveryFeeController = {
  createFee,
  updateFee,
  getAllFees,
  getFeeOfLocation,
}
