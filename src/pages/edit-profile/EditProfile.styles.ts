import { commonShadow } from '~/styles/app-theme/custom-shadows'

export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: '12px', sm: 0 }
  },
  subtitle: {
    color: 'basic.blueGray'
  },
  bodyRow: {
    display: 'flex',
    gap: '5px',
    flexDirection: { xs: 'column', md: 'row' }
  },
  sidebar: {
    display: { xs: 'none', md: 'flex' }, 
    flexDirection: 'column',
    gap: '8px',
    minWidth: { md: '280px', lg: '400px' },
    padding: '12px'
  },
  mobileMenuButton: {
    display: { xs: 'flex', md: 'none' } 
  },
  divider: {
    height: '1px',
    backgroundColor: 'basic.blueGray',
    my: '5px'
  },
  content: {
    flex: 1,
    padding: { xs: '16px', sm: '22px' },
  },
  formContent: {
    flex: 1,
    padding: { xs: '16px', sm: '22px' },
    border: '1px solid',
    borderColor: 'basic.blueGray',
    borderRadius: '5px',
    boxShadow: commonShadow
  },
  bar: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap', 
    mt: '12px'
  },
  photoRow: {
    display: 'flex',
    gap: '16px',
    mt: '50px',
    mb: '24px',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'flex-start', sm: 'center' }
  },
  avatar: {
    width: 100,
    height: 100
  },
  photoButtons: {
    display: 'flex',
    gap: '12px',
    mt: '20px',
    flexDirection: { xs: 'column', sm: 'row' }
  },
  drawer: {
    width: 260, 
    padding: '12px'
  },
  photoHint: {
    mt: '20px',
    color: 'basic.blueGray'
  },
  professionalSummaryField: {
    mt: '10px',
    '& [data-text-length]': {
    left: 0,
    right: 'auto'
    }
  }
}
