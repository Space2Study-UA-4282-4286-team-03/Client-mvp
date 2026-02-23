import { useTranslation } from 'react-i18next'
import PageWrapper from '~/components/page-wrapper/PageWrapper'
import TitleWithDescription from '~/components/title-with-description/TitleWithDescription'
import OfferRequestBlock from '~/containers/find-offer/offer-request-block/OfferRequestBlock'
import { styles } from './FindOffers.styles'
import Box from '@mui/material/Box'
import DirectionLink from '~/components/direction-link/DirectionLink'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { SizeEnum } from '~/types'
import { authRoutes } from '~/router/constants/authRoutes'
import AsyncAutocomplete from '~/components/async-autocomlete/AsyncAutocomplete'
import { useState } from 'react'
import useBreakpoints from '~/hooks/use-breakpoints'
import { useSearchParams } from 'react-router-dom'
import { categoryService } from '~/services/category-service'
import { subjectService } from '~/services/subject-service'
import { CategoryNameInterface, SubjectNameInterface } from '~/types'
import AppToolbar from '~/components/app-toolbar/AppToolbar'
import SearchAutocomplete from '~/components/search-autocomplete/SearchAutocomplete'

const FindOffers = () => {
  const [match, setMatch] = useState<string>('')
  const [categoryName, setCategoryName] = useState<string>('')
  const [subjectName, setSubjectName] = useState<string>('')

  const { t } = useTranslation()
  const breakpoints = useBreakpoints()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryId = searchParams.get('categoryId') ?? ''
  const subjectId = searchParams.get('subjectId') ?? ''
  const onCategoryChange = (
    _: React.SyntheticEvent,
    value: CategoryNameInterface | null
  ) => {
    searchParams.set('categoryId', value?._id ?? '')
    setCategoryName(value?.name ?? '')
    setSearchParams(searchParams)
  }
  const onSubjectChange = (
    _: React.SyntheticEvent,
    value: SubjectNameInterface | null
  ) => {
    searchParams.set('subjectId', value?._id ?? '')
    setSubjectName(value?.name ?? '')
    setSearchParams(searchParams)
  }

  const onResponseCategory = (response: CategoryNameInterface[]) => {
    const category = response.find((option) => option._id === categoryId)
    setCategoryName(category?.name ?? '')
  }
  const onResponseSubject = (response: SubjectNameInterface[]) => {
    const subject = response.find((option) => option._id === subjectId)
    setSubjectName(subject?.name ?? '')
  }
  const autoCompleteCategories = (
    <AsyncAutocomplete
      axiosProps={{ onResponse: onResponseCategory }}
      labelField='name'
      onChange={onCategoryChange}
      service={categoryService.getCategoriesNames}
      sx={styles.categoryInput}
      textFieldProps={{
        label: t('breadCrumbs.categories')
      }}
      value={categoryId}
      valueField='_id'
    />
  )
  const autoCompleteSubjects = (
    <AsyncAutocomplete
      axiosProps={{ onResponse: onResponseSubject }}
      labelField='name'
      onChange={onSubjectChange}
      service={() => subjectService.getSubjectsNames(categoryId)}
      sx={styles.categoryInput}
      textFieldProps={{
        label: t('breadCrumbs.subjects')
      }}
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
              loading={false}
              onFocus={() => {}}
              onSearchChange={() => {}}
              options={[]}
              search={match}
              setSearch={setMatch}
              textFieldProps={{
                label: t('findOffers.searchToolbar.label')
              }}
            />
          </>
        )}
      </AppToolbar>
    </PageWrapper>
  )
}

export default FindOffers
