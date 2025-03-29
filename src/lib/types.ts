import { OrderStatus } from '@prisma/client'

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED"
export interface Order {
  id: number
  items: string[]
  status: OrderStatus
  time: string
  total: number
  notes: string
  createdAt: Date;

}

export type TableData = {
  id: string
  tableNumber: number
  orderNumber: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  orders: Order[]
}

export interface MenuItem {
  id: string
  name: string
  description: string
  imageUrl?: string
  price: number
  isAvailable: boolean
  category: string
  image?: string
}

export interface CartItem extends MenuItem {
  quantity: number
}

export type OrderItem = {
  id: string
  name: string
  quantity: number
  price: number
  notes?: string | null
}