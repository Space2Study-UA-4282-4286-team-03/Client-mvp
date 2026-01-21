import { useEffect, useState, useCallback, useMemo } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import { styles } from '~/containers/tutor-home-page/subjects-step/SubjectsStep.styles'
import subjectImg from '~/assets/img/tutor-home-page/become-tutor/study-category.svg'
import AppButton from '~/components/app-button/AppButton'
import { useTranslation } from 'react-i18next'
import AppAutoComplete from '~/components/app-auto-complete/AppAutoComplete'
import AppChipList from '~/components/app-chips-list/AppChipList'
import { useStepContext } from '~/context/step-context'
import axios from 'axios'

const SubjectsStep = ({ btnsBox, stepLabel }) => {
  const { t } = useTranslation()
  const { stepData, handleStepData } = useStepContext()

  const initialSelectedSubjects = useMemo(
    () =>
      Array.isArray(stepData?.[stepLabel]?.tutor)
        ? stepData[stepLabel].tutor
        : [],
    [stepData, stepLabel]
  )

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [subject, setSubject] = useState(null)

  const [selectedSubjects, setSelectedSubjects] = useState(
    initialSelectedSubjects
  )
  const [subjects, setSubjects] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)

  const syncContext = useCallback(
    (nextSubjects) => {
      handleStepData(stepLabel, { tutor: nextSubjects }, {})
    },
    [handleStepData, stepLabel]
  )

  const handleAddSubject = () => {
    if (!subject) return

    setSelectedSubjects((prev) => {
      if (prev.some((s) => s._id === subject.value) || prev.length >= 5)
        return prev

      const next = [...prev, { _id: subject.value, title: subject.title }]

      handleStepData(stepLabel, { tutor: next }, {})
      return next
    })

    setSubject(null)
  }

  const handleDeleteSubject = (itemToDelete) => {
    setSelectedSubjects((prev) => {
      const next = prev.filter((s) => s._id !== itemToDelete._id)
      handleStepData(stepLabel, { tutor: next }, {})
      return next
    })
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true)
        const { data } = await axios.get('/api/subjects/categories')

        setCategories(data.map((cat) => ({ title: cat, value: cat })))
      } catch (error) {
        console.error('Failed to load categories', error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (!selectedCategory) {
      setSubjects([])
      return
    }

    const fetchSubjects = async () => {
      try {
        setIsLoadingSubjects(true)
        const { data } = await axios.get('/api/subjects', {
          params: { category: selectedCategory }
        })

        setSubjects(data.map((s) => ({ title: s.title, value: s._id })))
      } catch (error) {
        console.error('Failed to load subjects', error)
      } finally {
        setIsLoadingSubjects(false)
      }
    }

    fetchSubjects()
  }, [selectedCategory])

  useEffect(() => {
    if (Array.isArray(stepData?.[stepLabel]?.tutor)) {
      setSelectedSubjects(stepData[stepLabel].tutor)
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
            loading={isLoadingCategories}
            onChange={(_, newValue) => {
              const nextCategory = newValue?.value || ''
              if (nextCategory !== selectedCategory) {
                setSelectedCategory(nextCategory)
                setSubject('')
                setSelectedSubjects([])
                syncContext([])
              }
            }}
            options={categories}
            textFieldProps={{
              placeholder: t('becomeTutor.categories.mainSubjectsLabel'),
              label: t('becomeTutor.categories.mainSubjectsLabel')
            }}
            value={
              categories.find((item) => item.value === selectedCategory) || null
            }
          />

          <AppAutoComplete
            ListboxProps={{ style: styles.autoCompleteListBox }}
            disabled={!selectedCategory || isLoadingSubjects}
            getOptionLabel={(option) => option.title}
            loading={isLoadingSubjects}
            onChange={(_, newValue) => {
              setSubject(newValue || null)
            }}
            options={subjects}
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
              items={selectedSubjects.map((s) => s.title)}
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
