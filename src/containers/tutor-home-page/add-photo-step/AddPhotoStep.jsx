import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Button } from '@mui/material'
import { Grid } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import VisuallyHiddenInput from '~/components/visually-hidden-input/VisuallyHiddenInput'
import { useStepContext } from '~/context/step-context'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { style } from '~/containers/tutor-home-page/add-photo-step/AddPhotoStep.style'
const MAX_FILE_SIZE_MB = 10 * 1024 * 1024
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg']
const AddPhotoStep = ({ btnsBox }) => {
  const { handleStepData } = useStepContext()
  const [previewPhoto, setPreviewPhoto] = useState(null)
  const [fileError, setFileError] = useState('')
  const { t } = useTranslation()
  const [buttonLabel, setButtonLabel] = useState(t('becomeTutor.photo.button'))
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError(t('becomeTutor.photo.typeError'))
      event.target.value = null
      return
    }
    if (file.size > MAX_FILE_SIZE_MB) {
      setFileError(t('becomeTutor.photo.sizeError'))
      event.target.value = null
      return
    }
    setFileError('')
    const previewUrl = URL.createObjectURL(file)
    setPreviewPhoto(previewUrl)
    setButtonLabel(file.name)
    handleStepData((prev) => ({ ...prev, photo: [file] }))
    console.log('Uploaded file:', file)
  }
  useEffect(() => {
    return () => {
      if (previewPhoto) {
        URL.revokeObjectURL(previewPhoto)
      }
    }
  }, [previewPhoto])
  return (
    <Box sx={style.root}>
      <Grid container>
        <Grid
          item
          md={6}
          order={{ xs: 2, md: 1 }}
          sx={style.imgContainer}
          xs={12}
        >
          <Box sx={style.uploadBox}>
            {' '}
            {previewPhoto ? (
              <img alt='Photo Preview' src={previewPhoto} style={style.img} />
            ) : (
              <Typography>{t('becomeTutor.photo.placeholder')}</Typography>
            )}{' '}
          </Box>{' '}
        </Grid>{' '}
        <Grid item md={6} order={{ xs: 1, md: 2 }} sx={style.rightBox} xs={12}>
          {' '}
          <Grid>
            {' '}
            <Typography sx={style.description}>
              {' '}
              {t('becomeTutor.photo.description')}{' '}
            </Typography>{' '}
            <Button
              component='label'
              startIcon={<CloudUploadIcon />}
              sx={style.fileUploader.button}
              variant='contained'
            >
              {' '}
              <Typography>{buttonLabel}</Typography>{' '}
              <VisuallyHiddenInput onChange={handleFileUpload} type='file' />{' '}
            </Button>{' '}
            {fileError && <Typography color='error'>{fileError}</Typography>}{' '}
          </Grid>{' '}
          {btnsBox}{' '}
        </Grid>{' '}
      </Grid>{' '}
    </Box>
  )
}

export default AddPhotoStep
