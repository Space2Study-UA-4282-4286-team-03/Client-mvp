import { useCallback, useState } from 'react'

import useAxios from '~/hooks/use-axios'
import { useAppSelector } from '~/hooks/use-redux'

import { useModalContext } from '~/context/modal-context'
import { useStepContext } from '~/context/step-context'
import { useSnackBarContext } from '~/context/snackbar-context'
import { userService } from '~/services/user-service'
import { snackbarVariants } from '~/constants'
import { uploadPhotoFile } from '~/utils/uploadFile'

const useSteps = ({ steps }) => {
  const [activeStep, setActiveStep] = useState(0)
  const { closeModal } = useModalContext()
  const { stepData } = useStepContext()
  const { setAlert } = useSnackBarContext()
  const { userId } = useAppSelector((state) => state.appMain)

  const updateUser = useCallback(
    (data) => userService.updateUser(userId, data),
    [userId]
  )

  const handleResponseError = (error) => {
    setAlert({
      severity: snackbarVariants.error,
      message: error ? `errors.${error.code}` : ''
    })
  }

  const handleResponse = () => {
    setAlert({
      severity: snackbarVariants.success,
      message: 'becomeTutor.successMessage'
    })
    closeModal()
  }

  const { loading, fetchData } = useAxios({
    service: updateUser,
    fetchOnMount: false,
    defaultResponse: null,
    onResponse: handleResponse,
    onResponseError: handleResponseError
  })

  const stepErrors = Object.values(stepData).map(
    (data) =>
      data && data.errors && Object.values(data.errors).find((error) => error)
  )

  const next = () => {
    setActiveStep((prev) => prev + 1)
  }

  const back = () => {
    setActiveStep((prev) => prev - 1)
  }

  const isLastStep = activeStep === steps.length - 1

  const handleSubmit = async () => {
    const hasErrors = stepErrors.find((error) => error)

    if (hasErrors) return

    const { firstName, lastName, country, city, professionalSummary } =
      stepData.generalInfo.data

    const file = stepData.photo?.[0]

    console.log('Submitting file:', stepData)

    const photoUrl = await uploadPhotoFile(file)

    const data = {
      photo: photoUrl,
      firstName,
      lastName,
      address: {
        country: country ?? '',
        city: city ?? ''
      },
      professionalSummary,
      mainSubjects: stepData.subjects.tutor?.map((item) =>
        typeof item === 'object' ? item._id : item
      ),
      nativeLanguage: stepData.language?.language || stepData.language || ''
    }

    fetchData(data)
  }

  const stepOperation = {
    next,
    back,
    handleSubmit,
    setActiveStep
  }

  return { activeStep, stepErrors, isLastStep, stepOperation, loading }
}

export default useSteps
