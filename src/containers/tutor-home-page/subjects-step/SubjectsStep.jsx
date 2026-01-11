import Box from '@mui/material/Box'

import { styles } from '~/containers/tutor-home-page/subjects-step/SubjectsStep.styles'
import subjectImg from '~/assets/img/tutor-home-page/become-tutor/study-category.svg'
import { useEffect, useState } from 'react'
import { categoriesMock } from './constants'
import AppButton from '~/components/app-button/AppButton'
import { useTranslation } from 'react-i18next'
import AppAutoComplete from '~/components/app-auto-complete/AppAutoComplete'
import { Typography } from '@mui/material'
import AppChipList from '~/components/app-chips-list/AppChipList'
import { subjectService } from '~/services/subject-service'

const SubjectsStep = ({ btnsBox }) => {
  const { t } = useTranslation()
  const [categories, setCategories] = useState('')
  const [subject, setSubject] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [subjects, setSubjects] = useState([])

  const handleAddSubject = () => {
    if (
      !subject ||
      selectedSubjects.includes(subject) ||
      selectedSubjects.length >= 5
    )
      return
    setSelectedSubjects((prev) => [...prev, subject])
    setSubject('')
  }

  const handleDeleteSubject = (itemToDelete) => {
    setSelectedSubjects((prev) => prev.filter((item) => item !== itemToDelete))
  }

  useEffect(() => {
    if (!categories) {
      setSubjects([])
      return
    }

    const fetchSubjects = async () => {
      try {
        setIsLoading(true)
        const data = await subjectService.getSubjectsNames(categories)
        const fields = data.map((item) => ({
          title: item.name,
          value: item._id
        }))
        setSubjects(fields)
      } catch (error) {
        console.error('Failed to load subjects', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSubjects()
  }, [categories])

  return (
    <Box sx={styles.container}>
      <Box sx={styles.imgContainerDesktop}>
        <Box
          alt='subject step'
          component='img'
          src={subjectImg}
          sx={styles.img}
        />
      </Box>

      <Box sx={styles.rightBox}>
        <Box sx={styles.selectsBox}>
          <Typography variant='body1'>
            {t('becomeTutor.categories.title')}
          </Typography>

          <Box sx={styles.imgContainerMobile}>
            <Box
              alt='subject step'
              component='img'
              src={subjectImg}
              sx={styles.img}
            />
          </Box>

          <AppAutoComplete
            ListboxProps={{ style: styles.autoCompleteListBox }}
            getOptionLabel={(option) => option.title}
            onChange={(_, newValue) => {
              setCategories(newValue?.value || '')
              setSubject('')
              setSelectedSubjects([])
            }}
            options={categoriesMock}
            textFieldProps={{
              placeholder: t('becomeTutor.categories.mainSubjectsLabel'),
              label: t('becomeTutor.categories.mainSubjectsLabel')
            }}
            value={
              categoriesMock.find((item) => item.value === categories) || null
            }
          />

          <AppAutoComplete
            ListboxProps={{ style: styles.autoCompleteListBox }}
            disabled={!categories || isLoading}
            getOptionLabel={(option) => option.title}
            loading={isLoading}
            onChange={(_, newValue) => {
              setSubject(newValue?.value || '')
            }}
            options={subjects.length ? subjects : []}
            textFieldProps={{
              placeholder: t('becomeTutor.categories.subjectLabel'),
              label: t('becomeTutor.categories.subjectLabel')
            }}
            value={subjects.find((item) => item.value === subject) || null}
          />

          <Box sx={styles.addSubjectBox}>
            <AppButton onClick={handleAddSubject} size='large' variant='tonal'>
              {t('becomeTutor.categories.btnText')}
            </AppButton>

            <AppChipList
              defaultQuantity={2}
              handleChipDelete={handleDeleteSubject}
              items={selectedSubjects}
              wrapperStyle={styles.chipsBox}
            />
          </Box>
        </Box>

        {btnsBox}
      </Box>
    </Box>
  )
}

export default SubjectsStep
