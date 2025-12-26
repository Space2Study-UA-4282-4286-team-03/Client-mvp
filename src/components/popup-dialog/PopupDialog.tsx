import { FC, useState } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { PaperProps } from '@mui/material'

import useBreakpoints from '~/hooks/use-breakpoints'
import ConfirmDialog from '~/components/confirm-dialog/ConfirmDialog'
import { styles } from '~/components/popup-dialog/PopupDialog.styles'

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isHaveUnsavedChanges, setIsHaveUnsavedChanges] = useState(false)

  const handleMouseOver = () => timerId && clearTimeout(timerId)
  const handleMouseLeave = () => timerId && closeModalAfterDelay()

  return (
    <>
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
          onChangeCapture={(e) => {
            const target = e.target as HTMLInputElement
            if (target?.value !== '' || target?.checked === true) {
              setIsHaveUnsavedChanges(true)
            }
          }}
          onMouseLeave={handleMouseLeave}
          onMouseOver={handleMouseOver}
          sx={styles.box}
        >
          <IconButton
            data-testid='closeButton'
            onClick={() => {
              if (isHaveUnsavedChanges) {
                setIsConfirmOpen(true)
              } else {
                closeModal()
              }
            }}
            sx={styles.icon}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={styles.contentWraper}>{content}</Box>
        </Box>
      </Dialog>

      <ConfirmDialog
        message='questions.unsavedChanges'
        onConfirm={closeModal}
        onDismiss={() => setIsConfirmOpen(false)}
        open={isConfirmOpen}
        title='titles.confirmTitle'
      />
    </>
  )
}

export default PopupDialog
