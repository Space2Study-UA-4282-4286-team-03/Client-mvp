import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import SearchFilterInput from '~/components/search-filter-input/SearchFilterInput'

describe('SearchFilterInput', () => {
  const textFieldProps = {}

  it('renders the input field', () => {
    const updateFilter = vi.fn()
    render(
      <SearchFilterInput
        textFieldProps={textFieldProps}
        updateFilter={updateFilter}
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'common.search' })
    ).toBeInTheDocument()
  })

  it('renders typed text correctly', () => {
    const updateFilter = vi.fn()
    render(
      <SearchFilterInput
        textFieldProps={textFieldProps}
        updateFilter={updateFilter}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(input).toHaveValue('test')
  })

  it('deletes typed text when clear button is clicked', () => {
    const updateFilter = vi.fn()
    render(
      <SearchFilterInput
        textFieldProps={textFieldProps}
        updateFilter={updateFilter}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    const clearBtn = screen.getByTestId('clearIcon')
    fireEvent.click(clearBtn)

    expect(input).toHaveValue('')
    expect(updateFilter).toHaveBeenCalledWith('')
  })

  it('calls updateFilter function on search button click', () => {
    const updateFilter = vi.fn()
    render(
      <SearchFilterInput
        textFieldProps={textFieldProps}
        updateFilter={updateFilter}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'iphone' } })

    const btn = screen.getByRole('button', { name: 'common.search' })
    fireEvent.click(btn)

    expect(updateFilter).toHaveBeenCalledWith('iphone')
  })

  it('calls updateFilter function when enter is pressed', () => {
    const updateFilter = vi.fn()
    render(
      <SearchFilterInput
        textFieldProps={textFieldProps}
        updateFilter={updateFilter}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'macbook' } })

    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })

    expect(updateFilter).toHaveBeenCalledWith('macbook')
  })
})
