"use client"

import type { TableData, OrderStatus } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderDetailsProps {
  table: TableData | null
  onUpdateStatus: (tableId: number, orderId: number, newStatus: OrderStatus) => void
}

export function OrderDetails({ table, onUpdateStatus }: OrderDetailsProps) {
  if (!table) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-muted-foreground">
        <div className="text-center">
          <h3 className="text-lg font-medium">No table selected</h3>
          <p className="mt-1">Select a table to view orders</p>
        </div>
      </div>
    )
  }

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "new":
        return "default"
      case "preparing":
        return "secondary"
      case "ready":
        return "outline"
      case "served":
        return "destructive"
      default:
        return "default"
    }
  }

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case "new":
        return "preparing"
      case "preparing":
        return "ready"
      case "ready":
        return "served"
      case "served":
        return null
      default:
        return null
    }
  }

  const getNextStatusLabel = (currentStatus: OrderStatus): string => {
    switch (currentStatus) {
      case "new":
        return "Start Preparing"
      case "preparing":
        return "Mark Ready"
      case "ready":
        return "Mark Served"
      case "served":
        return "Completed"
      default:
        return ""
    }
  }

  return (
    <div className="flex-1 p-4 overflow-auto bg-[#F6E7D7]/40">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Pedidos da Mesa {table.id}</h2>
        <Badge
          className={cn(
            "capitalize",
            table.status === "vacant" ? "bg-green-500" : table.status === "occupied" ? "bg-red-500" : "bg-blue-500",
          )}
        >
          {table.status}
        </Badge>
      </div>

      {table.orders.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>Sem pedidos para essa mesa.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {table.orders.map((order) => (
            <Card className="bg-[#F6E7D7]/40"key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Pedido {order.id}</CardTitle>
                  <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {order.time}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 mb-4">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Separator className="my-3" />

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                  </div>

                  {getNextStatus(order.status) && (
                    <Button
                      onClick={() => {
                        const nextStatus = getNextStatus(order.status)
                        if (nextStatus) {
                          onUpdateStatus(table.id, order.id, nextStatus)
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

