import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId } = req.query
  
  if (req.method === 'PATCH') {
    const { status } = req.body
    
    if (!status) {
      return res.status(400).json({ message: 'Status é obrigatório' })
    }
    
    try {
      const updatedOrder = await db.order.update({
        where: { id: String(orderId) },
        data: { status },
        include: { items: true, table: true }
      })
      
      return res.status(200).json({ message: 'Pedido atualizado com sucesso', order: updatedOrder })
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error)
      return res.status(500).json({ message: 'Erro ao atualizar pedido', error })
    }
  }
  
  res.setHeader('Allow', ['PATCH'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
