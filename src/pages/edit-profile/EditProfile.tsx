/* eslint-disable react/jsx-max-depth */

import { Button, Typography } from '@mui/material'
import PageWrapper from '~/components/page-wrapper/PageWrapper'
import { useTranslation } from 'react-i18next'
import { SizeEnum } from '~/types'
import Box from '@mui/material/Box'
import { styles } from './EditProfile.styles'
import { useNavigate } from 'react-router-dom'
import { authRoutes } from '~/router/constants/authRoutes'
import MenuItem from '@mui/material/MenuItem'
import { useState, useEffect, ChangeEvent } from 'react'
import Avatar from '@mui/material/Avatar'
import AppTextField from '~/components/app-text-field/AppTextField'
import AppTextArea from '~/components/app-text-area/AppTextArea'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'

const EditProfile = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const handleBack = () => {
    navigate(authRoutes.accountMenu.myProfile.path)
  }
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (!photo) {
      setPhotoUrl(undefined)
      return
    }
    const url = URL.createObjectURL(photo)
    setPhotoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  const handleChange =
    (field: keyof typeof data) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setData((prev) => ({
        ...prev,
        [field]: e.target.value
      }))
    }
  const handleUpdateProfile = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    navigate(authRoutes.accountMenu.myProfile.path)
  }
  const [activeMenu, setActiveMenu] = useState('profile')
  const [activeTab, setActiveTab] = useState('general')
  const tabs = [
    {
      id: 'general',
      label: t('editProfile.accountSettings.general.tabsGeneral')
    },
    {
      id: 'professional',
      label: t('editProfile.accountSettings.general.tabsProfessional')
    },
    {
      id: 'timetable',
      label: t('editProfile.accountSettings.general.tabsTimetable')
    },
    { id: 'links', label: t('editProfile.accountSettings.general.tabsLinks') }
  ]
  const menuItems = [
    {
      id: 'profile',
      label: t('editProfile.accountSettings.general.menuProfile')
    },
    {
      id: 'notifications',
      label: t('editProfile.accountSettings.general.menuNotifications')
    },
    {
      id: 'password',
      label: t('editProfile.accountSettings.general.menuPasswordSecurity')
    }
  ]

  const STORAGE_KEY = 'edit-profile-form'

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    professionalSummary: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as {
        firstName: string
        lastName: string
        professionalSummary: string
      }
      setData(parsed)
    }
  }, [])

  return (
    <PageWrapper>
      <Box sx={styles.container}>
        <Box sx={styles.headerRow}>
          <Box>
            <Typography variant='h4'>
              {t('editProfile.accountSettings.general.title')}
            </Typography>
            <Typography sx={styles.subtitle} variant='subtitle1'>
              {t('editProfile.accountSettings.general.subtitle')}
            </Typography>
          </Box>
          <Button onClick={handleBack} size={SizeEnum.Large} variant='tonal'>
            {t('editProfile.accountSettings.general.backToProfile')}
          </Button>
        </Box>

        <Box sx={styles.divider} />

        <Box sx={styles.bodyRow}>
          <Box sx={styles.sidebar}>
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                selected={activeMenu === item.id}
              >
                {item.label}
              </MenuItem>
            ))}
          </Box>

          <Box sx={styles.content}>
            <Box sx={styles.formContent}>
              <IconButton
                aria-label='Open menu'
                onClick={() => setMobileMenuOpen(true)}
                sx={styles.mobileMenuButton}
              >
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor='left'
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
              >
                <Box sx={styles.drawer}>
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.id}
                      onClick={() => {
                        setActiveMenu(item.id)
                        setMobileMenuOpen(false)
                      }}
                      selected={activeMenu === item.id}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Box>
              </Drawer>

              <Typography variant='h6'>
                {t('editProfile.accountSettings.general.profileTitle')}
              </Typography>
              <Typography sx={styles.subtitle} variant='subtitle1'>
                {t('editProfile.accountSettings.general.profileDescription')}
              </Typography>

              {activeMenu === 'profile' && (
                <>
                  <Box sx={styles.bar}>
                    {tabs.map((tab) => (
                      <Button
                        color={activeTab === tab.id ? 'primary' : 'inherit'}
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        size={SizeEnum.Medium}
                        variant={
                          activeTab === tab.id ? 'containedLight' : 'tonal'
                        }
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </Box>

                  {activeTab === 'general' && (
                    <Box sx={{ mt: 2 }}>
                      <Box sx={styles.photoRow}>
                        <Avatar src={photoUrl} sx={styles.avatar} />
                        <Box>
                          <Typography variant='body1'>
                            {t(
                              'editProfile.accountSettings.general.photoUpload'
                            )}
                          </Typography>
                          <Typography sx={styles.photoHint} variant='caption'>
                            {t(
                              'editProfile.accountSettings.general.photoMaxSize'
                            )}
                          </Typography>
                          <Box sx={styles.photoButtons}>
                            <Button
                              component='label'
                              size={SizeEnum.Medium}
                              variant='containedLight'
                            >
                              {t(
                                'editProfile.accountSettings.general.photoUpload'
                              )}
                              <input
                                accept='image/*'
                                hidden
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    setPhoto(e.target.files[0])
                                  }
                                }}
                                type='file'
                              />
                            </Button>
                            <Button
                              disabled={!photo}
                              onClick={() => setPhoto(null)}
                              size={SizeEnum.Medium}
                              variant='tonal'
                            >
                              {t(
                                'editProfile.accountSettings.general.photoRemoveButton'
                              )}
                            </Button>
                          </Box>
                        </Box>
                      </Box>

                      <Typography variant='body1'>
                        {t(
                          'editProfile.accountSettings.general.personalInfoTitle'
                        )}
                      </Typography>
                      <Typography sx={styles.photoHint} variant='caption'>
                        {t(
                          'editProfile.accountSettings.general.personalInfoDescription'
                        )}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <AppTextField
                          label={`${t('common.labels.firstName')} *`}
                          onChange={handleChange('firstName')}
                          sx={{ flex: 1 }}
                          value={data.firstName}
                        />
                        <AppTextField
                          label={`${t('common.labels.lastName')} *`}
                          onChange={handleChange('lastName')}
                          sx={{ flex: 1 }}
                          value={data.lastName}
                        />
                      </Box>

                      <Typography variant='body1'>
                        {t(
                          'editProfile.accountSettings.general.professionalHeadlineTitle'
                        )}
                      </Typography>
                      <Typography sx={styles.photoHint} variant='caption'>
                        {t(
                          'editProfile.accountSettings.general.professionalHeadlineDescription'
                        )}
                      </Typography>
                      <AppTextArea
                        fullWidth
                        label={t(
                          'editProfile.accountSettings.general.professionalHeadlineText'
                        )}
                        maxLength={200}
                        onChange={handleChange('professionalSummary')}
                        sx={styles.professionalSummaryField}
                        value={data.professionalSummary}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>

            <Box>
              <Button
                onClick={handleUpdateProfile}
                size={SizeEnum.Medium}
                sx={{ mt: '10px' }}
                variant='contained'
              >
                {t('editProfile.accountSettings.updateProfile')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </PageWrapper>
  )
}

export default EditProfile
