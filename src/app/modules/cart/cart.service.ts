import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { ICart } from './cart.interface'
import cartModel from './cart.model'

const addToCart = async (cartData: ICart): Promise<ICart> => {
  const isExist = await cartModel.findOne({ userId: cartData.userId })
  if (isExist) throw new ApiError(httpStatus.BAD_REQUEST, 'Cart already exists')

  const cart = await cartModel.create(cartData)
  await cart.populate('product.productId')

  if (!cart)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to add items to cart')

  return cart
}

const updateCart = async (
  cartId: string,
  cartData: Partial<ICart>
): Promise<ICart> => {
  const isExist = await cartModel.findById(cartId)
  if (!isExist) throw new ApiError(httpStatus.BAD_REQUEST, 'Cart not found')

  const existingCart = await cartModel
    .findById(cartId)
    .populate('product.productId')

  if (existingCart) {
    if (cartData.product) {
      const updatedProduct = cartData.product[0] // passing only one product at a time

      // Check if the existing cart already contains the same productId
      const existingProductIndex = existingCart.product.findIndex(item =>
        item.productId.equals(updatedProduct.productId)
      )

      if (existingProductIndex !== -1) {
        // If productId already exists, update the quantity
        existingCart.product[existingProductIndex].quantity =
          updatedProduct.quantity
      } else {
        // If productId is different, add the new product to the array
        existingCart.product.push(updatedProduct)
      }

      const cart = await cartModel
        .findByIdAndUpdate(
          cartId,
          { product: existingCart.product },
          { new: true }
        )
        .populate('product.productId')

      if (!cart)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update cart')

      return cart
    }
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Cart not found')
}

const bulkUpdateCart = async (
  cartId: string,
  cartData: Partial<ICart>
): Promise<ICart> => {
  const isExist = await cartModel.findById(cartId)
  if (!isExist) throw new ApiError(httpStatus.BAD_REQUEST, 'Cart not found')

  const updatedCart = await cartModel.findByIdAndUpdate(
    cartId,
    { $set: { product: cartData.product } },
    { new: true }
  )

  if (!updatedCart)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update cart')

  return updatedCart
}

const getCartByUserId = async (userId: string): Promise<ICart> => {
  const cart = await cartModel.findOne({ userId }).populate('product.productId')

  if (!cart) throw new ApiError(httpStatus.BAD_REQUEST, 'Cart not found')
  return cart
}

const getCartByCartId = async (cartId: string): Promise<ICart> => {
  const cart = await cartModel.findById(cartId).populate('product.productId')
  if (!cart) throw new ApiError(httpStatus.BAD_REQUEST, 'Cart not found')
  return cart
}

const deleteCart = async (cartId: string): Promise<ICart> => {
  const cart = await cartModel.findByIdAndDelete(cartId)
  if (!cart) throw new ApiError(httpStatus.BAD_REQUEST, 'Cart not found')
  return cart
}

const deleteAProductFromCart = async (
  cartId: string,
  productId: string
): Promise<ICart> => {
  const cart = await cartModel.findById(cartId)
  if (!cart) throw new ApiError(httpStatus.BAD_REQUEST, 'Cart not found')

  const existingCart = await cartModel
    .findById(cartId)
    .populate('product.productId')

  if (existingCart) {
    const existingProductIndex = existingCart.product.findIndex(item =>
      item.productId.equals(productId)
    )

    if (existingProductIndex !== -1) {
      existingCart.product.splice(existingProductIndex, 1)
    }

    const cart = await cartModel
      .findByIdAndUpdate(
        cartId,
        { product: existingCart.product },
        { new: true }
      )
      .populate('product.productId')

    if (!cart)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update cart')

    return cart
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Cart not found')
}

const updateProductQuantity = async (
  cartId: string,
  productId: string,
  quantity: number
): Promise<ICart> => {
  const existingCart = await cartModel
    .findById(cartId)
    .populate('product.productId')
  if (!existingCart)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart not found')

  // Check if the existing cart already contains the same productId
  const existingProductIndex = existingCart.product.findIndex(item =>
    item.productId.equals(productId)
  )

  if (existingProductIndex !== -1) {
    // If productId already exists, update the quantity
    existingCart.product[existingProductIndex].quantity = quantity
  }

  const cart = await cartModel.findByIdAndUpdate(
    cartId,
    { product: existingCart.product },
    { new: true }
  )

  if (!cart) throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update cart')

  return cart
}

export const CartService = {
  addToCart,
  updateCart,
  bulkUpdateCart,
  getCartByUserId,
  getCartByCartId,
  deleteCart,
  deleteAProductFromCart,
  updateProductQuantity,
}
