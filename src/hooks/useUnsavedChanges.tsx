import { useEffect, useRef } from 'react'
import useConfirm from '~/hooks/use-confirm'
import { isEqual } from '~/utils/isEqual'

export function useUnsavedChanges<T>(data: T, options?: { enabled?: boolean }) {
  const { setNeedConfirmation } = useConfirm()
  const initialRef = useRef<T | null>(null)
  const enabled = options?.enabled ?? true

  useEffect(() => {
    if (!enabled) return

    if (!initialRef.current) {
      initialRef.current = structuredClone(data)
      return
    }

    const hasChanges = !isEqual(data, initialRef.current)

    setNeedConfirmation(hasChanges)
  }, [data, enabled, setNeedConfirmation])
}
