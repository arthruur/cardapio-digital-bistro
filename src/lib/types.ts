export type TableStatus = "livre" | "ocupado" | "reservado"
export type OrderStatus = "novo" | "preparando" | "pronto" | "servido"

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

