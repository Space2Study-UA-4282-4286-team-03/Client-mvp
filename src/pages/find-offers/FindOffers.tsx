import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import PageWrapper from '~/components/page-wrapper/PageWrapper'
import SearchAutocomplete from '~/components/search-autocomplete/SearchAutocomplete'
import TitleWithDescription from '~/components/title-with-description/TitleWithDescription'
import OfferRequestBlock from '~/containers/find-offer/offer-request-block/OfferRequestBlock'
import AsyncAutocomplete from '~/components/async-autocomlete/AsyncAutocomplete'
import DirectionLink from '~/components/direction-link/DirectionLink'
import AppToolbar from '~/components/app-toolbar/AppToolbar'

import useBreakpoints from '~/hooks/use-breakpoints'
import useLoadMore from '~/hooks/use-load-more'

import { offerService } from '~/services/offer-service'
import { categoryService } from '~/services/category-service'
import { subjectService } from '~/services/subject-service'

import { getScreenBasedLimit } from '~/utils/helper-functions'
import { authRoutes } from '~/router/constants/authRoutes'
import { itemsLoadLimit } from '~/constants'
import { styles } from './FindOffers.styles'
import {
  SizeEnum,
  Offer,
  CategoryNameInterface,
  SubjectNameInterface
} from '~/types'

const FindOffers = () => {
  const { t } = useTranslation()
  const breakpoints = useBreakpoints()
  const [searchParams, setSearchParams] = useSearchParams()
  const [match, setMatch] = useState<string>('')
  const [categoryId, setCategoryId] = useState(
    searchParams.get('categoryId') ?? ''
  )
  const [subjectId, setSubjectId] = useState(
    searchParams.get('subjectId') ?? ''
  )
  const [categoryName, setCategoryName] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const cardsLimit = getScreenBasedLimit(breakpoints, itemsLoadLimit)

  const params = useMemo(
    () => ({
      title: match || undefined,
      categoryId: categoryId || undefined,
      subjectId: subjectId || undefined
    }),
    [match, categoryId, subjectId]
  )

  const getOffers = useCallback(
    (params?: { title?: string; categoryId?: string; subjectId?: string }) =>
      offerService.getOffers(params),
    []
  )

  const {
    data: offers,
    loading: offersLoading,
    resetData
  } = useLoadMore<
    Offer,
    { title?: string; categoryId?: string; subjectId?: string }
  >({
    service: getOffers,
    limit: cardsLimit,
    params
  })

  const onCategoryChange = (
    _: React.SyntheticEvent,
    value: CategoryNameInterface | null
  ) => {
    const newId = value?._id ?? ''
    searchParams.set('categoryId', newId)
    setSearchParams(searchParams)
    setCategoryId(newId)
    setCategoryName(value?.name ?? '')
    setSubjectId('')
    setSubjectName('')
    resetData()
  }

  const onResponseCategory = (response: CategoryNameInterface[]) => {
    const category = response.find((option) => option._id === categoryId)
    setCategoryName(category?.name ?? '')
  }

  const autoCompleteCategories = (
    <AsyncAutocomplete
      axiosProps={{ onResponse: onResponseCategory }}
      labelField='name'
      onChange={onCategoryChange}
      service={categoryService.getCategoriesNames}
      sx={styles.categoryInput}
      textFieldProps={{ label: t('breadCrumbs.categories') }}
      value={categoryId}
      valueField='_id'
    />
  )

  const onSubjectChange = (
    _: React.SyntheticEvent,
    value: SubjectNameInterface | null
  ) => {
    const newId = value?._id ?? ''
    searchParams.set('subjectId', newId)
    setSearchParams(searchParams)
    setSubjectId(newId)
    setSubjectName(value?.name ?? '')
    resetData()
  }

  const onResponseSubject = (response: SubjectNameInterface[]) => {
    const subject = response.find((option) => option._id === subjectId)
    setSubjectName(subject?.name ?? '')
  }

  const fetchSubjects = useCallback(
    () => subjectService.getSubjectsNames(categoryId),
    [categoryId]
  )

  const autoCompleteSubjects = (
    <AsyncAutocomplete
      axiosProps={{ onResponse: onResponseSubject }}
      labelField='name'
      onChange={onSubjectChange}
      service={fetchSubjects}
      sx={styles.categoryInput}
      textFieldProps={{ label: t('breadCrumbs.subjects') }}
      value={subjectId}
      valueField='_id'
    />
  )

  return (
    <PageWrapper>
      <OfferRequestBlock />
      <TitleWithDescription
        description={t('findOffers.titleWithDescription.description')}
        style={styles.titleWithDescription}
        title={`${t('findOffers.titleWithDescription.title')} ${categoryName} ${subjectName}`}
      />
      <Box sx={styles.navigation}>
        <DirectionLink
          before={<ArrowBackIcon fontSize={SizeEnum.Small} />}
          linkTo={authRoutes.categories.path}
          title={t('findOffers.backToAllCategories')}
        />
      </Box>
      <AppToolbar sx={styles.searchToolbar}>
        {!breakpoints.isMobile && (
          <>
            {autoCompleteCategories}
            {autoCompleteSubjects}
            <SearchAutocomplete
              loading={offersLoading}
              onSearchChange={resetData}
              options={offers.map((o) => o.title)}
              search={match}
              setSearch={setMatch}
              textFieldProps={{ label: t('findOffers.searchToolbar.label') }}
            />
          </>
        )}
      </AppToolbar>
    </PageWrapper>
  )
}

export default FindOffers
