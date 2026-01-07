export const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: { sm: '340px' }
  },
  nameRow: {
    display: 'flex',
    gap: '16px',
    mb: '5px'
  },
  nameField: {
    flex: 1
  },
  signupButton: {
    width: '100%',
    py: '14px'
  },
  termsBox: {
    display: 'flex',
    alignItems: 'flex-start',
    mb: '20px'
  },
  termsText: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '4px',
    pt: '9px'
  },
  termsLink: {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: 'primary.900',
    '&:hover': {
      textDecoration: 'none'
    }
  }
}
