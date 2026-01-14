import { fadeAnimation } from '~/styles/app-theme/custom-animations'

export const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '40px',
    height: { sm: '485px' },
    ...fadeAnimation
  },
  imgContainer: {
    display: 'flex',
    flex: 1,
    maxWidth: '432px',
    aspectRatio: { xs: '4/3', sm: 'auto' },
    pb: { xs: '16px', sm: '52px' }
  },
  img: {
    width: '100%',
    m: { sm: 0, xs: '0 auto' }
  },
  rigthBox: {
    maxWidth: '432px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    m: { md: 0, xs: '0 auto' },
    pt: 0
  },
  title: {
    color: 'basic.blueGray'
  },
  select: {
    borderColor: 'basic.blueGray',
    color: 'basic.blueGray',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'basic.blueGray'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.500'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.900'
    },
    '& .MuiSvgIcon-root': {
      color: 'basic.blueGray'
    }
  },
  menu: {
    '& .MuiPaper-root': {
      borderColor: 'basic.blueGray',
      border: '1px solid',
      borderRadius: '4px'
    },
    '& .MuiMenuItem-root': {
      color: 'basic.blueGray',
      '&:hover': {
        backgroundColor: 'primary.50'
      },
      '&.Mui-selected': {
        backgroundColor: 'primary.100',
        color: 'primary.900',
        '&:hover': {
          backgroundColor: 'primary.100'
        }
      }
    }
  }
}
