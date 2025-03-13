"use client"

import { useState } from 'react'
import { useSSE } from '@/hooks/use-sse'
import { TableData } from '@/lib/types'
import { OrderStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { TableOrders } from "@/components/table-orders"
import { OrderDetails } from "@/components/order-details"
import toast from "react-hot-toast"
import { io, Socket } from "socket.io-client"
import { useSocket } from "@/hooks/use-socket"

export function Dashboard() {
  const { data: tables, error } = useSSE()
  const [loading, setLoading] = useState(false)
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null)
  const socket = useSocket()

  const handleStatusChange = async (tableId: string, orderId: string, newStatus: OrderStatus) => {
    try {
      setLoading(true)
      await db.table.update({
        where: { number: Number(tableId) },
        data: {
          orders: {
            update: {
              where: { id: orderId },
              data: { status: newStatus }
            }
          }
        }
      })
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return <div>Erro ao carregar dados: {error.message}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {tables.map((table) => (
        <div key={table.number} className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-2">Mesa {table.number}</h2>
          <div className="space-y-2">
            {table.orders.map((order) => (
              <div key={order.id} className="border p-2 rounded">
                <p>Pedido #{order.id}</p>
                <p>Status: {order.status}</p>
                <p>Total: R$ {order.total.toString()}</p>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(table.number.toString(), order.id, e.target.value as OrderStatus)}
                  disabled={loading}
                  className="mt-2 p-1 border rounded"
                >
                  <option value="PENDING">Pendente</option>
                  <option value="PREPARING">Preparando</option>
                  <option value="READY">Pronto</option>
                  <option value="DELIVERED">Entregue</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}