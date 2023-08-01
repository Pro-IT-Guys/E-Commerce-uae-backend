import { Schema, model } from 'mongoose'
import { IProduct, IProductModel } from './product.interface'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    frontImage: {
      type: String,
      required: true,
    },
    backImage: {
      type: String,
      required: true,
    },
    restImage: {
      type: [String],
    },
    buyingPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    color: {
      type: [String],
      required: true,
    },
    size: {
      type: [String],
      required: true,
    },
    tag: {
      type: [String],
      required: true,
    },
    brand: {
      type: String,
    },
    review: {
      type: [Schema.Types.ObjectId],
    },
    type: {
      type: [String],
      required: true,
    },
    style: {
      type: String,
      required: true,
    },
    fabric: {
      type: String,
      required: true,
    },
    isVisibleOffer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

productSchema.pre('save', async function (next) {
  const product = this as IProduct
  const isExist = await productModel.findOne({ path: product.path }).exec()

  if (isExist !== null && Object.keys(isExist).length !== 0) {
    throw new ApiError(httpStatus.CONFLICT, 'Product path already exists')
  }
  next()
})

productSchema.pre('findOneAndUpdate', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product = this as any

  if (product._update?.path) {
    const samePath = await productModel.findOne({
      path: product._update?.path,
    })

    if (samePath) {
      throw new ApiError(httpStatus.CONFLICT, 'Product path already exists')
    }
  }
  next()
})

const productModel = model<IProduct, IProductModel>('Product', productSchema)

export default productModel
