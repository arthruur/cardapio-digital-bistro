// lib/orders.ts
import { v4 as uuidv4 } from 'uuid'

export interface Order {
  id: string
  tableId: number
  items: Array<{ name: string; quantity: number; price: number }>
  status: string
  createdAt: string
}

// Armazenamento em memória (apenas para desenvolvimento)
export const orders: Order[] = []

// Função auxiliar para criar um novo pedido
export const createOrder = (tableId: number, items: Array<{ name: string; quantity: number; price: number }>) => {
  const newOrder: Order = {
    id: uuidv4(),
    tableId,
    items,
    status: 'novo', // status inicial
    createdAt: new Date().toISOString(),
  }
  orders.push(newOrder)
  return newOrder
}