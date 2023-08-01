import productModel from '../modules/product/product.model'

export const generateProductSKU = async (category: string) => {
  const lastProduct = await productModel
    .find()
    .sort({ createdAt: -1 })
    .limit(1)
    .lean()

  const lastProductSKU = lastProduct[0]?.sku || ''

  const match = lastProductSKU.match(/(\d+)$/)
  const lastNumber = match ? parseInt(match[1]) : 0
  const newNumber = lastNumber + 1
  const newSku = `AY-${category.split('')[0].toUpperCase()}-${newNumber
    .toString()
    .padStart(3, '0')}`

  return newSku
}
