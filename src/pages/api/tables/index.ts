import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tableId } = req.query

  // Método GET: Buscar todas as mesas ou uma mesa específica
  if (req.method === 'GET') {
    try {
      const tables = tableId
        ? await db.table.findUnique({
            where: { number: Number(tableId) },
            include: { orders: true },
          })
        : await db.table.findMany({ include: { orders: true } })

      return res.status(200).json({ tables })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao buscar mesas', error })
    }
  }

  // Método POST: Criar uma nova mesa
  if (req.method === 'POST') {
    const { number, status } = req.body

    if (!number || !status) {
      return res.status(400).json({ message: 'Número da mesa e status são obrigatórios.' })
    }

    try {
      const newTable = await db.table.create({
        data: { number, status },
      })
      return res.status(201).json({ message: 'Mesa criada com sucesso!', table: newTable })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao criar mesa', error })
    }
  }

  // Método PATCH: Adicionar pedidos a uma mesa
  if (req.method === 'PATCH') {
    const { newOrder } = req.body

    if (!tableId || !newOrder) {
      return res.status(400).json({ message: 'tableId e newOrder são obrigatórios.' })
    }

    try {
      const updatedTable = await db.table.update({
        where: { number: Number(tableId) },
        data: {
          status: 'OCCUPIED',
          orders: { create: newOrder },
        },
        include: { orders: true },
      })

      return res.status(200).json({ message: 'Pedido adicionado!', table: updatedTable })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao adicionar pedido', error })
    }
  }

  // Método PUT: Finalizar uma mesa
  if (req.method === 'PUT') {
    if (!tableId) {
      return res.status(400).json({ message: 'tableId é obrigatório.' })
    }

    try {
      await db.order.deleteMany({ where: { tableId: String(tableId) } })
      const updatedTable = await db.table.update({
        where: { id: String(tableId) },
        data: { status: 'AVAILABLE' },
      })

      return res.status(200).json({ message: 'Mesa finalizada!', table: updatedTable })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao finalizar mesa', error })
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'PUT'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
