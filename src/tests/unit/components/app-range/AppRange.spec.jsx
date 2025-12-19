import { describe, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AppRange from '~/components/app-range/AppRange'

vi.mock('~/hooks/use-debounce', () => ({
  useDebounce: (fn) => fn
}))

describe('AppRange component', () => {
  const onChangeMock = vi.fn()

  beforeEach(() => {
    onChangeMock.mockClear()
    render(
      <AppRange max={100} min={0} onChange={onChangeMock} value={[10, 50]} />
    )
  })

  it('renders correctly', () => {
    expect(screen.getAllByRole('slider')).toHaveLength(2)
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
  })

  it('call onChange when slider is moved', () => {
    const sliders = screen.getAllByRole('slider')

    fireEvent.change(sliders[0], { target: { value: 20 } })

    expect(onChangeMock).toHaveBeenCalled()
  })

  it('call onChange when input is changed', async () => {
    const user = userEvent.setup()
    const input = screen.getAllByRole('textbox')[0]

    await user.clear(input)
    await user.type(input, '25')

    expect(onChangeMock).toHaveBeenCalledWith([25, 50])
  })

  it('not call onChange when input is changed with not a number', async () => {
    const user = userEvent.setup()
    const input = screen.getAllByRole('textbox')[0]

    await user.clear(input)
    await user.type(input, 'abc')

    expect(onChangeMock).toHaveBeenCalledWith([0, 50])
  })

  it('call onChange with min number if input is empty', async () => {
    const user = userEvent.setup()
    const input = screen.getAllByRole('textbox')[0]

    await user.clear(input)

    expect(onChangeMock).toHaveBeenCalled()
  })

  it('update prices when input is blurred and input is greater than max value', async () => {
    const user = userEvent.setup()
    const input = screen.getAllByRole('textbox')[1]

    await user.clear(input)
    await user.type(input, '200')
    await user.tab()

    expect(input).toHaveValue('100')
  })

  it('not update prices when input is blurred and value in input has not changed', async () => {
    const user = userEvent.setup()
    await user.tab()

    expect(onChangeMock).not.toHaveBeenCalled()
  })
})
