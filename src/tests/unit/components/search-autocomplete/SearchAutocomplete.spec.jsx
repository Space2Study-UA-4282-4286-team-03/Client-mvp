import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'

import SearchAutocomplete from '~/components/search-autocomplete/SearchAutocomplete'

// mocks

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}))

let isMobileMock = false
vi.mock('~/hooks/use-breakpoints', () => ({
  default: () => ({
    isMobile: isMobileMock
  })
}))

vi.mock('~/components/app-auto-complete/AppAutoComplete', () => ({
  default: ({
    inputValue,
    onInputChange,
    onChange,
    options = [],
    textFieldProps
  }) => (
    <div>
      <input
        data-testid='autocomplete-input'
        onChange={(e) => onInputChange(e, e.target.value)}
        onKeyDown={textFieldProps?.onKeyDown}
        value={inputValue}
      />

      <ul>
        {options.map((option) => (
          <li
            data-testid='autocomplete-option'
            key={option}
            onClick={(e) => onChange(e, option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  )
}))

// tests

describe('SearchAutocomplete', () => {
  beforeEach(() => {
    isMobileMock = false
  })

  const setup = (props = {}) => {
    const setSearch = vi.fn()
    const onSearchChange = vi.fn()

    render(
      <SearchAutocomplete
        onSearchChange={onSearchChange}
        options={['apple', 'banana']}
        search=''
        setSearch={setSearch}
        textFieldProps={{}}
        {...props}
      />
    )

    return {
      input: screen.getByTestId('autocomplete-input'),
      setSearch,
      onSearchChange
    }
  }

  it('renders autocomplete input', () => {
    const { input } = setup()
    expect(input).toBeInTheDocument()
  })

  it('updates search input on typing', () => {
    const { input } = setup()

    fireEvent.change(input, { target: { value: 'app' } })

    expect(input).toHaveValue('app')
  })

  it('selects option on click', () => {
    const { setSearch, onSearchChange } = setup()

    fireEvent.click(screen.getByText('banana'))

    expect(onSearchChange).toHaveBeenCalled()
    expect(setSearch).toHaveBeenCalledWith('banana')
  })

  it('calls onSearch via button click when searchInput !== search', () => {
    const { input, setSearch, onSearchChange } = setup()

    fireEvent.change(input, { target: { value: 'new' } })
    fireEvent.click(screen.getByText('common.search'))

    expect(onSearchChange).toHaveBeenCalled()
    expect(setSearch).toHaveBeenCalledWith('new')
  })

  it('does NOT call onSearchChange when searchInput === search', () => {
    const setSearch = vi.fn()
    const onSearchChange = vi.fn()

    render(
      <SearchAutocomplete
        onSearchChange={onSearchChange}
        options={['same']}
        search='same'
        setSearch={setSearch}
        textFieldProps={{}}
      />
    )

    fireEvent.click(screen.getByText('common.search'))

    expect(onSearchChange).not.toHaveBeenCalled()
    expect(setSearch).toHaveBeenCalledWith('same')
  })

  it('clears search input and calls onSearchChange when clear icon clicked', () => {
    const setSearch = vi.fn()
    const onSearchChange = vi.fn()

    render(
      <SearchAutocomplete
        onSearchChange={onSearchChange}
        options={['apple']}
        search='apple'
        setSearch={setSearch}
        textFieldProps={{}}
      />
    )

    const clearBtn = screen.getAllByRole('button')[0]
    fireEvent.click(clearBtn)

    expect(onSearchChange).toHaveBeenCalled()
    expect(setSearch).toHaveBeenCalledWith('')
  })

  it('triggers search on Enter key', () => {
    const { input, setSearch } = setup()

    fireEvent.change(input, { target: { value: 'enter' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(setSearch).toHaveBeenCalledWith('enter')
  })

  it('does nothing on non-Enter key press', () => {
    const { input, setSearch } = setup()

    fireEvent.keyDown(input, { key: 'Escape' })

    expect(setSearch).not.toHaveBeenCalled()
  })

  it('renders mobile version of search button', () => {
    isMobileMock = true

    render(
      <SearchAutocomplete
        options={[]}
        search=''
        setSearch={vi.fn()}
        textFieldProps={{}}
      />
    )

    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
