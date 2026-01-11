import { useCallback, useEffect, useMemo, useState } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { useTranslation } from 'react-i18next'

import AppTextField from '~/components/app-text-field/AppTextField'
import AppTextArea from '~/components/app-text-area/AppTextArea'
import AsyncAutocomplete from '~/components/async-autocomlete/AsyncAutocomplete'

import { styles } from '~/containers/tutor-home-page/general-info-step/GeneralInfoStep.styles'
import { useStepContext } from '~/context/step-context'
import { useAppSelector } from '~/hooks/use-redux'
import useAxios from '~/hooks/use-axios'
import { userService } from '~/services/user-service'
import { locationsService } from '~/services/locations-service'
import { nameField, textField } from '~/utils/validations/common'
import img from '~/assets/img/tutor-home-page/become-tutor/general-info.svg'

const GeneralInfoStep = ({
  btnsBox,
  stepLabel,
  isUserFetched,
  setIsUserFetched
}) => {
  const { t } = useTranslation()
  const { stepData, handleStepData } = useStepContext()
  const { userId, userRole } = useAppSelector((state) => state.appMain)

  const initial = useMemo(() => {
    const data = stepData?.[stepLabel]?.data || {}
    return {
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      country: data.country ?? null,
      city: data.city ?? null,
      professionalSummary: data.professionalSummary ?? ''
    }
  }, [stepLabel, stepData])

  const [data, setData] = useState(initial)
  const [errors, setErrors] = useState({})

  const validate = useCallback((value) => {
    return {
      firstName: nameField(value.firstName),
      lastName: nameField(value.lastName),
      professionalSummary: textField(0, 70)(value.professionalSummary || '')
    }
  }, [])

  const fetchUser = useCallback(() => {
    return userService.getUserById(userId, userRole)
  }, [userId, userRole])

  const { response: userResp } = useAxios({
    service: fetchUser,
    fetchOnMount: true,
    defaultResponse: null
  })

  useEffect(() => {
    if (userResp && !isUserFetched) {
      const user = userResp
      const pref = {
        ...data,
        firstName: user.firstName || data.firstName,
        lastName: user.lastName || data.lastName,
        country: user.address?.country ?? data.country,
        city: user.address?.city ?? data.city,
        professionalSummary:
          user.professionalSummary ?? data.professionalSummary
      }
      const errs = validate(pref)
      setData(pref)
      setErrors(errs)
      handleStepData(stepLabel, pref, errs)
      setIsUserFetched && setIsUserFetched(true)
    }
  }, [
    userResp,
    isUserFetched,
    stepLabel,
    validate,
    handleStepData,
    setIsUserFetched,
    data
  ])

  const handleChange = (key) => (e) => {
    const value = e?.target ? e.target.value : e
    const next = { ...data, [key]: value }
    const nextErrors = validate(next)
    setData(next)
    setErrors(nextErrors)
    handleStepData(stepLabel, next, nextErrors)
  }

  const handleCountryChange = (_e, value) => {
    const next = { ...data, country: value?.id ?? null, city: null }
    const nextErrors = validate(next)
    setData(next)
    setErrors(nextErrors)
    handleStepData(stepLabel, next, nextErrors)
  }
  const fetchCountries = useCallback(() => locationsService.getCountries(), [])

  const handleCityChange = (_e, value) => {
    const next = { ...data, city: value?.id || null }
    const nextErrors = validate(next)
    setData(next)
    setErrors(nextErrors)
    handleStepData(stepLabel, next, nextErrors)
  }

  const fetchCities = useCallback(() => {
    if (!data.country) return Promise.resolve([])
    return locationsService.getCitiesByCountry(data.country)
  }, [data.country])

  return (
    <Box sx={styles.container}>
      <Box sx={styles.imgContainer}>
        <Box component='img' src={img} sx={styles.img} />
      </Box>
      <Box sx={styles.contentBox}>
        <Typography sx={{ mb: 3 }} variant='body1'>
          {t('step.noteLabel.generalDescription')}
        </Typography>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid item sm={6} xs={12}>
            <AppTextField
              errorMsg={t(errors.firstName)}
              label={`${t('common.labels.firstName')} *`}
              onChange={handleChange('firstName')}
              sx={{ width: '100%' }}
              value={data.firstName}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <AppTextField
              errorMsg={t(errors.lastName)}
              label={`${t('common.labels.lastName')} *`}
              onChange={handleChange('lastName')}
              sx={{ width: '100%' }}
              value={data.lastName}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <AsyncAutocomplete
              data-testid='autocomplete-country'
              fetchCondition
              getOptionLabel={(option) => option.name}
              onChange={handleCountryChange}
              service={fetchCountries}
              textFieldProps={{
                label: t('common.labels.country')
              }}
              value={data.country ? String(data.country) : null}
              valueField='id'
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <AsyncAutocomplete
              data-testid='autocomplete-city'
              disabled={!data.country}
              fetchCondition={Boolean(data.country)}
              getOptionLabel={(option) => option.name}
              key={data.country}
              onChange={handleCityChange}
              service={fetchCities}
              textFieldProps={{
                label: t('common.labels.city')
              }}
              value={data.city ? String(data.city) : null}
              valueField='id'
            />
          </Grid>
          <Grid item xs={12}>
            <AppTextArea
              errorMsg={t(errors.professionalSummary)}
              fullWidth
              label={t('becomeTutor.generalInfo.textFieldLabel')}
              maxLength={70}
              onChange={handleChange('professionalSummary')}
              sx={{
                '& [data-text-length]': {
                  left: 0,
                  right: 'auto'
                }
              }}
              textFieldProps={{ inputProps: { maxLength: 70 } }}
              value={data.professionalSummary}
            />
          </Grid>
          <Grid item xs={12}>
            <label>{t('step.noteLabel.InputsNote')}</label>
          </Grid>
          <Grid item xs={12}>
            {btnsBox}
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default GeneralInfoStep
