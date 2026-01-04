import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { locationsService } from '~/services/locations-service'
import { useStepContext } from '~/context/step-context'
import { useAppSelector } from '~/hooks/use-redux'
import useAxios from '~/hooks/use-axios'
import { userService } from '~/services/user-service'

import GeneralInfoStep from '~/containers/tutor-home-page/general-info-step/GeneralInfoStep'
let lastCountryService = null
let lastCityService = null
/* =======================
   MOCKS
======================= */
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const map = {
        'common.labels.firstName': 'First name',
        'common.labels.lastName': 'Last name',
        'common.labels.country': 'Country',
        'common.labels.city': 'City',
        'becomeTutor.generalInfo.textFieldLabel': 'Professional summary'
      }
      return map[key] ?? key
    }
  })
}))

vi.mock('~/context/step-context', () => ({
  useStepContext: vi.fn()
}))

vi.mock('~/hooks/use-redux', () => ({
  useAppSelector: vi.fn()
}))

vi.mock('~/hooks/use-axios', () => ({
  __esModule: true,
  default: vi.fn()
}))

vi.mock('~/components/async-autocomlete/AsyncAutocomplete', () => ({
  default: (props) => {
    const testId =
      props['data-testid'] ||
      props.textFieldProps?.inputProps?.['data-testid'] ||
      'autocomplete'
    if (testId === 'autocomplete-country') lastCountryService = props.service
    if (testId === 'autocomplete-city') lastCityService = props.service

    const { value, onChange } = props
    return (
      <select
        data-testid={testId}
        onChange={(e) =>
          onChange(null, e.target.value ? { id: e.target.value } : null)
        }
        value={value || ''}
      >
        <option value='' />
        <option value='opt-1'>One</option>
        <option value='opt-2'>Two</option>
      </select>
    )
  }
}))

/* =======================
   TEST DATA
======================= */

const mockHandleStepData = vi.fn()

const stepLabel = 'GENERAL'

const mockStepData = {
  [stepLabel]: {
    data: {
      firstName: 'Jason',
      lastName: 'Statham',
      country: 'opt-1',
      city: 'opt-2',
      professionalSummary: 'Teacher'
    }
  }
}

/* =======================
   SETUP
======================= */

const setup = () => {
  useStepContext.mockReturnValue({
    stepData: mockStepData,
    handleStepData: mockHandleStepData
  })

  useAppSelector.mockReturnValue({
    userId: '1',
    userRole: 'tutor'
  })

  useAxios.mockReturnValue({ response: null })

  return render(
    <GeneralInfoStep btnsBox={<div>buttons</div>} stepLabel={stepLabel} />
  )
}
beforeEach(() => {
  vi.clearAllMocks()
  lastCountryService = null
  lastCityService = null
  useAppSelector.mockReturnValue({ userId: '1', userRole: 'tutor' })
  useAxios.mockReturnValue({ response: null })
})
/* =======================
   TESTS
======================= */
test('fetchCountries calls locationsService.getCountries via service prop', async () => {
  const spy = vi
    .spyOn(locationsService, 'getCountries')
    .mockResolvedValue([{ id: '1', name: 'C' }])

  useStepContext.mockReturnValue({
    stepData: {},
    handleStepData: mockHandleStepData
  })
  render(<GeneralInfoStep btnsBox={<div />} stepLabel={stepLabel} />)

  expect(lastCountryService).toBeDefined()
  await lastCountryService()
  expect(spy).toHaveBeenCalled()

  spy.mockRestore()
})

test('handleCountryChange: selecting empty value sets country and city to null', async () => {
  useStepContext.mockReturnValue({
    stepData: {
      [stepLabel]: { data: { country: 'opt-1', city: 'opt-2' }, errors: {} }
    },
    handleStepData: mockHandleStepData
  })

  render(<GeneralInfoStep btnsBox={<div />} stepLabel={stepLabel} />)

  const country = await screen.findByTestId('autocomplete-country')
  // select empty option (value === '')
  await userEvent.selectOptions(country, '')

  expect(mockHandleStepData).toHaveBeenLastCalledWith(
    stepLabel,
    expect.objectContaining({ country: null, city: null }),
    expect.any(Object)
  )
})

test('useEffect: when userResp present and not fetched, handleStepData called with pref and errs', async () => {
  const mockUser = {
    firstName: 'UserX',
    lastName: 'Y',
    address: { country: 'opt-1', city: 'opt-2' },
    professionalSummary: 'a'.repeat(80)
  }
  const setIsUserFetched = vi.fn()

  useStepContext.mockReturnValue({
    stepData: {},
    handleStepData: mockHandleStepData
  })
  useAppSelector.mockReturnValue({ userId: '1', userRole: 'tutor' })
  useAxios.mockReturnValue({ response: mockUser })

  render(
    <GeneralInfoStep
      btnsBox={<div />}
      isUserFetched={false}
      setIsUserFetched={setIsUserFetched}
      stepLabel={stepLabel}
    />
  )

  // wait for effect to run and handleStepData to be called
  await new Promise((r) => setTimeout(r, 0))

  expect(setIsUserFetched).toHaveBeenCalledWith(true)
  expect(mockHandleStepData).toHaveBeenCalled()

  const [labelArg, prefArg, errsArg] = mockHandleStepData.mock.calls[0]
  expect(labelArg).toBe(stepLabel)
  expect(prefArg).toEqual(
    expect.objectContaining({
      firstName: 'UserX',
      lastName: 'Y',
      country: 'opt-1',
      city: 'opt-2'
    })
  )
  expect(errsArg.professionalSummary).toBe('common.errorMessages.longText')
})

test('fetchUser calls userService.getUserById with userId and userRole', () => {
  const mockUser = { firstName: 'Svc' }
  const setIsUserFetched = vi.fn()

  useAppSelector.mockReturnValue({ userId: '42', userRole: 'student' })
  useStepContext.mockReturnValue({
    stepData: {},
    handleStepData: mockHandleStepData
  })

  const spy = vi.spyOn(userService, 'getUserById').mockReturnValue(mockUser)

  useAxios.mockImplementation(({ service }) => ({
    response: service ? service() : null
  }))

  render(
    <GeneralInfoStep
      btnsBox={<div />}
      isUserFetched={false}
      setIsUserFetched={setIsUserFetched}
      stepLabel={stepLabel}
    />
  )

  expect(spy).toHaveBeenCalledWith('42', 'student')
  spy.mockRestore()
})

test('fetchCities calls locationsService.getCitiesByCountry when country is set', async () => {
  const spy = vi
    .spyOn(locationsService, 'getCitiesByCountry')
    .mockResolvedValue([{ id: '1', name: 'City' }])

  useStepContext.mockReturnValue({
    stepData: { [stepLabel]: { data: { country: 'country-1' }, errors: {} } },
    handleStepData: mockHandleStepData
  })

  render(<GeneralInfoStep btnsBox={<div />} stepLabel={stepLabel} />)

  expect(lastCityService).toBeDefined()
  await lastCityService()
  expect(spy).toHaveBeenCalledWith('country-1')

  spy.mockRestore()
})

test('fetchCities resolves to [] when country is not set', async () => {
  useStepContext.mockReturnValue({
    stepData: { [stepLabel]: { data: { country: null }, errors: {} } },
    handleStepData: mockHandleStepData
  })

  render(<GeneralInfoStep btnsBox={<div />} stepLabel={stepLabel} />)

  expect(lastCityService).toBeDefined()
  await expect(lastCityService()).resolves.toEqual([])
})

test('fills fields from userResp and calls setIsUserFetched', async () => {
  const mockUser = {
    firstName: 'Alice',
    lastName: 'Smith',
    address: { country: 'opt-1', city: 'opt-2' },
    professionalSummary: 'Experienced teacher'
  }
  const setIsUserFetched = vi.fn()

  useStepContext.mockReturnValue({
    stepData: {},
    handleStepData: mockHandleStepData
  })
  useAppSelector.mockReturnValue({ userId: '1', userRole: 'tutor' })
  useAxios.mockReturnValue({ response: mockUser })

  render(
    <GeneralInfoStep
      btnsBox={<div>buttons</div>}
      isUserFetched={false}
      setIsUserFetched={setIsUserFetched}
      stepLabel={stepLabel}
    />
  )

  expect(await screen.findByDisplayValue('Alice')).toBeInTheDocument()
  const country = await screen.findByTestId('autocomplete-country')
  expect(country.value).toBe('opt-1')

  expect(setIsUserFetched).toHaveBeenCalledWith(true)
  expect(mockHandleStepData).toHaveBeenCalled()
})

test('does not override data when isUserFetched is true', async () => {
  const mockUser = { firstName: 'Bob' }

  useStepContext.mockReturnValue({
    stepData: {},
    handleStepData: mockHandleStepData
  })
  useAxios.mockReturnValue({ response: mockUser })

  render(
    <GeneralInfoStep
      btnsBox={<div>buttons</div>}
      isUserFetched
      setIsUserFetched={vi.fn()}
      stepLabel={stepLabel}
    />
  )

  await new Promise((r) => setTimeout(r, 0)) // allow effects to run
  expect(mockHandleStepData).not.toHaveBeenCalled()
})

test('shows validation error for too long professionalSummary', async () => {
  useStepContext.mockReturnValue({
    stepData: {},
    handleStepData: mockHandleStepData
  })

  render(<GeneralInfoStep btnsBox={<div>buttons</div>} stepLabel={stepLabel} />)

  const textarea = screen.getByLabelText(/Professional summary/i)
  fireEvent.change(textarea, { target: { value: 'a'.repeat(80) } })

  const lastCall =
    mockHandleStepData.mock.calls[mockHandleStepData.mock.calls.length - 1]
  const errors = lastCall[2]
  expect(errors.professionalSummary).toBeTruthy()
})

test('changing country resets city', async () => {
  useStepContext.mockReturnValue({
    stepData: {
      [stepLabel]: { data: { country: 'opt-1', city: 'opt-2' }, errors: {} }
    },
    handleStepData: mockHandleStepData
  })

  render(<GeneralInfoStep btnsBox={<div>buttons</div>} stepLabel={stepLabel} />)

  const country = await screen.findByTestId('autocomplete-country')
  await userEvent.selectOptions(country, 'opt-2')

  expect(mockHandleStepData).toHaveBeenLastCalledWith(
    stepLabel,
    expect.objectContaining({ country: 'opt-2', city: null }),
    expect.any(Object)
  )
})

describe('GeneralInfoStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders initial values from StepContext', () => {
    setup()

    expect(screen.getByDisplayValue('Jason')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Statham')).toBeInTheDocument()

    const country = screen.getByTestId('autocomplete-country')
    const city = screen.getByTestId('autocomplete-city')

    expect(country.value).toBe('opt-1')
    expect(city.value).toBe('opt-2')
  })

  test('updates firstName and saves to StepContext', () => {
    setup()

    const input = screen.getByDisplayValue('Jason')
    fireEvent.change(input, { target: { value: 'Mike' } })

    expect(mockHandleStepData).toHaveBeenLastCalledWith(
      stepLabel,
      expect.objectContaining({ firstName: 'Mike' }),
      expect.any(Object)
    )
  })

  test('changing country resets city', () => {
    setup()

    const countrySelect = screen.getByTestId('autocomplete-country')
    expect(countrySelect.value).toBe('opt-1')
    fireEvent.change(countrySelect, { target: { value: 'opt-2' } })

    expect(mockHandleStepData).toHaveBeenLastCalledWith(
      stepLabel,
      expect.objectContaining({
        country: 'opt-2',
        city: null
      }),
      expect.any(Object)
    )
  })

  test('changing city saves city id', () => {
    setup()

    const citySelect = screen.getByTestId('autocomplete-city')
    fireEvent.change(citySelect, { target: { value: 'opt-1' } })

    expect(mockHandleStepData).toHaveBeenLastCalledWith(
      stepLabel,
      expect.objectContaining({
        city: 'opt-1'
      }),
      expect.any(Object)
    )
  })
})
