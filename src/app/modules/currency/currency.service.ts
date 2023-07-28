import { ICurrency } from './currency.interface'
import currencyModel from './currency.model'

const createCurrency = async (currency: ICurrency) => {
  const existingCurrency = await currencyModel.findOne()
  if (existingCurrency) {
    existingCurrency.convertRate = currency.convertRate
    await existingCurrency.save()
    return existingCurrency
  }
  const newCurrency = new currencyModel(currency)
  await newCurrency.save()
  return newCurrency
}

const getCurrency = async () => {
  const existingCurrency = await currencyModel.findOne()
  return existingCurrency
}

export const CurrencyServices = {
  createCurrency,
  getCurrency,
}
