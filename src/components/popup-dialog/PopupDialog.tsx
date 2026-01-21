import { FC } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { PaperProps } from '@mui/material'

import useBreakpoints from '~/hooks/use-breakpoints'
import { styles } from '~/components/popup-dialog/PopupDialog.styles'
import useConfirm from '~/hooks/use-confirm'
import { useTranslation } from 'react-i18next'

interface PopupDialogProps {
  content: React.ReactNode
  paperProps: PaperProps
  timerId: NodeJS.Timeout | null
  closeModal: () => void
  closeModalAfterDelay: (delay?: number) => void
}

const PopupDialog: FC<PopupDialogProps> = ({
  content,
  paperProps,
  timerId,
  closeModal,
  closeModalAfterDelay
}) => {
  const { isMobile } = useBreakpoints()

  const handleMouseOver = () => timerId && clearTimeout(timerId)
  const handleMouseLeave = () => timerId && closeModalAfterDelay()
  const { checkConfirmation } = useConfirm()
  const { t } = useTranslation()

  const handleClose = async () => {
    const ok = await checkConfirmation({
      title: t('titles.confirmTitle'),
      message: t('questions.unsavedChanges'),
      confirmButton: t('common.confirmButton'),
      cancelButton: t('common.cancel')
    })

    if (ok) {
      closeModal()
    }
  }

  return (
    <Dialog
      PaperProps={paperProps}
      data-testid='popup'
      disableRestoreFocus
      fullScreen={isMobile}
      maxWidth='xl'
      open
    >
      <Box
        data-testid='popupContent'
        onMouseLeave={handleMouseLeave}
        onMouseOver={handleMouseOver}
        sx={styles.box}
      >
        <IconButton
          data-testid='closeButton'
          onClick={() => void handleClose()}
          sx={styles.icon}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={styles.contentWraper}>{content}</Box>
      </Box>
    </Dialog>
  )
}

export default PopupDialog
