import { useCallback, useEffect, useState } from 'react'
import { AxiosError } from 'axios'

import { ErrorResponse, ServiceFunction } from '~/types'

export interface UseAxiosProps<
  Response,
  Params = undefined,
  TransformedResponse = Response
> {
  service: ServiceFunction<Response, Params>
  defaultResponse: TransformedResponse
  fetchOnMount?: boolean
  transform?: (params: Response) => TransformedResponse
  onResponse?: (responseData: TransformedResponse) => void
  onResponseError?: (error: ErrorResponse) => void
}

interface UseAxiosReturn<TransformedResponse, Params> {
  response: TransformedResponse
  error: ErrorResponse | null
  loading: boolean
  fetchData: (params?: Params) => Promise<void>
}

const useAxios = <
  Response,
  Params = undefined,
  TransformedResponse = Response
>({
  service,
  defaultResponse,
  fetchOnMount = true,
  transform,
  onResponse,
  onResponseError
}: UseAxiosProps<Response, Params, TransformedResponse>): UseAxiosReturn<
  TransformedResponse,
  Params
> => {
  const [response, setResponse] = useState<TransformedResponse>(defaultResponse)
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(fetchOnMount)

  const fetchData = useCallback(
    async (params?: Params) => {
      try {
        setLoading(true)
        const res = await service(params)
        const responseData = transform ? transform(res.data) : res.data
        setResponse(responseData as TransformedResponse)
        setError(null)
        onResponse && onResponse(responseData as TransformedResponse)
      } catch (e) {
        const error = e as AxiosError<ErrorResponse>
        if (error.response) {
          // For 404 errors, use DOCUMENT_NOT_FOUND code if data is missing
          const status = error.response.status
          const errorData = error.response.data || {
            code: status === 404 ? 'DOCUMENT_NOT_FOUND' : 'UNKNOWN_ERROR',
            message: '',
            status
          }
          setError(errorData)
          onResponseError && onResponseError(errorData)
        } else {
          // Handle network errors or cases when response is not available (404, network error, etc.)
          const fallbackError: ErrorResponse = {
            code: 'DOCUMENT_NOT_FOUND',
            message: '',
            status: 404
          }
          setError(fallbackError)
          onResponseError && onResponseError(fallbackError)
        }
      } finally {
        setLoading(false)
      }
    },
    [service, transform, onResponse, onResponseError]
  )

  useEffect(() => {
    if (fetchOnMount) {
      void fetchData()
    }
  }, [fetchData, fetchOnMount])

  return { response, error, loading, fetchData }
}

export default useAxios
