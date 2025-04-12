import { Server } from "socket.io"
import type { NextApiRequest } from "next"
import type { Server as NetServer } from "http"
import type { NextApiResponseServerIO } from "@/lib/socket"

export default function handler(req: NextApiRequest, res:NextApiResponseServerIO) {
  if(!res.socket.server.io){
    const io = new Server(res.socket.server as NetServer, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
      },
    })
    io.on("connection", (socket) => {
      console.log("Cliente conectado:", socket.id)

      socket.on("new_order", (orderData) => {
        console.log("Pedido recebido:", orderData)
        io.emit("new_order", orderData)
      })
    })
    res.socket.server.io = io
  }
  res.end()
}