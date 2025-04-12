import { useEffect, useRef } from "react" 
import { io, Socket } from "socket.io-client"

export function useSocket(path = "/api/socket") {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io({path,

      })
      socketRef.current = socket
    }

    return () => {
      if(socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [path])

  return socketRef.current
}