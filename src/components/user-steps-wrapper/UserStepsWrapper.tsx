import { FC } from 'react'

import { StepProvider } from '~/context/step-context'
import {
  tutorStepLabels,
  initialValues
} from '~/components/user-steps-wrapper/constants'
import { student } from '~/constants'
import UserStepsContent from '~/components/user-steps-content/userStepsContent'

interface UserStepsWrapperProps {
  userRole: string
}

const UserStepsWrapper: FC<UserStepsWrapperProps> = ({ userRole }) => {
  const stepLabels = userRole === student ? '' : tutorStepLabels

  return (
    <StepProvider initialValues={initialValues} stepLabels={stepLabels}>
      <UserStepsContent userRole={userRole} />
    </StepProvider>
  )
}

export default UserStepsWrapper
