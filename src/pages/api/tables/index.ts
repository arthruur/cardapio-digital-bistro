// src/pages/api/tables/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/mongodb'

// Interface para um pedido associado a uma mesa
interface TableOrder {
  id: number
  items: string[]
  status: string
  time: string
  total: number
}

// Interface para a mesa
interface Table {
  id: number 
  status: "livre" | "ocupado" | "reservado"
  orders: TableOrder[]
  createdAt: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  // Tratamento para requisições OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const { tableId } = req.query // Pega o tableId dos query 
  
  

// Método GET: Retorna todas as mesas ou uma mesa específica
if (req.method === 'GET') {
  const { tableId } = req.query;

  try {
    const client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DB || 'Pedidos');

    let tables;
    
    if (tableId) {
      // Se tableId for fornecido, busca uma mesa específica
      tables = await db.collection<Table>('tables').find({ id: Number(tableId) }).toArray();
    } else {
      // Caso contrário, retorna todas as mesas
      tables = await db.collection<Table>('tables').find({}).toArray();
    }

    // Converte o _id para string para envio ao cliente
    const tablesWithIdAsString = tables.map((table) => ({
      ...table,
      _id: table._id?.toString(),
    }));

    return res.status(200).json({ tables: tablesWithIdAsString });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar mesas', error });
  }
}

  // Método POST: Cria uma nova mesa
  if (req.method === 'POST') {
    const { id, status } = req.body

    // Validação básica dos dados
    if (!id || !status) {
      return res
        .status(400)
        .json({ message: 'Dados inválidos. Certifique-se de enviar "id" e "status".' })
    }

    try {
      const client = await connectToDatabase()
      const db = client.db(process.env.MONGODB_DB || 'Pedidos')

      const newTable: Table = {
        id,
        status, // Espera valores: "livre", "ocupado" ou "reservado"
        orders: [],
        createdAt: new Date().toISOString(),
      }

      await db.collection<Table>('tables').insertOne(newTable)

      return res.status(201).json({ 
        message: 'Mesa criada com sucesso!',
        table: { ...newTable }
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao criar mesa', error })
    }
  }

 // Método PATCH: Adiciona ou modifica pedidos de uma mesa específica
if (req.method === 'PATCH') {
  const { newOrder } = req.body
  const tableId = req.query.tableId

  // Validação básica
  if (!tableId || !newOrder) {
    return res.status(400).json({ message: 'tableId e newOrder são obrigatórios' })
  }

  try {
    const client = await connectToDatabase()
    const db = client.db(process.env.MONGODB_DB || 'Pedidos')

    // Converte tableId para number e busca a mesa
    console.log("tableId é:", tableId)
    const table = await db.collection('tables').findOne({ id: Number(tableId) })
    console.log("table encontrada foi:", table)
    if (!table) {
      return res.status(404).json({ message: 'Mesa não encontrada' })
    }

    // Adiciona o novo pedido ao array de pedidos
    const updatedOrders = [...table.orders, newOrder]

    // Atualiza a mesa no banco de dados
    await db.collection<Table>('tables').updateOne(
      { id: Number(tableId) },
      { $set: { orders: updatedOrders, status: "ocupado" } }
    )

    return res.status(200).json({ 
      message: 'Pedido enviado com sucesso!', 
      table: { ...table, orders: updatedOrders } 
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao adicionar pedido', error })
  }
}


  // Método PUT: Finaliza uma mesa – limpa os pedidos e marca a mesa como "livre"
  if (req.method === 'PUT') {
    if (!tableId) {
      return res.status(400).json({ message: 'O parâmetro tableId é obrigatório.' })
    }

    try {
      const client = await connectToDatabase()
      const db = client.db(process.env.MONGODB_DB || 'Pedidos')

      // Verifica se a mesa existe
      const table = await db.collection<Table>('tables').findOne({ id: Number(tableId) })
      if (!table) {
        return res.status(404).json({ message: 'Mesa não encontrada.' })
      }

      // Atualiza a mesa: limpa os pedidos e define o status como "livre"
      await db.collection<Table>('tables').updateOne(
        { id: Number(tableId) },
        { $set: { orders: [], status: 'livre' } }
      )

      return res.status(200).json({ message: `Mesa ${tableId} finalizada e limpa com sucesso!` })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao finalizar a mesa', error })
    }
  }

  // Se o método não for GET, POST, PATCH ou PUT, retorna erro 405
  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'PUT'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}