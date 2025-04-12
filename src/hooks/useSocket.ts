import { useEffect, useState } from "react" 
import { io, Socket } from "socket.io-client"

// Singleton para manter uma única instância do socket
let socketInstance: Socket | null = null;

export function useSocket(path = "/api/socket") {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Se ainda não existir uma instância global
    if (!socketInstance) {
      socketInstance = io({
        path,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnection: true,
        transports: ['websocket'],
        autoConnect: true,
      });
    }
    
    setSocket(socketInstance);

    return () => {
      // Não desconecta ao desmontar o componente individual
      // A conexão será mantida pelo singleton
    };
  }, [path]);

  return socket;
}