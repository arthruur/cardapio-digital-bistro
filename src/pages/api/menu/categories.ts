import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { categoryId } = req.query

  // GET: Buscar todas as categorias
  if (req.method === 'GET') {
    try {
      const categories = await db.category.findMany({
        include: { items: true }
      })
      return res.status(200).json({ categories })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao buscar categorias', error })
    }
  }

  // POST: Criar uma nova categoria
  if (req.method === 'POST') {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Nome da categoria é obrigatório' })
    }

    try {
      const newCategory = await db.category.create({
        data: { 
          name,
          description 
        }
      })
      return res.status(201).json({
        message: 'Categoria criada com sucesso',
        category: newCategory
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao criar categoria', error })
    }
  }

  // PATCH: Atualizar uma categoria existente
  if (req.method === 'PATCH' && categoryId) {
    const { name, description } = req.body

    try {
      const updatedCategory = await db.category.update({
        where: { id: String(categoryId) },
        data: { 
          ...(name && { name }),
          ...(description !== undefined && { description })
        }
      })
      return res.status(200).json({
        message: 'Categoria atualizada com sucesso',
        category: updatedCategory
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao atualizar categoria', error })
    }
  }

  // DELETE: Remover uma categoria
  if (req.method === 'DELETE' && categoryId) {
    try {
      await db.category.delete({
        where: { id: String(categoryId) }
      })
      return res.status(200).json({ message: 'Categoria removida com sucesso' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao remover categoria', error })
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
