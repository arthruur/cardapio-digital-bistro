export type TableStatus = "vacant" | "occupied" | "reserved"
export type OrderStatus = "new" | "preparing" | "ready" | "served"

export interface Order {
  id: number
  items: string[]
  status: OrderStatus
  time: string
  total: number
}

export interface TableData {
  id: number
  name: string
  status: TableStatus
  orders: Order[]
}

