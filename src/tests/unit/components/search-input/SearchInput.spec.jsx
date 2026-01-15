import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'

import SearchInput from '~/components/search-input/SearchInput'

describe('SearchInput component', () => {
  const setup = (props = {}) => {
    const setSearch = vi.fn()

    render(<SearchInput search='' setSearch={setSearch} {...props} />)

    const input = screen.getByRole('textbox')
    const searchIcon = screen.getByTestId('search-icon')
    const deleteIcon = screen.getByTestId('delete-icon')

    return {
      input,
      searchIcon,
      deleteIcon,
      setSearch
    }
  }

  it('should render text correctly', () => {
    render(<SearchInput search='hello' setSearch={vi.fn()} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('hello')
  })

  it('should call setSearch when search icon is clicked', () => {
    const { input, searchIcon, setSearch } = setup()

    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.click(searchIcon)

    expect(setSearch).toHaveBeenCalledWith('test')
  })

  it('should call setSearch with empty string when delete icon is clicked', () => {
    const setSearch = vi.fn()

    render(<SearchInput search='text' setSearch={setSearch} />)

    const deleteIcon = screen.getByTestId('delete-icon')
    fireEvent.click(deleteIcon)

    expect(setSearch).toHaveBeenCalledWith('')
  })

  it('should call setSearch when Enter is pressed', () => {
    const { input, setSearch } = setup()

    fireEvent.change(input, { target: { value: 'enter text' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })

    expect(setSearch).toHaveBeenCalledWith('enter text')
  })

  it('should have hidden class if search is empty', () => {
    const { deleteIcon } = setup({ search: '' })

    expect(deleteIcon).toHaveClass('hidden')
  })
})
