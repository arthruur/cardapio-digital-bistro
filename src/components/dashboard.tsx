"use client"

import { useEffect, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TableOrders } from "@/components/table-orders"
import { OrderDetails } from "@/components/order-details"
import type { TableData, OrderStatus } from "@/lib/types"
import toast from "react-hot-toast"

export default function Dashboard() {
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null)
  const [tables, setTables] = useState<TableData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTables = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/tables", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao buscar as mesas")
      }

      const data = await response.json()
      console.log("Dados da API:", data)
      setTables(data.tables || [])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro desconhecido")
      setTables([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  const updateOrderStatus = (tableId: number, orderId: number, newStatus: OrderStatus) => {
    setTables((prevTables) =>
      prevTables.map((table) => {
        if (table.number === tableId) {
          return {
            ...table,
            orders: table.orders.map((order) => {
              if (order.id === orderId) {
                return { ...order, status: newStatus }
              }
              return order
            }),
          }
        }
        return table
      })
    )

    if (selectedTable?.number === tableId) {
      setSelectedTable((prevTable) => {
        if (!prevTable) return null
        return {
          ...prevTable,
          orders: prevTable.orders.map((order) => {
            if (order.id === orderId) {
              return { ...order, status: newStatus }
            }
            return order
          }),
        }
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F6E7D7]/10">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p>Carregando mesas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F6E7D7]/10">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex flex-1 overflow-hidden">
          <TableOrders
            tables={tables}
            selectedTableId={selectedTable?.number}
            onSelectTable={(table) => setSelectedTable(table)}
          />
          <OrderDetails table={selectedTable} onUpdateStatus={updateOrderStatus} />
        </main>
      </div>
    </div>
  )
}