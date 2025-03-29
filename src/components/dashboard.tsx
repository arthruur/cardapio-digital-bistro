"use client"

import { useEffect, useState } from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import { OrderDetails } from "./order-details"
import { useSSE } from "../hooks/use-sse"
import { toast } from "react-hot-toast"
import { OrderStatus } from "@prisma/client"

export function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const { data, error, isConnected } = useSSE()

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status do pedido')
      }

      toast.success('Status atualizado com sucesso!')
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      toast.error('Erro ao atualizar status do pedido')
    }
  }

  if (!mounted) {
    return null
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Erro ao carregar dados</h2>
          <p className="mt-2 text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
          </div>
          {selectedOrder && (
            <div className="w-96 border-l border-gray-200 p-6">
              <OrderDetails
                order={data.find((order) => order.id === selectedOrder)}
                onClose={() => setSelectedOrder(null)}
                onUpdateStatus={updateOrderStatus}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}