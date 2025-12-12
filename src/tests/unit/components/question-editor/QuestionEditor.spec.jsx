import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import QuestionEditor from '~/components/question-editor/QuestionEditor'

// мок для i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}))

// мок для useMenu
const openMenu = vi.fn()
const closeMenu = vi.fn()
const renderMenu = (children) => <div data-testid='menu'>{children}</div>

vi.mock('~/hooks/use-menu', () => {
  return {
    __esModule: true,
    default: () => ({
      openMenu,
      closeMenu,
      renderMenu
    })
  }
})

const mockData = {
  type: 'oneAnswer',
  text: 'My question',
  openAnswer: '',
  answers: [
    { text: 'A1', isCorrect: false },
    { text: 'A2', isCorrect: false }
  ]
}

const handleInputChange = () => vi.fn()
const handleNonInputValueChange = vi.fn()

function renderComponent(extra = {}) {
  return render(
    <QuestionEditor
      data={mockData}
      handleInputChange={handleInputChange}
      handleNonInputValueChange={handleNonInputValueChange}
      {...extra}
    />
  )
}

test('renders question text field', () => {
  renderComponent()
  expect(screen.getByDisplayValue('My question')).toBeInTheDocument()
})

it('renders answers', () => {
  renderComponent({
    data: {
      ...mockData,
      answers: [
        { text: 'A1', isCorrect: false },
        { text: 'A2', isCorrect: false }
      ]
    }
  })

  expect(screen.getByDisplayValue('A1')).toBeInTheDocument()
  expect(screen.getByDisplayValue('A2')).toBeInTheDocument()
})

test('changes answer text calls handleNonInputValueChange', () => {
  renderComponent()

  // поле відповіді з поточним значенням 'A1'
  const answerInput = screen.getByDisplayValue('A1')
  fireEvent.change(answerInput, { target: { value: 'Updated' } })

  expect(handleNonInputValueChange).toHaveBeenCalled()
  expect(handleNonInputValueChange.mock.calls[0][0]).toBe('answers')
})

test('clicking save calls onSave', () => {
  const onSave = vi.fn()

  renderComponent({
    onSave,
    onCancel: vi.fn()
  })

  const saveBtn = screen.getByText('common.save')
  fireEvent.click(saveBtn)

  expect(onSave).toHaveBeenCalled()
})

test('click menu icon opens menu', () => {
  renderComponent({ isQuizQuestion: true })

  const menuButton = screen.getByLabelText('open-more-menu')
  fireEvent.click(menuButton)

  expect(openMenu).toHaveBeenCalled()
})
