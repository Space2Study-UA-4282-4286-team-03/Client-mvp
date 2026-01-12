import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styles } from '~/containers/email-confirm-modal/EmailConfirmModal.styles'
import { useModalContext } from '~/context/modal-context'
import { useTranslation } from 'react-i18next'
import { useCallback, useRef } from 'react'
import imgReject from '~/assets/img/email-confirmation-modals/not-success-icon.svg'
import imgSuccess from '~/assets/img/email-confirmation-modals/success-icon.svg'
import LoginDialog from '~/containers/guest-home-page/login-dialog/LoginDialog'
import useAxios from '~/hooks/use-axios'
import { AuthService } from '~/services/auth-service'
import Loader from '~/components/loader/Loader'
import ImgTitleDescription from '~/components/img-title-description/ImgTitleDescription'

const EmailConfirmModal = ({ confirmToken, openModal }) => {
  const { t } = useTranslation()
  const { closeModal } = useModalContext()
  const calledRef = useRef(false)

  const { response, error, loading } = useAxios({
    service: useCallback(() => {
      if (calledRef.current) return
      calledRef.current = true

      return AuthService.confirmEmail(confirmToken)
    }, [confirmToken]),
    defaultResponse: null
  })

  const openLoginDialog = () => {
    closeModal()
    openModal({ component: <LoginDialog /> })
  }

  if (loading) return <Loader size={100} />

  if (response && !error) {
    return (
      <Box sx={styles.box}>
        <ImgTitleDescription
          img={imgSuccess}
          style={styles}
          title={t('modals.emailConfirm')}
        />
        <Button
          onClick={openLoginDialog}
          sx={styles.button}
          variant='contained'
        >
          {t('button.goToLogin')}
        </Button>
      </Box>
    )
  }

  if (
    error?.code === 'BAD_CONFIRM_TOKEN' ||
    (error?.code === 'DOCUMENT_NOT_FOUND' && !response)
  ) {
    return (
      <Box sx={styles.box}>
        <ImgTitleDescription
          description={t('modals.emailReject.badToken')}
          img={imgReject}
          style={styles}
          title={t('modals.emailNotConfirm')}
        />
        <Button onClick={closeModal} sx={styles.button} variant='contained'>
          {t('common.confirmButton')}
        </Button>
      </Box>
    )
  }

  if (error?.code === 'EMAIL_ALREADY_CONFIRMED') {
    return (
      <Box sx={styles.box}>
        <ImgTitleDescription
          description={t('modals.emailReject.alreadyConfirmed')}
          img={imgReject}
          style={styles}
          title={t('modals.emailAlreadyConfirm')}
        />
        <Button
          onClick={openLoginDialog}
          sx={styles.button}
          variant='contained'
        >
          {t('common.confirmButton')}
        </Button>
      </Box>
    )
  }

  return null
}

export default EmailConfirmModal
