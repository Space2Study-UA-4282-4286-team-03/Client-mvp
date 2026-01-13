import { axiosClient } from '~/plugins/axiosClient'
import { URLs } from '~/constants/request'

export const locationsService = {
  getCountries: (params?: Record<string, string>) =>
    axiosClient.get(URLs.locations.countries, { params }),
  getCitiesByCountry: (
    countryId: string | number,
    params?: Record<string, string>
  ) => axiosClient.get(URLs.locations.citiesByCountry(countryId), { params })
}
