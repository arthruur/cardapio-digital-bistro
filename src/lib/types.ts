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