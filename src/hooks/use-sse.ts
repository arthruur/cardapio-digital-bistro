import { useEffect, useState } from 'react'
import { TableData } from '../lib/types'

interface SSEResponse {
  data: TableData[]
}

export function useSSE() {
  const [data, setData] = useState<TableData[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let eventSource: EventSource | null = null
    let reconnectTimeout: NodeJS.Timeout

    const connect = () => {
      try {
        eventSource = new EventSource('/api/sse')
        
        eventSource.onopen = () => {
          console.log('Conexão SSE estabelecida')
          setIsConnected(true)
          setError(null)
        }

        eventSource.onmessage = (event) => {
          try {
            const parsedData = JSON.parse(event.data) as SSEResponse
            setData(parsedData.data)
          } catch (err) {
            console.error('Erro ao processar dados SSE:', err)
            setError(err instanceof Error ? err : new Error('Erro ao processar dados'))
          }
        }

        eventSource.onerror = (err) => {
          console.error('Erro na conexão SSE:', err)
          setError(new Error('Erro na conexão SSE'))
          setIsConnected(false)
          eventSource?.close()
          
          // Tentar reconectar após 5 segundos
          reconnectTimeout = setTimeout(connect, 5000)
        }
      } catch (err) {
        console.error('Erro ao criar conexão SSE:', err)
        setError(new Error('Erro ao criar conexão SSE'))
        setIsConnected(false)
        
        // Tentar reconectar após 5 segundos
        reconnectTimeout = setTimeout(connect, 5000)
      }
    }

    connect()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
    }
  }, [])

  return { data, error, isConnected }
} 