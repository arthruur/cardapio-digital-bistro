import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { menuItemId } = req.query

  // GET: Buscar todos os itens ou um item específico
  if (req.method === 'GET') {
    try {
      if (menuItemId) {
        const menuItem = await db.menuItem.findUnique({
          where: { id: String(menuItemId) },
          include: { category: true }
        })

        if (!menuItem) {
          return res.status(404).json({ message: 'Item não encontrado' })
        }

        return res.status(200).json({ menuItem })
      }

      const menuItems = await db.menuItem.findMany({
        include: { category: true }
      })

      return res.status(200).json({ menuItems })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao buscar itens de menu', error })
    }
  }

  // POST: Criar um novo item de menu
  if (req.method === 'POST') {
    const { name, description, price, imageUrl, isAvailable, categoryId } = req.body

    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: 'Nome, preço e categoria são obrigatórios' })
    }

    try {
      const newMenuItem = await db.menuItem.create({
        data: {
          name,
          description,
          price,
          imageUrl,
          isAvailable: isAvailable ?? true,
          categoryId
        },
        include: { category: true }
      })

      return res.status(201).json({
        message: 'Item do menu criado com sucesso',
        menuItem: newMenuItem
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao criar item do menu', error })
    }
  }

  // PATCH: Atualizar um item de menu existente
  if (req.method === 'PATCH' && menuItemId) {
    const { name, description, price, imageUrl, isAvailable, categoryId } = req.body

    try {
      const updatedMenuItem = await db.menuItem.update({
        where: { id: String(menuItemId) },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(price && { price }),
          ...(imageUrl && { imageUrl }),
          ...(isAvailable !== undefined && { isAvailable }),
          ...(categoryId && { categoryId })
        },
        include: { category: true }
      })

      return res.status(200).json({
        message: 'Item do menu atualizado com sucesso',
        menuItem: updatedMenuItem
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao atualizar item do menu', error })
    }
  }

  // DELETE: Remover um item de menu
  if (req.method === 'DELETE' && menuItemId) {
    try {
      await db.menuItem.delete({
        where: { id: String(menuItemId) }
      })
      return res.status(200).json({ message: 'Item do menu removido com sucesso' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao remover item do menu', error })
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
