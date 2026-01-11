import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import AppContentSwitcher from '../../../../components/app-content-switcher/AppContentSwitcher'

const switchOptions = {
  left: { text: 'Left', tooltip: 'Left tooltip' },
  right: { text: 'Right', tooltip: 'Right tooltip' }
}

describe('AppContentSwitcher', () => {
  it('should render with the correct props', () => {
    render(
      <AppContentSwitcher
        active
        onChange={vi.fn()}
        switchOptions={switchOptions}
        typographyVariant='body1'
      />
    )
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
    const input = screen.getByTestId('switch').querySelector('input')
    expect(input).toBeChecked()
  })
  it('should call the onChange function when the switch is clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <AppContentSwitcher
        active={false}
        onChange={onChange}
        switchOptions={switchOptions}
        typographyVariant='body1'
      />
    )
    const input = screen.getByTestId('switch').querySelector('input')
    await user.click(input)
    expect(onChange).toHaveBeenCalledTimes(1)
  })
  it('should render tooltips when tooltip props are passed', async () => {
    const user = userEvent.setup()
    render(
      <AppContentSwitcher
        active
        onChange={vi.fn()}
        switchOptions={switchOptions}
        typographyVariant='body1'
      />
    )
    const leftText = screen.getByText('Left')
    await user.hover(leftText)
    expect(await screen.findByText('Left tooltip')).toBeInTheDocument()
    await user.unhover(leftText)
  })
})
