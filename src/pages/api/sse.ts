import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Configurar headers para SSE
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // Função para enviar eventos
  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  // Função para buscar dados atualizados
  const fetchData = async () => {
    try {
      const tables = await db.table.findMany({
        include: {
          orders: {
            include: {
              items: true
            }
          }
        }
      })
      return tables
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      return null
    }
  }

  // Enviar dados iniciais
  const initialData = await fetchData()
  if (initialData) {
    sendEvent({ type: 'initial', data: initialData })
  }

  // Configurar intervalo de atualização
  const interval = setInterval(async () => {
    const updatedData = await fetchData()
    if (updatedData) {
      sendEvent({ type: 'update', data: updatedData })
    }
  }, 5000) // Atualiza a cada 5 segundos

  // Limpar intervalo quando a conexão for fechada
  req.on('close', () => {
    clearInterval(interval)
  })
} 