import { useEffect, useState, useCallback, useMemo } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

import { styles } from '~/containers/tutor-home-page/subjects-step/SubjectsStep.styles'
import subjectImg from '~/assets/img/tutor-home-page/become-tutor/study-category.svg'
import { categoriesMock } from './constants'
import AppButton from '~/components/app-button/AppButton'
import { useTranslation } from 'react-i18next'
import AppAutoComplete from '~/components/app-auto-complete/AppAutoComplete'
import AppChipList from '~/components/app-chips-list/AppChipList'
import { subjectService } from '~/services/subject-service'
import { useStepContext } from '~/context/step-context'

const SubjectsStep = ({ btnsBox, stepLabel }) => {
  const { t } = useTranslation()
  const { stepData, handleStepData } = useStepContext()

  const initialSelectedSubjects = useMemo(() => {
    return stepData?.[stepLabel]?.data?.subjects || []
  }, [stepData, stepLabel])

  const [categories, setCategories] = useState('')
  const [subject, setSubject] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState(
    initialSelectedSubjects
  )
  const [subjects, setSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const syncContext = useCallback(
    (nextSubjects) => {
      handleStepData(
        stepLabel,
        {
          data: {
            subjects: nextSubjects
          }
        },
        {}
      )
    },
    [handleStepData, stepLabel]
  )

  const handleAddSubject = () => {
    if (!subject) return

    setSelectedSubjects((prev) => {
      if (prev.includes(subject) || prev.length >= 5) return prev

      const next = [...prev, subject]
      syncContext(next)
      return next
    })

    setSubject('')
  }

  const handleDeleteSubject = (itemToDelete) => {
    setSelectedSubjects((prev) => {
      const next = prev.filter((item) => item !== itemToDelete)
      syncContext(next)
      return next
    })
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
        setSubjects(
          data.map((subject) => ({
            value: subject._id,
            title: subject.name
          }))
        )
      } catch (error) {
        console.error('Failed to load subjects', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSubjects()
  }, [categories])

  useEffect(() => {
    console.log('stepDAta ', stepData)
  }, [stepData])
  useEffect(() => {
    if (stepData?.[stepLabel]?.data?.subjects) {
      setSelectedSubjects(stepData[stepLabel].data.subjects)
    }
  }, [stepLabel, stepData])

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
              const nextCategory = newValue?.value || ''

              if (nextCategory !== categories) {
                setCategories(nextCategory)
                setSubject('')
                setSelectedSubjects([])
                syncContext([])
              }
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
