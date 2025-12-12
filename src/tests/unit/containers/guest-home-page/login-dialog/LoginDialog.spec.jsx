import { screen, fireEvent, waitFor } from '@testing-library/react'
import LoginDialog from '~/containers/guest-home-page/login-dialog/LoginDialog'
import { renderWithProviders } from '~tests/test-utils'
import { vi } from 'vitest'
import { accessToken } from '~tests/unit/redux/redux.variables'

const mockCloseModal = vi.fn()
const mockSetAlert = vi.fn()
const mockSelector = vi.fn()
const unwrap = vi.fn().mockResolvedValue({ accessToken })
const loginUser = vi.fn().mockReturnValue({ unwrap })

const mockState = {
  appMain: { authLoading: false }
}

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux')
  return {
    ...actual,
    useSelector: () => mockSelector.mockReturnValue(mockState)
  }
})

vi.mock('~/hooks/use-confirm', () => {
  return {
    default: () => ({ setNeedConfirmation: () => true })
  }
})

vi.mock('~/context/modal-context', async () => {
  const actual = await vi.importActual('~/context/modal-context')
  return {
    ...actual,
    useModalContext: () => ({
      closeModal: mockCloseModal,
      openModal: vi.fn()
    })
  }
})

vi.mock('~/context/snackbar-context', async () => {
  const actual = await vi.importActual('~/context/snackbar-context')
  return {
    ...actual,
    useSnackBarContext: () => ({
      setAlert: mockSetAlert
    })
  }
})

vi.mock('~/containers/guest-home-page/google-button/GoogleButton', () => ({
  __esModule: true,
  default: function () {
    return <button>Google</button>
  }
}))

vi.mock('~/services/auth-service', async () => {
  const actual = await vi.importActual('~/services/auth-service')
  return {
    ...actual,
    useLoginMutation: () => [loginUser]
  }
})

describe('Login dialog test', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    unwrap.mockResolvedValue({ accessToken })
    renderWithProviders(<LoginDialog />)
  })

  it('should render img', () => {
    const img = screen.getByAltText(/login/i)

    expect(img).toBeInTheDocument()
  })

  it('should render head text', () => {
    const text = screen.getByText(/login.head/i)

    expect(text).toBeInTheDocument()
  })

  it('should render email input', () => {
    const inputEmail = screen.getByLabelText(/common.labels.email/i)

    expect(inputEmail).toBeInTheDocument()
  })

  it('should render password input', () => {
    const inputPassword = screen.getByLabelText(/common.labels.password/i)

    expect(inputPassword).toBeInTheDocument()
  })

  it('should render login button', () => {
    const button = screen.getByText('common.labels.login')

    expect(button).toBeInTheDocument()
  })

  it('should render Google login button', () => {
    const googleButton = screen.getByText('Google')

    expect(googleButton).toBeInTheDocument()
  })

  it('should change email value', () => {
    const inputEmail = screen.getByLabelText(/common.labels.email/i)
    fireEvent.change(inputEmail, { target: { value: 'test@mail.com' } })

    expect(inputEmail.value).toBe('test@mail.com')
  })

  it('should change password value', () => {
    const inputPassword = screen.getByLabelText(/common.labels.password/i)
    fireEvent.change(inputPassword, { target: { value: 'test' } })

    expect(inputPassword.value).toBe('test')
  })

  it('should show error when email is empty', () => {
    const inputEmail = screen.getByLabelText(/common.labels.email/i)
    fireEvent.focusOut(inputEmail)

    const error = screen.getByText('common.errorMessages.emptyField')

    expect(error).toBeInTheDocument()
  })

  it('should call loginUser with correct data on submit', async () => {
    const inputEmail = screen.getByLabelText(/common.labels.email/i)
    fireEvent.change(inputEmail, { target: { value: 'test@gmail.com' } })

    const inputPassword = screen.getByLabelText(/common.labels.password/i)
    fireEvent.change(inputPassword, { target: { value: '12345678a/A' } })

    const button = screen.getByText('common.labels.login')
    fireEvent.click(button)

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledTimes(1)
      expect(loginUser).toHaveBeenCalledWith({
        email: 'test@gmail.com',
        password: '12345678a/A'
      })
    })
  })

  it('should close modal after successful login', async () => {
    const inputEmail = screen.getByLabelText(/common.labels.email/i)
    fireEvent.change(inputEmail, { target: { value: 'test@gmail.com' } })

    const inputPassword = screen.getByLabelText(/common.labels.password/i)
    fireEvent.change(inputPassword, { target: { value: '12345678a/A' } })

    const button = screen.getByText('common.labels.login')
    fireEvent.click(button)

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledTimes(1)
      expect(mockCloseModal).toHaveBeenCalledTimes(1)
    })
  })

  it('should not submit form with invalid email', async () => {
    const inputEmail = screen.getByLabelText(/common.labels.email/i)
    fireEvent.change(inputEmail, { target: { value: 'invalid-email' } })
    fireEvent.focusOut(inputEmail)

    const inputPassword = screen.getByLabelText(/common.labels.password/i)
    fireEvent.change(inputPassword, { target: { value: '12345678a/A' } })

    const button = screen.getByText('common.labels.login')
    fireEvent.click(button)

    await waitFor(() => {
      expect(loginUser).not.toHaveBeenCalled()
    })
  })
})

describe('Login dialog test - error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock failed login
    unwrap.mockRejectedValueOnce({ data: { code: 'INVALID_CREDENTIALS' } })
    renderWithProviders(<LoginDialog />)
  })

  it('should show error snackbar when login fails', async () => {
    const inputEmail = screen.getByLabelText(/common.labels.email/i)
    fireEvent.change(inputEmail, { target: { value: 'test@gmail.com' } })

    const inputPassword = screen.getByLabelText(/common.labels.password/i)
    fireEvent.change(inputPassword, { target: { value: 'wrongpassword' } })

    const button = screen.getByText('common.labels.login')
    fireEvent.click(button)

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledTimes(1)
      expect(mockSetAlert).toHaveBeenCalledWith({
        severity: 'error',
        message: 'errors.INVALID_CREDENTIALS'
      })
      expect(mockCloseModal).not.toHaveBeenCalled()
    })
  })
})
