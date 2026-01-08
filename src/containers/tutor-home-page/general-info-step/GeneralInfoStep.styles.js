import { fadeAnimation } from '~/styles/app-theme/custom-animations'

export const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: { sm: '485px' },
    paddingBottom: { xs: '30px', sm: '0' },
    ...fadeAnimation
  },
  contentBox: {
    width: { xs: '100%', md: '45%' }
  },
  imgContainer: {
    width: { xs: '0', md: '50%' },
    height: { xs: '200px', sm: '485px' },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    width: { xs: '100%', sm: '100%' },
    height: { sm: 'auto', md: '485px' },
    objectFit: { sm: 'cover' }
  }
}
