import { Schema, model } from 'mongoose'
import { ICurrency } from './currency.interface'

const CurrencySchema = new Schema<ICurrency>(
  {
    convertRate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

const currencyModel = model('Currency', CurrencySchema)
export default currencyModel
