// pages/api/orders/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { orders } from '../../../lib/orders'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'PATCH') {
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ message: 'O campo "status" é obrigatório.' })
    }

    const orderIndex = orders.findIndex(order => order.id === id)
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Pedido não encontrado.' })
    }

    orders[orderIndex].status = status
    return res.status(200).json({ message: 'Status atualizado com sucesso.', order: orders[orderIndex] })
  } else {
    res.status(405).json({ message: 'Método não permitido.' })
  }
}
