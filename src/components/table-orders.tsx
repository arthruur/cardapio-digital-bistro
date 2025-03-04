"use client"

import type { TableData } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TableOrdersProps {
  tables: TableData[]
  selectedTableId: number | undefined
  onSelectTable: (table: TableData) => void
}


export function TableOrders({ tables, selectedTableId, onSelectTable }: TableOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "livre":
        return "bg-green-500"
      case "ocupado":
        return "bg-red-500"
      case "reservado":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }
  


  return (
    <div className="w-full md:w-1/2 lg:w-2/5 p-4 overflow-auto border-r bg-[#F6E7D7]/40">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#3D2F29]">Mesas</h2>
        <Badge variant="outline" className="px-2 py-1 text-[#3D2F29] border-[#3D2F29]">
          {tables.filter((t) => t.status === "ocupado").length} / {tables.length} Ocupadas
        </Badge>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tables.map((table) => {
          return (
            <Card
              key={table.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md bg-[#F6E7D7]/30",
                selectedTableId === table.id ? "ring-2 ring-[#3D2F29]" : "",
              )}
              onClick={() => onSelectTable(table)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col justify-between items-center mb-2">
                  <h3 className="font-medium">Mesa {table.id}</h3>
                  <div className="flex items-center">
                    <div className={cn("w-2 h-2 rounded-full mr-2", getStatusColor(table.status))}></div>
                    <span className="text-xs capitalize">{table.status}</span>
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

