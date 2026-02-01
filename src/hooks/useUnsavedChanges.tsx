import { useEffect, useRef } from 'react'
import useConfirm from '~/hooks/use-confirm'
import { isEqual } from '~/utils/isEqual'

export function useUnsavedChanges<T>(
  data: T,
  options?: { enabled?: boolean; initialData?: T }
) {
  const { setNeedConfirmation } = useConfirm()
  const initialRef = useRef<T | null>(options?.initialData ?? null)
  const enabled = options?.enabled ?? true

  useEffect(() => {
    if (options?.initialData) {
      initialRef.current = structuredClone(options.initialData)
    }
  }, [options?.initialData])

  useEffect(() => {
    if (!enabled) return
    if (!initialRef.current) return

    const hasChanges = !isEqual(data, initialRef.current)
    setNeedConfirmation(hasChanges)
  }, [data, enabled, setNeedConfirmation])
}
