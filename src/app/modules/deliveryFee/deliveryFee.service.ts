/* eslint-disable @typescript-eslint/no-explicit-any */
import { State, City } from 'country-state-city'
import { countriesWithCodes } from './deliveryFee.constant'
import { ICountry, IState } from './deliveryFee.interface'
import deliveryFeeModel from './deliveryFee.model'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'

const CreateFee = async (): Promise<ICountry[]> => {
  const data: ICountry[] = []

  for (const { country, phoneCode, code } of countriesWithCodes) {
    const states: IState[] = []

    for (const state of State.getStatesOfCountry(code)) {
      const cities: any = City.getCitiesOfState(code, state.isoCode)

      if (cities.length > 0) {
        const delivery_fee = 10
        const stateCities = cities.map((city: any) => ({
          city_name: city.name,
          delivery_fee,
        }))
        states.push({
          state_name: state.name,
          state_code: state.isoCode,
          cities: stateCities,
        })
      } else {
        const delivery_fee = 10
        states.push({
          state_name: state.name,
          state_code: state.isoCode,
          delivery_fee,
        })
      }
    }

    data.push({ country, country_code: code, phoneCode, states })
  }

  if (data.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No data found')
  }

  const deliveryFeeData = await deliveryFeeModel.create(data)
  if (!deliveryFeeData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Delivery fee not created')
  }
  return deliveryFeeData
}

const updateFee = async (
  id: string,
  dataPayload: {
    state_code: string
    city_name: string | undefined
    delivery_fee: number
  }
): Promise<ICountry[]> => {
  const { state_code, city_name, delivery_fee } = dataPayload

  // Find the country and its corresponding states based on the provided id
  const country = await deliveryFeeModel.findById(id)
  if (!country) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Country not found')
  }

  // Find the matching state based on the provided state_code
  const state = country.states.find(state => state.state_code === state_code)
  if (!state) {
    throw new ApiError(httpStatus.NOT_FOUND, 'State not found')
  }

  // If city_name is provided, update the delivery_fee for the matching city
  if (city_name) {
    if (state.cities) {
      const city = state.cities.find(city => city.city_name === city_name)
      if (!city) {
        throw new ApiError(httpStatus.NOT_FOUND, 'City not found')
      }
      city.delivery_fee = delivery_fee

      // Update the delivery_fee in the database
      await deliveryFeeModel.findOneAndUpdate(
        {
          _id: id,
          'states.state_code': state_code,
          'states.cities.city_name': city_name,
        },
        {
          $set: {
            'states.$[outer].cities.$[inner].delivery_fee': delivery_fee,
          },
        },
        {
          arrayFilters: [
            { 'outer.state_code': state_code },
            { 'inner.city_name': city_name },
          ],
        }
      )

      // Return the delivery_fee and the updated city
      return [
        {
          country: country.country,
          country_code: country.country_code,
          phoneCode: country.phoneCode,
          states: [
            {
              state_name: state.state_name,
              state_code: state.state_code,
              cities: [city],
            },
          ],
        },
      ]
    } else {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Cities not available for the state'
      )
    }
  } else {
    // If city_name is not provided, update the delivery_fee for the state
    state.delivery_fee = delivery_fee

    // Update the delivery_fee in the database
    await deliveryFeeModel.findOneAndUpdate(
      { _id: id, 'states.state_code': state_code },
      { $set: { 'states.$.delivery_fee': delivery_fee } }
    )

    // Return the delivery_fee and the state
    return [
      {
        country: country.country,
        country_code: country.country_code,
        phoneCode: country.phoneCode,
        states: [state],
      },
    ]
  }
}

const getAllFees = async (): Promise<ICountry[]> => {
  const data = await deliveryFeeModel.find()
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No data found')
  }
  return data
}

const getFeeOfLocation = async (
  countryId: string,
  stateCode: string,
  city_name?: string
): Promise<{
  country: string
  delivery_fee: number
  city_name?: string
  state_name: string
}> => {
  const fullData = await deliveryFeeModel.findById(countryId)
  if (!fullData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Country not found')
  }

  const state = fullData.states.find(state => {
    return state.state_code === stateCode
  })
  if (!state) {
    throw new ApiError(httpStatus.NOT_FOUND, 'State not found')
  }

  if (state.cities?.length && city_name) {
    const city = state.cities.find(city => city.city_name === city_name)
    if (!city) {
      throw new ApiError(httpStatus.NOT_FOUND, 'City not found')
    }
    return {
      country: fullData.country,
      delivery_fee: city.delivery_fee ?? 0,
      city_name: city.city_name,
      state_name: state.state_name,
    }
  } else {
    return {
      country: fullData.country,
      delivery_fee: state.delivery_fee ?? 0,
      state_name: state.state_name,
    }
  }
}

export const DeliveryFeeService = {
  CreateFee,
  updateFee,
  getAllFees,
  getFeeOfLocation,
}
