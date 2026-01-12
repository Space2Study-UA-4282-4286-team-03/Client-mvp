import { axiosClient } from '~/plugins/axiosClient'
import { AxiosResponse } from 'axios'

import { URLs } from '~/constants/request'
import { ItemsWithCount, SubjectInterface, SubjectNameInterface } from '~/types'
import { createUrlPath } from '~/utils/helper-functions'
import { subjectsMock } from '~/containers/tutor-home-page/subjects-step/constants'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const subjectService = {
  getSubjects: (
    params?: Pick<SubjectInterface, 'name'>,
    categoryId?: string
  ): Promise<AxiosResponse<ItemsWithCount<SubjectInterface>>> => {
    const category = createUrlPath(URLs.categories.get, categoryId)
    return axiosClient.get(`${category}${URLs.subjects.get}`, { params })
  },
  getSubjectsNames: async (
    categoryId: string | null
  ): Promise<SubjectNameInterface[]> => {
    if (!categoryId) return []
    await delay(1000)
    return subjectsMock
      .filter((item) => item.category === categoryId)
      .map((item) => ({
        _id: item.value,
        name: item.title
      }))
    //const category = createUrlPath(URLs.categories.get, categoryId)
    //return axiosClient.get(`${category}${URLs.subjects.getNames}`)
  }
}
