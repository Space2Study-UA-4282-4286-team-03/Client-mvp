import { fadeAnimation } from '~/styles/app-theme/custom-animations'

export const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '40px',
    height: { sm: '485px' },
    paddingBottom: { xs: '30px', sm: '0px' },
    ...fadeAnimation
  },
  imgContainerDesktop: {
    display: { xs: 'none', md: 'flex' },
    flex: 1,
    maxWidth: '432px'
  },
  imgContainerMobile: {
    display: { xs: 'flex', sm: 'none' },
    width: '100%',
    my: '16px'
  },
  img: {
    width: '100%',
    m: { md: 0, xs: '0 auto' }
  },
  rightBox: {
    maxWidth: '432px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    m: { md: 0, xs: '0 auto' },
    pt: 0
  },
  selectsBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  addSubjectBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  chipsBox: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    mb: { xs: '50px', sm: 0 }
  },
  autoCompleteListBox: {
    maxHeight: 150,
    overflowY: 'auto'
  }
}
