import { axiosClient } from '~/plugins/axiosClient'
import { AxiosResponse } from 'axios'
import { ItemsWithCount, Offer } from '~/types'
import { URLs } from '~/constants/request'

export const offerService = {
  getOffers: (params?: {
    title?: string
    categoryId?: string
    subjectId?: string
    limit?: number
    skip?: number
  }): Promise<AxiosResponse<ItemsWithCount<Offer>>> => {
    return axiosClient.get<ItemsWithCount<Offer>>(URLs.offers.get, { params })
  }
}
