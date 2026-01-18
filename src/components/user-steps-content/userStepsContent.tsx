import { FC, useState, ReactElement, useEffect } from 'react'

import StepWrapper from '~/components/step-wrapper/StepWrapper'
import { useStepContext } from '~/context/step-context'
import { useUnsavedChanges } from '~/hooks/useUnsavedChanges'

import GeneralInfoStep from '~/containers/tutor-home-page/general-info-step/GeneralInfoStep'
import AddPhotoStep from '~/containers/tutor-home-page/add-photo-step/AddPhotoStep'
import SubjectsStep from '~/containers/tutor-home-page/subjects-step/SubjectsStep'
import LanguageStep from '~/containers/tutor-home-page/language-step/LanguageStep'
import { student } from '~/constants'
import { tutorStepLabels } from '../user-steps-wrapper/constants'

interface UserStepsWrapperProps {
  userRole: string
}
const UserStepsContent: FC<UserStepsWrapperProps> = ({ userRole }) => {
  const { stepData, initialStepData, markAsPristine } = useStepContext()

  useUnsavedChanges(stepData, {
    enabled: true,
    initialData: initialStepData
  })

  const [isUserFetched, setIsUserFetched] = useState(false)
  useEffect(() => {
    if (isUserFetched) {
      markAsPristine()
    }
  }, [isUserFetched, markAsPristine])

  const childrenArr: ReactElement[] = [
    <GeneralInfoStep
      btnsBox
      isUserFetched={isUserFetched}
      key='1'
      setIsUserFetched={setIsUserFetched}
    />,
    <SubjectsStep btnsBox key='2' />,
    <LanguageStep btnsBox key='3' />,
    <AddPhotoStep btnsBox key='4' />
  ]

  const stepLabels = userRole === student ? '' : tutorStepLabels

  return <StepWrapper steps={stepLabels}>{childrenArr}</StepWrapper>
}

export default UserStepsContent
