"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import CategoryMenu from "@/components/category-menu"
import Cart from "@/components/Cart"
import TableIndicator from "@/components/table-indicator"
import type { MenuItem } from "@/types/menu"
import Image from "next/image"
import Logo from "../components/assets/bistro-153-logo.svg"

export default function BistroMenu() {
  const [cartItems, setCartItems] = useState<MenuItem[]>([])
  const [tableNumber] = useState(12)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = (item: MenuItem) => {
    setCartItems([...cartItems, item])
  }

  const removeFromCart = (index: number) => {
    const newCartItems = [...cartItems]
    newCartItems.splice(index, 1)
    setCartItems(newCartItems)
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const categories = [
    { id: "starters", name: "Starters" },
    { id: "mains", name: "Main Courses" },
    { id: "desserts", name: "Desserts" },
    { id: "drinks", name: "Drinks" },
  ]

  return (
    <div className="min-h-screen bg-[#FFFCF7] text-[#0B0A0B]">
      <header className="bg-[#F6E7D7] text-[#3D2F29] p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
          <TableIndicator tableNumber={tableNumber} />
          </div>
          <Image src={Logo} alt="Bistro 153 Logo" width={150} />

          <Button
            variant="outline"
            className="relative bg-[#3D2F29] border-[#3D2F29] hover:bg-[#F6E7D7] hover:text-[#0B0A0B] text-[#FFFCF7]"
            onClick={toggleCart}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span>View Order</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-[#FFFCF7] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-24">
        <Tabs defaultValue="starters" className="w-full">
          <TabsList className="w-full mb-6 bg-[#FFFCF7] p-1 overflow-x-auto flex flex-nowrap">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex-1 whitespace-nowrap">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <CategoryMenu category={category.id} addToCart={addToCart} />
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Cart
        items={cartItems}
        removeFromCart={removeFromCart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tableNumber={tableNumber}
      />
    </div>
  )
}

