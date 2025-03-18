/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/menu/index.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import CategoryMenu from "@/components/category-menu"
import Cart from "@/components/Cart"
import TableIndicator from "@/components/table-indicator"
import type { MenuItem, CartItem } from "@/lib/types"
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })
import animationData from "@/animations/logo-animation.json"

export default function BistroMenu() {
  const searchParams = useSearchParams()
  const tableId = searchParams ? searchParams.get("tableId") : null

  const [cartItems, setCartItems] = useState<CartItem []>([])
  const [tableNumber, setTableNumber] = useState<number | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Referência para o componente Lottie
  const lottieRef = useRef<any>(null)

  useEffect(() => {
    if (tableId) {
      setTableNumber(Number(tableId))
    }
  }, [tableId])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/menu/categories')
        if (!response.ok) throw new Error('Falha ao carregar o menu')
        const data = await response.json()
        
        const processedCategories = data.categories.map((category: any) => ({
          ...category,
          items: category.items.map((item: any) => ({
            ...item,
            price: Number(item.price),
          })),
        }))
  
        setCategories(processedCategories)
        setIsLoading(false)
      } catch (err: any) {
        setError(err.message)
        setIsLoading(false)
      }
    }
  
    fetchCategories()
  }, [])
  

  const handleAnimationClick = () => {
    if (lottieRef.current) {
      lottieRef.current.goToAndPlay(0, true)
    }
  }

  const addToCart = (item: MenuItem) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex((cartItem) => cartItem.id === item.id)
      if (itemIndex !== -1) {
        return prevItems.map((cartItem, index) =>
          index === itemIndex ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      }
      return [...prevItems, { ...item, quantity: 1 }]
    })
  }
  
  const removeFromCart = (index: number) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index))
  }
  
  const increaseQuantity = (index: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }
  
  const decreaseQuantity = (index: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    )
  }
  
  const clearCart = () => {
    setCartItems([])
  }
  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }


  if (!tableNumber) {
    return <p className="text-center p-10">Mesa não encontrada.</p>
  }
  if (isLoading) {
    return <p>Carregando...</p>
  }

  if (error) {
    return <p>Erro ao carregar o menu: {error}</p>
  }

  return (
    <div className="min-h-screen bg-[#F6E7D7] text-[#0B0A0B]">
      <header className="bg-[#F6E7D7] text-[#3D2F29] p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <TableIndicator tableNumber={tableNumber} />
          <div onClick={handleAnimationClick} className="cursor-pointer mr-4">
            <Lottie 
              lottieRef={lottieRef}
              animationData={animationData}
              loop={false}
              autoplay={false}
              style={{ width: 65, height: 65 }}
            />
          </div>
          <Button
            variant="outline"
            className="relative bg-[#3D2F29] border-[#3D2F29] hover:bg-[#F6E7D7] hover:text-[#0B0A0B] text-[#FFFCF7]"
            onClick={toggleCart}
          >
            <ShoppingCart className="h-5 w-5 md:mr-2" />
            <span className="hidden md:inline">Ver Pedido</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-[#FFFCF7] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-24">
        <Tabs defaultValue={categories[0]?.id} className="w-full">
          <TabsList className="w-full mb-6 bg-[#F6E7D7] p-1 overflow-x-auto flex flex-nowrap">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex-1 whitespace-nowrap">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <CategoryMenu items={category.items} addToCart={addToCart} />
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Cart
        items={cartItems}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tableNumber={tableNumber}
        clearCart={clearCart}
      />
    </div>
  )
}