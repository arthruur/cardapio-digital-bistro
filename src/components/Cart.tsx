"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Send, Plus, Minus } from "lucide-react" // Importa ícones de + e -
import type { MenuItem } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import toast from 'react-hot-toast'

// Extendendo o tipo MenuItem para incluir a quantidade
interface CartItem extends MenuItem {
  quantity: number
}

interface CartProps {
  items: CartItem[]
  removeFromCart: (index: number) => void
  increaseQuantity: (index: number) => void
  decreaseQuantity: (index: number) => void
  isOpen: boolean
  onClose: () => void
  tableNumber: number
  clearCart: () => void
}

export default function Cart({
  items,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  isOpen,
  onClose,
  tableNumber,
  clearCart
}: CartProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Calcula o total levando em consideração a quantidade de cada item
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmitOrder = async () => {
    if (!tableNumber || !items.length) {
      toast.error("Número da mesa e itens são obrigatórios.", {
        style: { background: "#3D2F29", color: "#F6E7D7" },
      })
      return
    }
  
    const orderTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    
    // Corrigindo a estrutura do payload para corresponder à API
    const payload = {
      newOrder: {
        items: {
          create: items.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
          }))
        },
        status: "PENDING",
        total: orderTotal
      }
    }
      
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/tables?tableId=${tableNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao atualizar pedido")
      }
  
      const data = await response.json()
      console.log('Resposta da API:', data)
  
      clearCart()
      toast.success("Pedido enviado com sucesso!", {
        style: { background: "#3D2F29", color: "#F6E7D7" },
      })
      onClose() // Fechar o carrinho após sucesso
    } catch (error: unknown) {
      console.error("Erro ao enviar pedido:", error)
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar pedido",
        {
          style: { background: "#3D2F29", color: "#F6E7D7" },
        }
      )
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
                  <p className="text-sm text-[#3D2F29]/70">
                    ({item.quantity}x R${item.price.toFixed(0)})
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => decreaseQuantity(index)}
                    disabled={item.quantity <= 1}
                    title="Diminuir quantidade"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => increaseQuantity(index)}
                    title="Aumentar quantidade"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(index)}
                    title="Remover item"
                    className="text-[#3D2F29]/70 hover:text-[#3D2F29]"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
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
