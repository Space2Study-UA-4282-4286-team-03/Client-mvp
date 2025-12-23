import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import EnhancedTableRow from '~/components/enhanced-table/enhanced-table-row/EnhancedTableRow'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key })
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}))

const openMenuMock = vi.fn()
const closeMenuMock = vi.fn()

vi.mock('~/hooks/use-menu', () => ({
  default: () => ({
    openMenu: openMenuMock,
    closeMenu: closeMenuMock,
    renderMenu: (items) => (
      <div
        data-testid='menu'
        onKeyDown={(e) => e.key === 'Escape' && closeMenuMock()}
        tabIndex={0}
      >
        {items}
      </div>
    )
  })
}))

describe('EnhancedTableRow component', () => {
  const handleSelectClickMock = vi.fn()
  const isSelectedMock = vi.fn(() => false)
  const onActionMock = vi.fn()

  beforeEach(() => {
    const item = {
      _id: '123',
      name: 'TestName'
    }

    vi.clearAllMocks()

    render(
      <table>
        <tbody>
          <EnhancedTableRow
            columns={[{ field: 'name', label: 'Name' }]}
            isSelection
            item={item}
            onRowClick={() => {}}
            refetchData={vi.fn()}
            rowActions={[{ label: 'Delete', func: onActionMock }]}
            select={{
              isSelected: isSelectedMock,
              handleSelectClick: handleSelectClickMock
            }}
            selectedRows={[item]}
          />
        </tbody>
      </table>
    )
  })

  it('render table row with correct data', () => {
    expect(screen.getByText('TestName')).toBeInTheDocument()
  })

  it('call handleSelectClick when checkbox is clicked', async () => {
    const user = userEvent.setup()
    const checkbox = screen.getByRole('checkbox')

    await user.click(checkbox)

    expect(handleSelectClickMock).toHaveBeenCalledTimes(1)
  })

  it('render action menu when menu icon is clicked', async () => {
    const user = userEvent.setup()
    const menuIcon = screen.getByTestId('menu-icon')

    await user.click(menuIcon)

    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('call onAction function when clicking on the menu item', async () => {
    const user = userEvent.setup()

    const menuIcon = screen.getByTestId('menu-icon')
    await user.click(menuIcon)

    const actionButton = screen.getByText('Delete')
    await user.click(actionButton)

    expect(onActionMock).toHaveBeenCalledWith('123')
  })

  it('close menu when "escape" is pressed', async () => {
    const user = userEvent.setup()
    const menuIcon = screen.getByTestId('menu-icon')

    await user.click(menuIcon)

    const menu = screen.getByTestId('menu')
    menu.focus()

    await user.keyboard('{Escape}')

    expect(closeMenuMock).toHaveBeenCalledTimes(1)
  })
})
