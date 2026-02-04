import { fadeAnimation } from '~/styles/app-theme/custom-animations'

export const style = {
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '40px',
    height: { sm: '480px' },
    paddingBottom: { sm: '210px', md: '0px' },
    ...fadeAnimation
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    borderRadius: '20px',
    mt: { xs: '20px', md: '0px' },
    objectFit: 'contain',
    display: 'block'
  },
  imgContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: { xs: '100%', md: '440px' },
    pb: { xs: '16px', sm: '26px', md: '52px' },
    flex: 1
  },
  uploadBox: {
    width: '100%',
    maxWidth: '440px',
    aspectRatio: '1',
    border: '2px dashed',
    borderColor: 'primary.200',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    mt: { xs: '20px', md: '0px' }
  },
  activeDrag: {
    border: '2px primary',
    borderColor: 'primary.900'
  },
  rightBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    maxWidth: { xs: '100%', md: '432px' },
    m: { xs: '0 auto', md: 0 },
    pt: { xs: 2, md: 0 }
  },
  description: {
    mb: '20px'
  },
  fileUploader: {
    button: {
      textAlign: 'center',
      color: 'black',
      backgroundColor: 'common.white'
    }
  }
}
