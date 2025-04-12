import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import type { Order } from "@/lib/types"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const socket = io({ path: "/api/socket" })

    socket.on("new_order", (order) => {
      setOrders((prev) => [order, ...prev])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div>
      <h1>Pedidos</h1>
      {orders.map((p, i) => (
        <div key={i} className="p-2 border mb-2">
          <strong>Mesa: {p.table}</strong>
          <pre>{JSON.stringify(p.items, null, 2)}</pre>
        </div>
      ))}
    </div>
  )
  
}
