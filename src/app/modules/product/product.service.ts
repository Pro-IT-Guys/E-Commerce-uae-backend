import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IProduct, IProductFilters } from './product.interface'
import productModel from './product.model'
import generateUniqueSKU from '../../helpers/generateUniqueSKU'
import {
  IGenericDataWithMeta,
  IPaginationOption,
} from '../../../interfaces/sharedInterface'
import { PRODUCT_SEARCH_FIELDS } from './product.constant'
import paginationHelper from '../../helpers/paginationHelper'
import { SortOrder } from 'mongoose'
import brandModel from '../productBrand/brand.model'
import typeModel from '../productType/type.model'

const createProduct = async (productData: IProduct): Promise<IProduct> => {
  const isExist = await productModel.findOne({ path: productData.path })
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product already exist')
  }

  let sku = generateUniqueSKU(6)
  while (await productModel.findOne({ sku })) {
    sku = generateUniqueSKU(6) // Check if the generated SKU already exists in the database. If it does, generate a new one.
  }

  const product = (
    await productModel.create({
      ...productData,
      sku,
    })
  ).populate([
    {
      path: 'brand',
    },
    {
      path: 'type',
    },
  ])

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

  const product = await productModel
    .findOneAndUpdate({ _id: productId }, productData, {
      new: true,
    })
    .populate([
      {
        path: 'brand',
      },
      {
        path: 'type',
      },
    ])

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
    const brand = await brandModel.findOne(
      { name: { $regex: new RegExp(searchTerm, 'i') } },
      '_id'
    )
    const type = await typeModel.findOne(
      { name: { $regex: new RegExp(searchTerm, 'i') } },
      '_id'
    )

    const brandId = brand ? brand._id : null
    const typeId = type ? type._id : null

    andConditions.push({
      $or: PRODUCT_SEARCH_FIELDS.map(field => {
        if (field === 'brand') {
          return {
            brand: brandId,
          }
        } else if (field === 'type') {
          return {
            type: typeId,
          }
        } else {
          return {
            [field]: new RegExp(searchTerm, 'i'),
          }
        }
      }),
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
    .populate('brand', 'name') // Populate brand field and select only the name field
    .populate('type', 'name') // Populate type field and select only the name field
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

export const ProductService = {
  createProduct,
  updateProduct,
  getAllProduct,
}