import { useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import GoogleLogin from '~/containers/guest-home-page/google-login/GoogleLogin'
import StudentSignupForm from '~/containers/guest-home-page/student-signup-form/StudentSignupForm'
import NotificationModal from '~/containers/guest-home-page/notification-modal/NotificationModal'
import useForm from '~/hooks/use-form'
import { useSignUpMutation } from '~/services/auth-service'
import { useModalContext } from '~/context/modal-context'
import { useSnackBarContext } from '~/context/snackbar-context'
import studentImg from '~/assets/img/signup-dialog/student.svg'
import successImg from '~/assets/img/email-confirmation-modals/success-icon.svg'
import { signup, snackbarVariants, student } from '~/constants'
import { UserRoleEnum } from '~/types'

import { styles } from '~/containers/guest-home-page/student-signup-dialog/StudentSignupDialog.styles'

interface SignupData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

const StudentSignupDialog = () => {
  const { t } = useTranslation()
  const { closeModal, openModal, setIsDirty } = useModalContext()
  const { setAlert } = useSnackBarContext()
  const [signUp] = useSignUpMutation()

  const showSuccessModal = useCallback(
    (email: string) => {
      openModal({
        component: (
          <NotificationModal
            buttonTitle={t('common.confirmButton')}
            description={
              <>
                {t('signup.confirmEmailMessage')}
                <strong>{email}</strong>
                {t('signup.confirmEmailDesc')}
              </>
            }
            img={successImg}
            onClose={closeModal}
            title={t('signup.confirmEmailTitle')}
          />
        )
      })
    },
    [openModal, closeModal, t]
  )

  const { handleSubmit, handleInputChange, handleBlur, data, errors, isDirty } =
    useForm<SignupData>({
      onSubmit: async () => {
        try {
          const signupData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            role: UserRoleEnum.Student
          }
          await signUp(signupData).unwrap()
          showSuccessModal(data.email)
        } catch (e) {
          const error = e as { data?: { code?: string } }
          setAlert({
            severity: snackbarVariants.error,
            message: `errors.${error.data?.code ?? 'UNKNOWN_ERROR'}`
          })
        }
      },
      initialValues: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      }
    })

  useEffect(() => {
    setIsDirty(isDirty)
  }, [isDirty, setIsDirty])

  return (
    <Box sx={styles.root}>
      <Box sx={styles.imgContainer}>
        <Box
          alt='student signup'
          component='img'
          src={studentImg}
          sx={styles.img}
        />
      </Box>

      <Box sx={styles.formContainer}>
        <Typography sx={styles.title} variant='h2'>
          {t('signup.head.student')}
        </Typography>
        <Box sx={styles.form}>
          <StudentSignupForm
            data={data}
            errors={errors}
            handleBlur={handleBlur}
            handleChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
          <GoogleLogin
            buttonWidth={styles.form.maxWidth}
            role={student}
            type={signup}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default StudentSignupDialog
