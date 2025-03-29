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
      const orders = await db.order.findMany({
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return orders.map((order) => ({
        id: order.id,
        tableNumber: order.tableNumber,
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes,
        })),
      }))
    } catch (err) {
      console.error('Erro ao buscar dados:', err)
      return []
    }
  }

  // Enviar dados iniciais
  const initialData = await fetchData()
  sendEvent({ data: initialData })

  // Configurar intervalo para enviar atualizações
  const interval = setInterval(async () => {
    const updatedData = await fetchData()
    sendEvent({ data: updatedData })
  }, 5000)

  // Limpar intervalo quando a conexão for fechada
  req.on('close', () => {
    clearInterval(interval)
  })
} 