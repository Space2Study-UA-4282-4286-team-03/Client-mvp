import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'

import TitleWithDescription from '~/components/title-with-description/TitleWithDescription'
import Accordions from '~/components/accordion/Accordions'
import { studentRoutes } from '~/router/constants/studentRoutes'
import { accordionItems } from '~/containers/student-home-page/faq/accordionItems'

import { styles } from '~/containers/student-home-page/faq/Faq.styles'

const Faq = () => {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleAccordionChange = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index))
  }

  return (
    <Box
      className='section'
      id={studentRoutes.navBar.faq.route}
      sx={styles.container}
    >
      <TitleWithDescription
        description={t('studentHomePage.faq.subtitle')}
        style={styles.titleWithDescription}
        title={t('studentHomePage.faq.title')}
      />
      <Box sx={styles.accordionWrapper}>
        <Accordions
          activeIndex={activeIndex}
          descriptionVariant='body2'
          icon={<ExpandMoreRoundedIcon />}
          items={accordionItems}
          onChange={handleAccordionChange}
          titleVariant='h6'
        />
      </Box>
    </Box>
  )
}

export default Faq
