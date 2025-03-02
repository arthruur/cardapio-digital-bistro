// src/pages/api/orders/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// Define a interface para os itens do pedido
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

// Define a interface para o pedido
interface Order {
  _id?: ObjectId; // Propriedade opcional, que será preenchida após a inserção
  tableId: number;
  items: OrderItem[];
  status: string;
  createdAt: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extrai o tableId da query string
  const { tableId } = req.query

  if (!tableId) {
    return res.status(400).json({ message: 'O parâmetro tableId é obrigatório na query.' })
  }

  // Converte tableId para número
  const parsedTableId = parseInt(tableId as string, 10)
  if (isNaN(parsedTableId)) {
    return res.status(400).json({ message: 'O parâmetro tableId deve ser um número válido.' })
  }

  if (req.method === 'GET') {
    try {
      const client = await connectToDatabase()
      const db = client.db(process.env.MONGODB_DB || 'Pedidos')

      // Busca os pedidos referentes ao tableId fornecido
      const orders = await db.collection<Order>('orders').find({ tableId: parsedTableId }).toArray()

      // Converte o _id para string, se necessário para o cliente
      const ordersWithIdAsString = orders.map(order => ({
        ...order,
        _id: order._id?.toString(),
      }))

      res.status(200).json({ orders: ordersWithIdAsString })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Erro ao buscar os pedidos', error })
    }
  } else if (req.method === 'POST') {
    const { items } = req.body

    // Validação básica dos dados
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Dados inválidos. Certifique-se de enviar "items".' })
    }

    try {
      const client = await connectToDatabase()
      const db = client.db(process.env.MONGODB_DB || 'Pedidos')

      const newOrder: Order = {
        tableId: parsedTableId,
        items,
        status: 'novo', // status inicial
        createdAt: new Date().toISOString(),
      }

      const result = await db.collection<Order>('orders').insertOne(newOrder)
      newOrder._id = result.insertedId

      // Converte o _id para string antes de enviar a resposta, se desejado
      return res.status(201).json({ 
        message: 'Pedido criado com sucesso!', 
        order: { ...newOrder, _id: newOrder._id.toString() }
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao criar o pedido', error })
    }
  } else {
    res.status(405).json({ message: 'Método não permitido.' })
  }
}
