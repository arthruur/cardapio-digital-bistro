import { Badge } from "@/components/ui/badge"

interface TableIndicatorProps {
  tableNumber: number
}

export default function TableIndicator({ tableNumber }: TableIndicatorProps) {
  return (
    <Badge variant="outline" className="bg-[#3D2F29] text-[#F6E7D7] text-sm hover:bg-[#3D2F29] border-[#3D2F29]">
      Mesa {tableNumber}
    </Badge>
  )
}

