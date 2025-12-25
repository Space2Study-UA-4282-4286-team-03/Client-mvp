import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

import useInputVisibility from '~/hooks/use-input-visibility'
import AppTextField from '~/components/app-text-field/AppTextField'
import AppButton from '~/components/app-button/AppButton'

import { styles } from '~/containers/guest-home-page/tutor-signup-form/TutorSignupForm.styles'
import { RootState } from '~/redux/store'

interface StudentSignupFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

interface StudentSignupFormErrors {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: string
}

interface StudentSignupFormProps {
  handleSubmit: (event: React.FormEvent<HTMLDivElement>) => void
  handleChange: (
    key: keyof StudentSignupFormData
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (
    key: keyof StudentSignupFormData
  ) => (event: React.FocusEvent<HTMLInputElement>) => void
  data: StudentSignupFormData
  errors: StudentSignupFormErrors
}

const StudentSignupForm: FC<StudentSignupFormProps> = ({
  handleSubmit,
  handleChange,
  handleBlur,
  data,
  errors
}) => {
  const { inputVisibility: passwordVisibility, showInputText: showPassword } =
    useInputVisibility(errors.password)
  const {
    inputVisibility: confirmPasswordVisibility,
    showInputText: showConfirmPassword
  } = useInputVisibility(errors.confirmPassword)

  const { authLoading } = useSelector((state: RootState) => state.appMain)
  const { t } = useTranslation()

  return (
    <Box component='form' onSubmit={handleSubmit} sx={styles.form}>
      <Box sx={styles.nameRow}>
        <AppTextField
          autoFocus
          data-testid='firstName'
          errorMsg={t(errors.firstName)}
          label={t('common.labels.firstName')}
          onBlur={handleBlur('firstName')}
          onChange={handleChange('firstName')}
          required
          size='small'
          sx={styles.nameField}
          value={data.firstName}
        />
        <AppTextField
          data-testid='lastName'
          errorMsg={t(errors.lastName)}
          label={t('common.labels.lastName')}
          onBlur={handleBlur('lastName')}
          onChange={handleChange('lastName')}
          required
          size='small'
          sx={styles.nameField}
          value={data.lastName}
        />
      </Box>

      <AppTextField
        data-testid='email'
        errorMsg={t(errors.email)}
        fullWidth
        label={t('common.labels.email')}
        onBlur={handleBlur('email')}
        onChange={handleChange('email')}
        required
        size='small'
        sx={{ mb: '5px' }}
        type='email'
        value={data.email}
      />

      <AppTextField
        InputProps={passwordVisibility}
        data-testid='password'
        errorMsg={t(errors.password)}
        fullWidth
        label={t('common.labels.password')}
        onBlur={handleBlur('password')}
        onChange={handleChange('password')}
        required
        size='small'
        sx={{ mb: '5px' }}
        type={showPassword ? 'text' : 'password'}
        value={data.password}
      />

      <AppTextField
        InputProps={confirmPasswordVisibility}
        data-testid='confirmPassword'
        errorMsg={t(errors.confirmPassword)}
        fullWidth
        label={t('common.labels.confirmPassword')}
        onBlur={handleBlur('confirmPassword')}
        onChange={handleChange('confirmPassword')}
        required
        size='small'
        type={showConfirmPassword ? 'text' : 'password'}
        value={data.confirmPassword}
      />

      <Box sx={styles.termsBox}>
        <Checkbox
          checked={data.agreeToTerms}
          data-testid='agreeToTerms'
          onChange={handleChange('agreeToTerms')}
          size='small'
        />
        <Box sx={styles.termsText}>
          <Typography variant='body2'>{t('signup.iAgree')}</Typography>
          <Typography sx={styles.termsLink} variant='body2'>
            {t('common.labels.terms')}
          </Typography>
          <Typography variant='body2'>{t('signup.and')}</Typography>
          <Typography sx={styles.termsLink} variant='body2'>
            {t('common.labels.privacyPolicy')}
          </Typography>
        </Box>
      </Box>

      <AppButton
        disabled={!data.agreeToTerms}
        loading={authLoading}
        sx={styles.signupButton}
        type='submit'
      >
        {t('common.labels.signup')}
      </AppButton>
    </Box>
  )
}

export default StudentSignupForm
