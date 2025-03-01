"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Send } from "lucide-react"
import type { MenuItem } from "@/types/menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CartProps {
  items: MenuItem[]
  removeFromCart: (index: number) => void
  isOpen: boolean
  onClose: () => void
  tableNumber: number
}

export default function Cart({ items, removeFromCart, isOpen, onClose, tableNumber }: CartProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const total = items.reduce((sum, item) => sum + item.price, 0)

  const handleSubmitOrder = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
      // You would typically send the order to your backend here
      alert("Order submitted successfully!")
    }, 1500)
  }

  const cartContent = (
    <>
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-[#0B0A0B]/70 mb-2">Your order is empty</p>
            <p className="text-sm text-[#0B0A0B]/70">Add some delicious items from our menu!</p>
          </div>
        ) : (
          <div className="divide-y divide-[#FFDE68]">
            {items.map((item, index) => (
              <div key={index} className="py-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-[#0B0A0B]/70">${item.price.toFixed(2)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(index)}
                  className="h-8 w-8 text-[#0B0A0B]/70 hover:text-[#0B0A0B]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#FFDE68] pt-4">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Total</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>
        <Button
          className="w-full bg-[#FFDE68] text-[#0B0A0B] hover:bg-[#FFDE68]/80"
          disabled={items.length === 0 || isSubmitting}
          onClick={handleSubmitOrder}
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Send Order to Kitchen
            </>
          )}
        </Button>
      </div>
    </>
  )

  return isMobile ? (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col bg-[#FFFCF7] text-[#0B0A0B]">
        <SheetHeader>
          <SheetTitle>Your Order (Table {tableNumber})</SheetTitle>
        </SheetHeader>
        {cartContent}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md flex flex-col h-[80vh] bg-[#FFFCF7] text-[#0B0A0B]">
        <DialogHeader>
          <DialogTitle>Your Order (Table {tableNumber})</DialogTitle>
        </DialogHeader>
        {cartContent}
      </DialogContent>
    </Dialog>
  )
}

