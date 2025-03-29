import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.query
  const { status } = req.body

  if (!id || !status) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const order = await db.order.update({
      where: { id: String(id) },
      data: { status },
    })

    return res.status(200).json(order)
  } catch (err) {
    console.error('Erro ao atualizar pedido:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 