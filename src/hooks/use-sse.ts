import { useEffect, useState } from 'react'
import { TableData } from '@/lib/types'

export function useSSE() {
  const [data, setData] = useState<TableData[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const eventSource = new EventSource('/api/sse')

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data)
        setData(parsedData.data)
      } catch (err) {
        console.error('Erro ao processar dados SSE:', err)
        setError(err instanceof Error ? err : new Error('Erro ao processar dados'))
      }
    }

    eventSource.onerror = (err) => {
      console.error('Erro na conexão SSE:', err)
      setError(new Error('Erro na conexão SSE'))
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return { data, error }
} 