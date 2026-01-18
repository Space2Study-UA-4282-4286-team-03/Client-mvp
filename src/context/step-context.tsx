import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode
} from 'react'

interface StepContextValue {
  stepData: {
    general: { data: GeneralInfoData; errors: Record<string, string> }
    subjects: SubjectsData
    language: LanguageData
    photo: PhotoData
  }
  handleStepData: (
    step: keyof StepContextValue['stepData'],
    data: unknown,
    errors?: Record<string, string>
  ) => void
}

interface GeneralInfoData {
  firstName: string
  lastName: string
  summaryProfessional?: string
  country?: string
  city?: string
}

interface SubjectsData {
  subjects: string[]
}

interface LanguageData {
  language: string | null
}

type PhotoData = File[]

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
    data: initialValues as GeneralInfoData,
    errors: {}
  })
  const [subject, setSubject] = useState<SubjectsData>({ subjects: [] })
  const [language, setLanguage] = useState<LanguageData>({ language: null })
  const [photo, setPhoto] = useState<PhotoData>([])
  const [generalLabel, subjectLabel, languageLabel, photoLabel] = stepLabels

  const stepData: StepContextValue['stepData'] = {
    general: generalData,
    subjects: subject,
    language: language,
    photo: photo
  }

  const handleStepData = useCallback(
    (stepLabel: string, data: unknown, errors?: Record<string, string>) => {
      switch (stepLabel) {
        case generalLabel:
          setGeneralData({
            data: data as GeneralInfoData,
            errors: errors || {}
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
        default:
          return
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
