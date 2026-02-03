/* eslint-disable react/jsx-max-depth */

import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Button, IconButton } from '@mui/material'
import { Grid } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'

import VisuallyHiddenInput from '~/components/visually-hidden-input/VisuallyHiddenInput'
import { style } from '~/containers/tutor-home-page/add-photo-step/AddPhotoStep.style'
import { useCallback } from 'react'

import { useStepContext } from '~/context/step-context'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef } from 'react'
import { useAppSelector } from '~/hooks/use-redux'
import { userService } from '~/services/user-service'
import useAxios from '~/hooks/use-axios'

const MAX_FILE_SIZE_MB = 10 * 1024 * 1024
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg']

const AddPhotoStep = ({
  btnsBox,
  stepLabel,
  setIsUserFetched,
  isUserFetched
}) => {
  const fileInputRef = useRef(null)
  const { stepData, handleStepData } = useStepContext()
  const [previewPhoto, setPreviewPhoto] = useState(null)
  const [fromDB, setFromDB] = useState(true)
  const [fileError, setFileError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const { t } = useTranslation()
  const [buttonLabel, setButtonLabel] = useState(t('becomeTutor.photo.button'))

  const { userId, userRole } = useAppSelector((state) => state.appMain)

  const fetchUser = useCallback(() => {
    return userService.getUserById(userId, userRole)
  }, [userId, userRole])

  const { response: userResp } = useAxios({
    service: fetchUser,
    fetchOnMount: true,
    defaultResponse: null
  })

  useEffect(() => {
    const savedPhoto = stepData?.[stepLabel]?.[0]
    if (savedPhoto) {
      const previewUrl =
        typeof savedPhoto === 'string'
          ? savedPhoto
          : URL.createObjectURL(savedPhoto)
      setPreviewPhoto(previewUrl)
      setButtonLabel(savedPhoto.name || 'avatar.jpg')
    } else if (userResp && !isUserFetched && fromDB) {
      if (userResp.photo) {
        setPreviewPhoto(userResp.photo)
        setButtonLabel(t('savedPhoto'))
      }
      setIsUserFetched && setIsUserFetched(true)
    } else {
      setButtonLabel(t('becomeTutor.photo.button'))
    }
  }, [
    stepData,
    stepLabel,
    userResp,
    isUserFetched,
    fromDB,
    t,
    setIsUserFetched
  ])

  const applyFile = useCallback(
    (file) => {
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
      setFromDB(false)
      const previewUrl = URL.createObjectURL(file)
      setPreviewPhoto(previewUrl)
      setButtonLabel(file.name)
      handleStepData(stepLabel, [file], {})
    },
    [handleStepData, stepLabel, t]
  )

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    applyFile(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]
    applyFile(file)
  }

  useEffect(() => {
    return () => {
      if (previewPhoto) {
        URL.revokeObjectURL(previewPhoto)
      }
    }
  }, [previewPhoto])

  const handleRemovePhoto = (event) => {
    event.stopPropagation()
    event.preventDefault()

    if (previewPhoto?.startsWith('blob:')) {
      URL.revokeObjectURL(previewPhoto)
    }

    setPreviewPhoto(null)
    setFromDB(false)
    setButtonLabel(t('becomeTutor.photo.button'))
    setFileError('')
    handleStepData(stepLabel, [], {})

    if (fileInputRef.current) {
      fileInputRef.current.value = null
    }
  }

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
          <Box
            onClick={() => {
              if (!previewPhoto) {
                fileInputRef.current?.click()
              }
            }}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
              ...style.uploadBox,
              border: isDragging
                ? '2px dashed #1976d2'
                : '2px dashed transparent',
              backgroundColor: isDragging ? 'action.hover' : 'transparent',
              cursor: 'pointer',
              position: 'relative',
              '&:hover .remove-btn': {
                opacity: 1
              }
            }}
          >
            {previewPhoto && (
              <IconButton
                className='remove-btn'
                onClick={handleRemovePhoto}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.8)'
                  }
                }}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            )}

            {previewPhoto ? (
              <img alt='Photo Preview' src={previewPhoto} style={style.img} />
            ) : (
              <Typography>{t('becomeTutor.photo.placeholder')}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item md={6} order={{ xs: 1, md: 2 }} sx={style.rightBox} xs={12}>
          <Grid>
            <Typography sx={style.description}>
              {t('becomeTutor.photo.description')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                component='label'
                startIcon={<CloudUploadIcon />}
                sx={style.fileUploader.button}
                variant='contained'
              >
                <Typography>{buttonLabel}</Typography>
                <VisuallyHiddenInput
                  id='add-photo-input'
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  type='file'
                />{' '}
                {previewPhoto && (
                  <IconButton
                    aria-label={t('becomeTutor.photo.remove')}
                    onClick={handleRemovePhoto}
                    size='small'
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Button>
            </Box>
            {fileError && <Typography color='error'>{fileError}</Typography>}
          </Grid>
          {btnsBox}
        </Grid>
      </Grid>
    </Box>
  )
}

export default AddPhotoStep
