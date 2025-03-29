import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tableId } = req.query

  // Método GET: Buscar todas as mesas ou uma mesa específica
  if (req.method === 'GET') {
    try {
      const tables = tableId
        ? await db.table.findUnique({
            where: { number: Number(tableId) },
            include: { Order: true },
          })
        : await db.table.findMany({ include: { Order: true } })

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
        data: {
          number: Number(number), // garante que é um inteiro
          status: status.toUpperCase() // transforma para o formato esperado (AVAILABLE, OCCUPIED, etc.)
        } as Prisma.TableUncheckedCreateInput // type assertion para indicar que os campos com valor default podem ser omitidos
      })
      return res.status(201).json({ message: 'Mesa criada com sucesso!', table: newTable })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao criar mesa' })
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
          Order: { create: newOrder },
        },
        include: { Order: true },
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