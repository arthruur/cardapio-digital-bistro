"use client"

import { TableData } from '../lib/types'
import { OrderStatus } from '@prisma/client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface OrderDetailsProps {
  order: TableData | undefined
  onClose: () => void
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>
}

export function OrderDetails({ order, onClose, onUpdateStatus }: OrderDetailsProps) {
  if (!order) {
    return null
  }

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case "PENDING":
        return "PREPARING"
      case "PREPARING":
        return "READY"
      case "READY":
        return "DELIVERED"
      case "DELIVERED":
        return null
      default:
        return null
    }
  }

  const getNextStatusLabel = (currentStatus: OrderStatus): string => {
    switch (currentStatus) {
      case "PENDING":
        return "Começar a preparar"
      case "PREPARING":
        return "Marcar como pronto"
      case "READY":
        return "Marcar como servido"
      case "DELIVERED":
        return "Finalizado"
      default:
        return ""
    }
  }

  const handleClearTable = async () => {
    if (!order) return; // Se não houver mesa selecionada, não faz nada
  
    try {
      const response = await fetch(`/api/tables?tableId=${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        toast.error("Erro ao limpar a mesa", {
          style: { background: "#3D2F29", color: "#F6E7D7" },
        });
        throw new Error("Erro ao limpar a mesa");
        
      }
  
      const data = await response.json();
      toast.success(data.message, {
        style: { background: "#3D2F29", color: "#F6E7D7" },
      })

      console.log(data.message); // Exibe a mensagem de sucesso no console
    } catch (error) {
      console.error("Erro ao limpar a mesa:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Detalhes do Pedido</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Mesa</h3>
          <p className="mt-1 text-sm text-gray-900">{order.tableNumber}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Número do Pedido</h3>
          <p className="mt-1 text-sm text-gray-900">{order.orderNumber}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Status</h3>
          <select
            value={order.status}
            onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="PENDING">Pendente</option>
            <option value="PREPARING">Preparando</option>
            <option value="READY">Pronto</option>
            <option value="DELIVERED">Entregue</option>
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Itens</h3>
          <div className="mt-2 space-y-2">
            {order.orders.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                  {item.notes && (
                    <p className="text-sm text-gray-500">Observações: {item.notes}</p>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-900">Total</p>
            <p className="text-lg font-bold text-gray-900">
              R$ {order.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

