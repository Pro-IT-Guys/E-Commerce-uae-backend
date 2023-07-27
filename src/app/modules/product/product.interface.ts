import { Model, Schema } from 'mongoose'

export interface IProduct {
  name: string
  path: string
  sku: string
  frontImage: string
  backImage: string
  restImage?: string[]
  buyingPrice: number
  sellingPrice: number
  discountPrice: number
  description: string
  metaDescription: string
  quantity: number
  category: string
  color: string[]
  size: string[]
  tag: string[]
  review?: Schema.Types.ObjectId[] // productReview id ref
  type: string[]
  style: string
  fabric: string
  isVisibleOffer: boolean
}

export interface IProductModel extends Model<IProduct> {
  // eslint-disable-next-line no-unused-vars
  getProductById(id: string): Promise<IProduct>
}

export interface IProductFilters {
  searchTerm?: string
}
