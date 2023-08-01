import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IProduct, IProductFilters } from './product.interface'
import productModel from './product.model'
import {
  IGenericDataWithMeta,
  IPaginationOption,
} from '../../../interfaces/sharedInterface'
import { PRODUCT_SEARCH_FIELDS } from './product.constant'
import paginationHelper from '../../helpers/paginationHelper'
import { SortOrder } from 'mongoose'
import { generateProductSKU } from '../../helpers/generateProductSku'

const createProduct = async (productData: IProduct): Promise<IProduct> => {
  // let sku = generateUniqueSKU(6)
  // while (await productModel.findOne({ sku })) {
  //   sku = generateUniqueSKU(6) // Check if the generated SKU already exists in the database. If it does, generate a new one.
  // }

  const sku = await generateProductSKU(productData.category)

  const product = await productModel.create({
    ...productData,
    sku,
  })

  if (!product)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product creation failed')

  return product
}

const updateProduct = async (
  productId: string,
  productData: Partial<IProduct>
): Promise<IProduct> => {
  const isExist = await productModel.findOne({ _id: productId })
  if (!isExist) throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found')

  const product = await productModel.findOneAndUpdate(
    { _id: productId },
    productData,
    { new: true }
  )

  if (!product)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product update failed')

  return product
}

const getAllProduct = async (
  filters: IProductFilters,
  paginationOption: IPaginationOption
): Promise<IGenericDataWithMeta<IProduct[]>> => {
  const { searchTerm, ...filterFields } = filters

  const andConditions = []
  if (searchTerm) {
    andConditions.push({
      $or: PRODUCT_SEARCH_FIELDS.map(field => ({
        [field]: new RegExp(searchTerm, 'i'),
      })),
    })
  }

  if (Object.keys(filterFields).length) {
    const fieldConditions = Object.entries(filterFields).map(([key, value]) => {
      if (key === 'minPrice') {
        return {
          sellingPrice: {
            $gte: value,
          },
        }
      } else if (key === 'maxPrice') {
        return {
          sellingPrice: {
            $lte: value,
          },
        }
      } else if (key === 'minRating') {
        return {
          rating: {
            $gte: value,
          },
        }
      } else if (key === 'maxRating') {
        return {
          rating: {
            $lte: value,
          },
        }
      } else if (
        key === 'category' ||
        key === 'type' ||
        key === 'style' ||
        key === 'fabric'
      ) {
        const values = Array.isArray(value) ? value : [value]
        return {
          $or: values.map(fieldValue => ({ [key]: fieldValue })),
        }
      } else {
        return {
          [key]: value,
        }
      }
    })

    andConditions.push({
      $and: fieldConditions,
    })
  }

  const whereCondition = andConditions.length ? { $and: andConditions } : {}

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper(paginationOption)

  const sortCondition: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder
  }

  const result = await productModel
    .find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit as number)
  const total = await productModel.countDocuments()

  const responseData = {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }

  return responseData
}

const getProductById = async (productId: string): Promise<IProduct> => {
  const product = await productModel.findOne({ _id: productId })

  if (!product) throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found')

  return product
}

const getProductByPath = async (path: string): Promise<IProduct> => {
  const product = await productModel.findOne({ path })

  if (!product) throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found')
  return product
}

const getProductBySku = async (sku: string): Promise<IProduct> => {
  const product = await productModel.findOne({ sku })
  if (!product) throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found')
  return product
}

const deleteProduct = async (productId: string): Promise<IProduct> => {
  const product = await productModel.findOne({ _id: productId })
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found')
  }

  const deletedProduct = await productModel.findByIdAndDelete(productId)
  if (!deletedProduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product deletion failed')
  }

  return deletedProduct
}

export const ProductService = {
  createProduct,
  updateProduct,
  getAllProduct,
  getProductById,
  getProductByPath,
  getProductBySku,
  deleteProduct,
}
