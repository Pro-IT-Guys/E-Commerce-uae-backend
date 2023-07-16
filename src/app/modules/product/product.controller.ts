/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { ProductService } from './product.service'
import { sendSuccessResponse } from '../../../shared/customResponse'
import pick from '../../../shared/pick'
import { IMAGE_URL, PRODUCT_FILTER_FIELDS } from './product.constant'
import { IPaginationOption } from '../../../interfaces/sharedInterface'
import { paginationFields } from '../../../constant/shared.constant'
import httpStatus from 'http-status'
import convertToWebP from '../../helpers/convertImageToWebp'
import { convertMultipleValuesToObject } from '../../helpers/convertMultipleValuesIntoObject'

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const productData = req.body
  const uploadedFiles = req.files as any

  if (Object.keys(uploadedFiles).length !== 0) {
    const frontImageWebP = uploadedFiles.frontImage.map(
      (file: any) => `${convertToWebP(file.filename)}`
    )
    const backImageWebP = uploadedFiles.backImage.map(
      (file: any) => `${convertToWebP(file.filename)}`
    )

    // const restImageFiles = uploadedFiles.restImage || []
    // let restImageWebP: string[] = []
    // if (restImageFiles.length > 0) {
    //   restImageWebP = uploadedFiles.restImage.map(
    //     (file: any) => `${IMAGE_URL}/${convertToWebP(file.filename)}`
    //   )
    // }

    // split restImage
    const restImageWebP = productData.restImage.split(',')

    productData.frontImage = `${IMAGE_URL}/${frontImageWebP[0]}`
    productData.backImage = `${IMAGE_URL}/${backImageWebP[0]}`
    productData.restImage = restImageWebP
    // productData.restImage = restImageWebP
  }

  const product = await ProductService.createProduct(productData)
  const responseData = {
    message: 'Product created successfully',
    data: product,
  }

  sendSuccessResponse(res, responseData)
})

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id
  const productData = req.body
  const uploadedFiles = req.files as any

  if (productData?.restImage[0]?.split(',')?.length > 0) {
    const restImageWebP = productData.restImage.split(',')
    productData.restImage = restImageWebP
    // console.log(productData?.restImage[0]?.split(',')?.length, 'condition')
  }

  if (Object.keys(uploadedFiles).length !== 0) {
    if (uploadedFiles.frontImage) {
      const frontImageWebP = uploadedFiles.frontImage.map(
        (file: any) => `${convertToWebP(file.filename)}`
      )
      productData.frontImage = `${IMAGE_URL}/${frontImageWebP[0]}`
    }

    if (uploadedFiles.backImage) {
      const backImageWebP = uploadedFiles.backImage.map(
        (file: any) => `${convertToWebP(file.filename)}`
      )
      productData.backImage = `${IMAGE_URL}/${backImageWebP[0]}`
    }

    // if (uploadedFiles.restImage) {
    //   const restImageWebP = uploadedFiles.restImage.map(
    //     (file: any) => `${convertToWebP(file.filename)}`
    //   )
    //   productData.restImage = `${IMAGE_URL}/${restImageWebP}`
    // }
  }

  const product = await ProductService.updateProduct(productId, productData)
  const responseData = {
    message: 'Product updated successfully',
    data: product,
  }

  sendSuccessResponse(res, responseData)
})

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...PRODUCT_FILTER_FIELDS])
  const paginationOption: IPaginationOption = pick(req.query, paginationFields)

  const convertedFilters: Record<string, string | string[]> =
    convertMultipleValuesToObject(filters as Record<string, string | string[]>)

  const result = await ProductService.getAllProduct(
    convertedFilters,
    paginationOption
  )

  const responseData = {
    statusCode: httpStatus.OK,
    meta: result.meta || {},
    data: result.data || [],
    message: 'All Product fetched successfully',
  }

  sendSuccessResponse(res, responseData)
})

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id

  const product = await ProductService.getProductById(productId)
  const responseData = {
    message: 'Product fetched successfully',
    data: product,
  }

  sendSuccessResponse(res, responseData)
})

const getProductByPath = catchAsync(async (req: Request, res: Response) => {
  const productPath = req.params.path

  const product = await ProductService.getProductByPath(productPath)
  const responseData = {
    message: 'Product fetched successfully',
    data: product,
  }

  sendSuccessResponse(res, responseData)
})

const getProductBySku = catchAsync(async (req: Request, res: Response) => {
  const productSku = req.params.sku
  const product = await ProductService.getProductBySku(productSku)
  const responseData = {
    message: 'Product fetched successfully',
    data: product,
  }
  sendSuccessResponse(res, responseData)
})

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id

  const product = await ProductService.deleteProduct(productId)
  const responseData = {
    message: 'Product deleted successfully',
    data: product,
  }

  sendSuccessResponse(res, responseData)
})

export const ProductController = {
  createProduct,
  updateProduct,
  getAllProduct,
  getProductById,
  getProductByPath,
  getProductBySku,
  deleteProduct,
}
