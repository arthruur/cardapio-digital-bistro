"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TableOrders } from "@/components/table-orders"
import { OrderDetails } from "@/components/order-details"
import type { TableData, OrderStatus } from "@/lib/types"

export default function Dashboard() {
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null)

  // In a real app, this would come from an API or database
  const [tables, setTables] = useState<TableData[]>([
    {
      id: 1,
      name: "Mesa 1",
      status: "occupied",
      orders: [
        {
          id: 101,
          items: ["Margherita Pizza", "Caesar Salad", "Coke"],
          status: "preparing",
          time: "12:30 PM",
          total: 32.5,
        },
        { id: 102, items: ["Garlic Bread", "Sparkling Water"], status: "served", time: "12:35 PM", total: 8.75 },
      ],
    },
    {
      id: 2,
      name: "Mesa 2",
      status: "occupied",
      orders: [
        {
          id: 201,
          items: ["Pasta Carbonara", "Tiramisu", "White Wine"],
          status: "ready",
          time: "12:40 PM",
          total: 42.0,
        },
      ],
    },
    {
      id: 3,
      name: "Mesa 3",
      status: "vacant",
      orders: [],
    },
    {
      id: 4,
      name: "Mesa 4",
      status: "occupied",
      orders: [
        {
          id: 401,
          items: ["Steak", "Mashed Potatoes", "Red Wine"],
          status: "preparing",
          time: "12:45 PM",
          total: 58.5,
        },
        { id: 402, items: ["Cheesecake", "Coffee"], status: "new", time: "1:00 PM", total: 12.25 },
      ],
    },
    {
      id: 5,
      name: "Mesa 5",
      status: "reserved",
      orders: [],
    },
    {
      id: 6,
      name: "Mesa 6",
      status: "occupied",
      orders: [{ id: 601, items: ["Burger", "Fries", "Beer"], status: "served", time: "12:50 PM", total: 24.75 }],
    },
    {
      id: 7,
      name: "Mesa 7",
      status: "vacant",
      orders: [],
    },
    {
      id: 8,
      name: "Mesa 8",
      status: "occupied",
      orders: [{ id: 801, items: ["Sushi Platter", "Sake"], status: "preparing", time: "1:05 PM", total: 48.0 }],
    },
  ])

  const updateOrderStatus = (tableId: number, orderId: number, newStatus: OrderStatus) => {
    setTables((prevTables) =>
      prevTables.map((table) => {
        if (table.id === tableId) {
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
      }),
    )

    // If we're updating the currently selected table, update that too
    if (selectedTable?.id === tableId) {
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

  return (
    <div className="flex h-screen bg-[#F6E7D7]/10">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex flex-1 overflow-hidden">
          <TableOrders
            tables={tables}
            selectedTableId={selectedTable?.id}
            onSelectTable={(table) => setSelectedTable(table)}
          />
          <OrderDetails table={selectedTable} onUpdateStatus={updateOrderStatus} />
        </main>
      </div>
    </div>
  )
}

