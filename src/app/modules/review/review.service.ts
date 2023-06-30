import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IReview } from './review.interface'
import reviewModel from './review.model'
import mongoose from 'mongoose'
import productModel from '../product/product.model'

const createReview = async (review: IReview): Promise<IReview> => {
  const isExist = await reviewModel.findOne({
    userId: review.userId,
    productId: review.productId,
  })
  if (isExist)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You already reviewed this product`
    )

  let newReview = null

  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    newReview = await reviewModel.create(review)
    await newReview.populate('userId')

    if (!newReview)
      throw new ApiError(httpStatus.BAD_REQUEST, `Review not submitted`)

    //   update the product review
    const product = await productModel.findById(review.productId)
    if (!product)
      throw new ApiError(httpStatus.BAD_REQUEST, `Product not found`)

    //   keep the previous review and add the new review in the product review
    const newProductReview = [...(product.review || []), newReview._id]
    const updatedProduct = await productModel.findByIdAndUpdate(
      review.productId,
      { review: newProductReview },
      { new: true }
    )
    if (!updatedProduct)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Something went wrong while submitting review`
      )

    session.commitTransaction()
    session.endSession()
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }

  return newReview
}

export const ReviewService = {
  createReview,
}
