import Box from '@mui/material/Box'
import SchoolIcon from '@mui/icons-material/School'
import DoneIcon from '@mui/icons-material/Done'
import Avatar from '@mui/material/Avatar'

import TitleWithDescription from '~/components/title-with-description/TitleWithDescription'
import AppChipList from '~/components/app-chips-list/AppChipList'
import ProfileDoneItemsList from '~/components/icon-with-text-list/ProfileDoneItemsList'

import { styles } from '~/containers/tutor-profile/profile-info/ProfileInfo.styles'

const ProfileContainerDesktop = ({
  userData,
  actionIcon,
  accInfo,
  buttonGroup,
  defaultQuantity,
  doneItems,
  chipItems
}) => {
  return (
    <Box sx={styles.container}>
      <Box sx={styles.avatarContainer}>
        <Avatar src={userData.photo || undefined} sx={styles.img}>
          {!userData.photo &&
            `${userData.firstName?.[0] ?? ''}${userData.lastName?.[0] ?? ''}`.toUpperCase()}
        </Avatar>
      </Box>
      {actionIcon}

      <Box sx={styles.infoWrapper}>
        <TitleWithDescription
          description={userData.professionalSummary}
          style={styles.titleWithDescription}
          title={`${userData.firstName} ${userData.lastName}`}
        />

        <AppChipList
          defaultQuantity={2}
          icon={<SchoolIcon fontSize='small' sx={styles.schoolIcon} />}
          items={chipItems}
          wrapperStyle={styles.chipsWrapper}
        />

        <Box sx={styles.accInfoWrapper}>{accInfo}</Box>

        <ProfileDoneItemsList
          defaultQuantity={defaultQuantity}
          icon={<DoneIcon sx={styles.doneIcon} />}
          items={doneItems}
        />

        {buttonGroup}
      </Box>
    </Box>
  )
}

export default ProfileContainerDesktop
