import { useMemo, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'

import { styles } from '~/containers/tutor-home-page/language-step/LanguageStep.styles'
import { LanguagesEnum } from '~/types'
import { useStepContext } from '~/context/step-context'
import img from '~/assets/img/tutor-home-page/become-tutor/languages.svg'

const DEFAULT_LABEL = 'Your native language'

const LANGUAGES = [
  { value: '', label: DEFAULT_LABEL },
  ...Object.values(LanguagesEnum).map((lang) => ({
    value: lang,
    label: lang
  }))
]

const LanguageStep = ({ btnsBox, stepLabel }) => {
  const { stepData, handleStepData } = useStepContext()

  const initialLanguage = useMemo(() => {
    return stepData?.[stepLabel]?.language ?? ''
  }, [stepData, stepLabel])

  const [language, setLanguage] = useState(initialLanguage)

  const handleChange = (event) => {
    const value = event.target.value
    setLanguage(value)
    handleStepData(
      stepLabel,
      {
        language: value
      },
      {}
    )
  }

  useEffect(() => {
    setLanguage(initialLanguage)
  }, [initialLanguage, stepData])

  return (
    <Box sx={styles.container}>
      <Box sx={styles.imgContainer}>
        <Box component='img' src={img} sx={styles.img} />
      </Box>

      <Box sx={styles.rigthBox}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            pl: 2,
            width: '100%'
          }}
        >
          <Typography sx={{ ...styles.title, mb: 1 }}>
            Please select the language in which you would like to study and
            cooperate
          </Typography>

          <Select
            MenuProps={{
              sx: styles.menu
            }}
            displayEmpty
            onChange={handleChange}
            renderValue={(selected) => {
              if (!selected) return DEFAULT_LABEL
              const found = LANGUAGES.find((l) => l.value === selected)
              return found ? found.label : selected
            }}
            sx={{
              width: '100%',
              maxWidth: '432px',
              mt: 1,
              ...styles.select
            }}
            value={language}
          >
            <MenuItem disabled value='' />
            {LANGUAGES.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box
          sx={{
            width: '100%',
            pl: 2
          }}
        >
          {btnsBox}
        </Box>
      </Box>
    </Box>
  )
}

export default LanguageStep
