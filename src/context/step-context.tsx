import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode
} from 'react'

interface StepContextValue {
  stepData: Record<string, unknown>
}

interface GeneralInfoData {
  firstName: string
  lastName: string
  email: string
}

interface SubjectsData {
  subjects: string[]
}

interface LanguageData {
  language: string | null
}

type PhotoData = File[]

interface StepContextValue {
  stepData: {
    general: {
      data: GeneralInfoData
      errors: Record<string, string>
    }
    subjects: SubjectsData
    language: LanguageData
    photo: PhotoData
  }
  handleStepData: <T>(
    stepLabel: string,
    data: T,
    errors?: Record<string, string>
  ) => void
}

interface StepProviderProps {
  children: ReactNode
  initialValues: unknown
  stepLabels: string[]
}

const StepContext = createContext<StepContextValue | undefined>(undefined)

const StepProvider = ({
  children,
  initialValues,
  stepLabels
}: StepProviderProps) => {
  const [generalData, setGeneralData] = useState({
    data: initialValues,
    errors: {}
  })
  const [subject, setSubject] = useState([])
  const [language, setLanguage] = useState(null)
  const [photo, setPhoto] = useState([])
  const [generalLabel, subjectLabel, languageLabel, photoLabel] = stepLabels

  const stepData: Record<string, unknown> = {
    [generalLabel]: generalData,
    [subjectLabel]: subject,
    [languageLabel]: language,
    [photoLabel]: photo
  }

  const handleStepData = useCallback(
    <T,>(stepLabel: string, data: T, errors?: Record<string, string>) => {
      switch (stepLabel) {
        case generalLabel:
          setGeneralData({
            data: data as GeneralInfoData,
            errors: errors ?? {}
          })
          break
        case subjectLabel:
          setSubject(data as SubjectsData)
          break
        case languageLabel:
          setLanguage(data as LanguageData)
          break
        case photoLabel:
          setPhoto(data as PhotoData)
          break
      }
    },
    [generalLabel, subjectLabel, languageLabel, photoLabel]
  )

  return (
    <StepContext.Provider value={{ stepData, handleStepData }}>
      {children}
    </StepContext.Provider>
  )
}

const useStepContext = (): StepContextValue => {
  const context = useContext(StepContext)
  if (!context) {
    throw new Error('useStepContext must be used within StepProvider')
  }
  return context
}

export { StepProvider, useStepContext }
