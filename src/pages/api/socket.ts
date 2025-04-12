import { Server } from "socket.io"
import type { NextApiRequest } from "next"
import type { Server as NetServer } from "http"
import type { NextApiResponseServerIO } from "@/lib/socket"
import { Order } from "@/lib/types";

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    console.log("Iniciando servidor Socket.IO...");
    const io = new Server(res.socket.server as NetServer, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
      },
      // Configurações adicionais para melhorar performance
      connectTimeout: 10000,
      pingTimeout: 5000,
      pingInterval: 10000,
      transports: ['websocket', 'polling'],
    });

    // Centralize os handlers de eventos
    io.on("connection", (socket) => {
      console.log("Cliente conectado:", socket.id);
      
      // Use eventos específicos para cada funcionalidade
      socket.on("new_order", handleNewOrder);
      
      // Limpeza ao desconectar
      socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
      });
    });
    
    function handleNewOrder(orderData: Order) {
      console.log("Pedido recebido:", orderData);
      io.emit("new_order", orderData);
    }
    
    res.socket.server.io = io;
  }
  
  res.end();
}