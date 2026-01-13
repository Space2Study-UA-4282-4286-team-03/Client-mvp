import { fadeAnimation } from '~/styles/app-theme/custom-animations'

export const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    gridTemplateAreas: {
      xs: `
          "title"
          "image"
          "form"
        `,
      sm: `
          "title"
          "form"
        `,
      md: `
          "image title"
          "image form"
        `
    },
    ...fadeAnimation
  },
  imgContainer: {
    display: {
      xs: 'block',
      sm: 'none',
      md: 'block'
    }
  },
  img: {
    display: 'block',
    margin: '0 auto',
    paddingBottom: '2rem',
    maxWidth: '90%'
  }
}
