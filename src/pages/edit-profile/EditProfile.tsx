import { Button, Typography } from '@mui/material'
import PageWrapper from '~/components/page-wrapper/PageWrapper'
import { useTranslation } from 'react-i18next'
import { SizeEnum } from '~/types'
import Box from '@mui/material/Box'
import { styles } from './EditProfile.styles'
import { useNavigate } from 'react-router-dom'
import { authRoutes } from '~/router/constants/authRoutes'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import AppTextField from '~/components/app-text-field/AppTextField'
import AppTextArea from '~/components/app-text-area/AppTextArea'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'

const EditProfile = () => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) 
  const handleBack = () => {
    navigate(authRoutes.accountMenu.myProfile.path)
  }
  const[photo,setPhoto] = useState<File | null>(null)
  const [data, setData] = useState({
  firstName: '',
  lastName: '',
  professionalSummary: ''
})
const handleChange = (field: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement>) => {
  setData(prev => ({
    ...prev,
    [field]: e.target.value
  }))
}
const handleUpdateProfile = () => {
  navigate(authRoutes.accountMenu.myProfile.path)
}
  const [activeMenu, setActiveMenu] = useState('profile')
  const [activeTab, setActiveTab] = useState('general')
  const tabs = [
    { id: 'general', label: t('editProfile.accountSettings.general.tabsGeneral') },
    { id: 'professional', label: t('editProfile.accountSettings.general.tabsProfessional') },
    { id: 'timetable', label: t('editProfile.accountSettings.general.tabsTimetable') },
    { id: 'links', label: t('editProfile.accountSettings.general.tabsLinks') }
  ]
  const menuItems = [
    { id: 'profile', label: t('editProfile.accountSettings.general.menuProfile') },
    { id: 'notifications', label: t('editProfile.accountSettings.general.menuNotifications') },
    { id: 'password', label: t('editProfile.accountSettings.general.menuPasswordSecurity') }
  ]
  return (
    <PageWrapper>
  <Box sx={styles.container}>
    <Box sx={styles.headerRow}>
      <Box>
        <Typography variant="h4">
          {t('editProfile.accountSettings.general.title')}
        </Typography>

        <Typography variant="subtitle1" sx={styles.subtitle}>
          {t('editProfile.accountSettings.general.subtitle')}
        </Typography>
      </Box>
      <Button
        onClick={handleBack}
        size={SizeEnum.Large}
        variant="tonal"
      >
        {t('editProfile.accountSettings.general.backToProfile')}
      </Button>
    </Box>
     <Box sx={styles.divider} />
    <Box sx={styles.bodyRow}>
      <Box sx={styles.sidebar}>
   {menuItems.map(item => (
    <MenuItem
    key={item.id}
    selected={activeMenu === item.id}
    onClick={() => setActiveMenu(item.id)}
    >
      {item.label}
    </MenuItem>
  ))}
</Box>
      <Box sx={styles.content}>
        <Box sx={styles.formContent}>
 <IconButton
    sx={styles.mobileMenuButton}
    onClick={() => setMobileMenuOpen(true)}
  >
    <MenuIcon />
  </IconButton>
  <Drawer
  anchor="left"
  open={mobileMenuOpen}
  onClose={() => setMobileMenuOpen(false)}
>
  <Box sx={styles.drawer}>
    {menuItems.map(item => (
      <MenuItem
        key={item.id}
        selected={activeMenu === item.id}
        onClick={() => {
          setActiveMenu(item.id)
          setMobileMenuOpen(false) 
        }}
      >
        {item.label}
      </MenuItem>
    ))}
  </Box>
</Drawer>
    <Typography variant='h6'>
      {t('editProfile.accountSettings.general.profileTitle')}
    </Typography>
    <Typography variant="subtitle1" sx={styles.subtitle}>
      {t('editProfile.accountSettings.general.profileDescription')}
    </Typography>
    {activeMenu === 'profile' && (
      <>
      <Box sx={styles.bar}>
        {tabs.map(tab => (
          <Button
          key={tab.id}
          size={SizeEnum.Medium}
          variant={activeTab === tab.id ? 'containedLight' : 'tonal'}
          color={activeTab === tab.id ? 'primary' : 'inherit'}
          onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
        </Box>
        {activeTab === 'general' && (
  <Box sx={{ mt: 2 }}>
    <Box sx={styles.photoRow}>
      <Avatar
        src={photo ? URL.createObjectURL(photo) : undefined}
        sx={styles.avatar}
      />
      <Box>
         <Typography variant='body1'>
            {t('editProfile.accountSettings.general.photoUpload')}
          </Typography>
          <Typography variant="caption" sx={styles.photoHint}>
          {t('editProfile.accountSettings.general.photoMaxSize')}
        </Typography>
        <Box sx={styles.photoButtons}>
          <Button
            variant="containedLight"
            size={SizeEnum.Medium}
            component="label"
          >
            {t('editProfile.accountSettings.general.photoUpload')}
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPhoto(e.target.files[0])
                }
              }}
            />
          </Button>
          <Button
            variant="tonal"
            size={SizeEnum.Medium}
            onClick={() => setPhoto(null)}
            disabled={!photo}
          >
            {t('editProfile.accountSettings.general.photoRemoveButton')}
          </Button>
        </Box>
      </Box>
    </Box>
    <Typography variant='body1'>
      {t('editProfile.accountSettings.general.personalInfoTitle')}
    </Typography>
    <Typography variant="caption" sx={styles.photoHint}>
      {t('editProfile.accountSettings.general.personalInfoDescription')}
    </Typography>
  <Box sx={{ display: 'flex', gap: 2, marginTop: '10px' }}>
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
  {t('editProfile.accountSettings.general.professionalHeadlineTitle')}
</Typography>
<Typography variant="caption" sx={styles.photoHint}>
      {t('editProfile.accountSettings.general.professionalHeadlineDescription')}
    </Typography>
    <AppTextArea
    fullWidth
    label={t('editProfile.accountSettings.general.professionalHeadlineText')}
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
        size={SizeEnum.Medium}
        variant="contained"
        onClick={handleUpdateProfile}
        sx={{mt: '10px'}}
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
