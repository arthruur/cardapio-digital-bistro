"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Send } from "lucide-react"
import type { MenuItem } from "@/types/menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import { OrderStatus } from "@/lib/types"
import toast from 'react-hot-toast'

interface CartProps {
  items: MenuItem[]
  removeFromCart: (index: number) => void
  isOpen: boolean
  onClose: () => void
  tableNumber: number
  clearCart: () => void
}

export default function Cart({ items, removeFromCart, isOpen, onClose, tableNumber, clearCart }: CartProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const total = items.reduce((sum, item) => sum + item.price, 0)

  const handleSubmitOrder = async () => {
    if (!tableNumber || !items.length) {
      toast.error("Número da mesa e itens são obrigatórios.", {
        style: { background: "#3D2F29", color: "#F6E7D7" },
      })
      return
    }
  
    // Calcula o total e cria um ID para o pedido (aqui usamos Date.now() como exemplo)
    const orderTotal = items.reduce((acc, item) => acc + item.price, 0)
    const newOrder = {
      id: Date.now(), // ou outra lógica para gerar ID único
      items: items.map(item => item.name), // mapeia para um array de nomes
      status: "novo" as OrderStatus, // seguindo o tipo OrderStatus
      time: new Date().toLocaleTimeString(), // horário atual
      total: orderTotal,
    }
  
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/tables?tableId=${tableNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newOrder }),
      })
  
      console.log('Items', items)
      console.log('Status da resposta:', response.status)
      const data = await response.json()
      console.log('Resposta da API:', data)
  
      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar pedido")
      }
  
      clearCart()
      toast.success(data.message, {
        style: { background: "#3D2F29", color: "#F6E7D7" },
      })
    } catch (error: unknown) {
      console.error("Erro ao enviar pedido:", error instanceof Error ? error.message : String(error))
      toast.error(error instanceof Error ? error.message : String(error), {
        style: { background: "#3D2F29", color: "#F6E7D7" },
      })
    } finally {
      setIsSubmitting(false)
    }
  }
      
  const cartContent = (
    <>
      <div className="flex-1 overflow-auto bg-[#F6E7D7] p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-[#3D2F29]/70 mb-2">Seu pedido está vazio...</p>
            <p className="text-sm text-[#3D2F29]/70">
              Ao adicionar itens ao seu pedido eles aparecerão aqui!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#3D2F29]">
            {items.map((item, index) => (
              <div key={index} className="py-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-[#3D2F29]/70">R${item.price.toFixed(0)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(index)}
                  className="h-8 w-8 text-[#3D2F29]/70 hover:text-[#3D2F29]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#3D2F29] bg-[#F6E7D7] p-4">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Total:</span>
          <span className="font-bold">R${total.toFixed(0)}</span>
        </div>
        <Button
          className="w-full bg-[#3D2F29] text-[#F6E7D7] hover:bg-[#3D2F29]/80"
          disabled={items.length === 0 || isSubmitting}
          onClick={handleSubmitOrder}
        >
          {isSubmitting ? (
            "Enviando..."
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Fazer pedido
            </>
          )}
        </Button>
      </div>
    </>
  )

  return isMobile ? (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col bg-[#F6E7D7] text-[#3D2F29]">
        <SheetHeader>
          <SheetTitle>Seu pedido (Mesa {tableNumber})</SheetTitle>
        </SheetHeader>
        {cartContent}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md flex flex-col h-[80vh] bg-[#F6E7D7] text-[#0B0A0B]">
        <DialogHeader>
          <DialogTitle>Seu pedido (Mesa {tableNumber})</DialogTitle>
        </DialogHeader>
        {cartContent}
      </DialogContent>
    </Dialog>
  )
}
