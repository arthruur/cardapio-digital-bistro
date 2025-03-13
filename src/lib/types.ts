/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiResponse } from 'next'
import { Server as NetServer } from 'http'
import { Server as ServerIO } from 'socket.io'
import { OrderStatus } from '@prisma/client'

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED"
export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED"
export interface Order {
  id: number
  items: string[]
  status: OrderStatus
  time: string
  total: number
  createdAt: Date;

}

export interface TableData {
  id: string
  number: number
  status: TableStatus
  orders: Order[]
}

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  category: {
    id: string;
    name: string;
  };
};


export interface CartItem extends MenuItem {
  quantity: number
}

export type MenuItemFormData = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isAvailable: boolean;
  categoryId: string;
};


// Tipos para Socket.IO (simplificados)
export interface ServerToClientEvents {
  tableUpdated: (data: any) => void
  error: (data: { message: string }) => void
}

export interface ClientToServerEvents {
  updateOrderStatus: (data: {
    tableId: string
    orderId: string
    newStatus: OrderStatus
  }) => void
}

// Usando 'any' para as partes problemáticas
export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

declare global {
  var io: ServerIO | undefined
}
