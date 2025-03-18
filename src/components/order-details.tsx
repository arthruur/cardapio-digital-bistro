"use client"

import type { TableData, OrderStatus } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface OrderDetailsProps {
  table: TableData | null
  onUpdateStatus: (tableId: number, orderId: number, newStatus: OrderStatus) => void
}

export function OrderDetails({ table, onUpdateStatus }: OrderDetailsProps) {
  if (!table) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-muted-foreground bg-[#F6E7D7]/40">
        <div className="text-center">
          <h3 className="text-lg font-medium">Nenhuma mesa selecionada</h3>
          <p className="mt-1">Selecione uma mesa para ver os pedidos</p>
        </div>
      </div>
    )
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
    if (!table) return; // Se não houver mesa selecionada, não faz nada
  
    try {
      const response = await fetch(`/api/tables?tableId=${table.id}`, {
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
    <div className="flex-1 p-4 overflow-auto bg-[#F6E7D7]/40">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Pedidos da Mesa {table.number}</h2>
        <Badge
          className={cn(
            "capitalize",
            table.status === "AVAILABLE" ? "bg-green-500" : table.status === "OCCUPIED" ? "bg-red-500" : "bg-blue-500",
          )}
        >
          {table.status}
        </Badge>
        <Button onClick={handleClearTable}>Limpar Mesa </Button>
      </div>
      

      {table.orders.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>Sem pedidos para essa mesa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(table.orders || []).filter((order) => order.status !== ("Finalizado" as OrderStatus)).map((order) => (
            <Card className="bg-[#F6E7D7]/40"key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex text-[#3D2F29] justify-center items-center">
                <div className="mr-2 ">Pedido feito às:</div>
                  <Clock className="h-4 w-4 mr-1" />
                  {order.time}
                
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 mb-4">
                  {(order.items || []).map((item, index) => (
                    <li key={index} className="flex font-bold justify-between border-b-1 border-[#3D2F29] mb-6 pb-4">
                    <span>{item}</span>
                      <span className="flex items-center justify-center w-5 h-5 rounded-md bg-[#3D2F29] text-[#F6E7D7] text-xs">1</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-center items-center">

                  {getNextStatus(order.status) && (
                    <Button
                      onClick={() => {
                        const nextStatus = getNextStatus(order.status)
                        if (nextStatus) {
                          onUpdateStatus(table.number, order.id, nextStatus)
                        }
                      }}
                      size="sm"
                    >
                      {getNextStatusLabel(order.status)}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
