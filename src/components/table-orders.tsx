"use client"
import { useState } from "react"
import type { TableData } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TableOrdersProps {
  tables: TableData[]
  selectedTableId: number | undefined
  onSelectTable: (table: TableData) => void
}

export function TableOrders({ tables, selectedTableId, onSelectTable }: TableOrdersProps) {
  const [sortOption, setSortOption] = useState<"number" | "orders" | "status">("number")

  const statusTranslations: { [key: string]: string } = {
    "AVAILABLE": "Disponível",
    "OCCUPIED": "Ocupada",
    "RESERVED": "Reservada",
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500"
      case "OCCUPIED":
        return "bg-red-500"
      case "RESERVED":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  // Função de ordenação
  const sortedTables = [...tables].sort((a, b) => {
    switch (sortOption) {
      case "number":
        return a.number - b.number // Ordena pela numeração da mesa
      case "orders":
        const latestOrderA = a.orders.length > 0 ? new Date(a.orders[0].createdAt).getTime() : 0
        const latestOrderB = b.orders.length > 0 ? new Date(b.orders[0].createdAt).getTime() : 0
        return latestOrderB - latestOrderA // Ordena pela data do pedido mais recente
      case "status":
        const statusOrder: { [key: string]: number } = {
          "OCCUPIED": 1,
          "RESERVED": 2,
          "AVAILABLE": 3,
        }
        return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0) // Ordena pelo status (Ocupada > Reservada > Disponível)
      default:
        return 0
    }
  })

  return (
    <div className="w-full md:w-1/2 lg:w-2/5 p-4 overflow-auto border-r bg-[#F6E7D7]/40">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#3D2F29]">Mesas</h2>
        <Badge variant="outline" className="px-2 py-1 text-[#3D2F29] border-[#3D2F29]">
          {tables.filter((t) => t.status === "OCCUPIED").length} / {tables.length} Ocupadas
        </Badge>
      </div>

      {/* Dropdown estilizado para selecionar a ordenação */}
      <div className="mb-4">
        <Select value={sortOption} onValueChange={(value) => setSortOption(value as "number" | "orders" | "status")}>
          <SelectTrigger className="w-full md:w-48 bg-[#F6E7D7]/50 border-[#3D2F29]/20 text-[#3D2F29] focus:ring-[#3D2F29]/30">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent className="bg-[#F6E7D7] text-[#3D2F29]">
        <SelectItem 
          value="number" 
          className="hover:bg-[#3D2F29]/10 focus:bg-[#3D2F29]/10 focus:text-[#3D2F29]"
        >
          Numeração
        </SelectItem>
        <SelectItem 
          value="orders" 
          className="hover:bg-[#3D2F29]/10 focus:bg-[#3D2F29]/10 focus:text-[#3D2F29]"
        >
          Pedidos mais recentes
        </SelectItem>
        <SelectItem 
          value="status" 
          className="hover:bg-[#3D2F29]/10 focus:bg-[#3D2F29]/10 focus:text-[#3D2F29]"
        >
          Status
        </SelectItem>
      </SelectContent>

        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedTables.map((table) => {
          return (
            <Card
              key={table.number}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md bg-[#F6E7D7]/30",
                selectedTableId === table.number ? "ring-2 ring-[#3D2F29]" : "",
              )}
              onClick={() => onSelectTable(table)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col justify-between items-center mb-2">
                  <h3 className="font-medium">Mesa {table.number}</h3>
                  <div className="flex items-center">
                    <div className={cn("w-2 h-2 rounded-full mr-2", getStatusColor(table.status))}></div>
                    <span className="text-xs capitalize">{statusTranslations[table.status] || table.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}