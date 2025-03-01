"use client"

import type React from "react"
import { useState } from "react"
import Header from "./components/Header"
import Menu from "./components/Menu"
import Cart from "./components/Cart"
import AIAssistant from "./components/AIAssistant"
import type { MenuItem } from "./types/menu"

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<MenuItem[]>([])
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)

  const addToCart = (item: MenuItem) => {
    setCartItems([...cartItems, item])
  }

  const toggleAIAssistant = () => {
    setIsAIAssistantOpen(!isAIAssistantOpen)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header toggleAIAssistant={toggleAIAssistant} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Menu addToCart={addToCart} />
          <Cart items={cartItems} />
        </div>
      </div>
      {isAIAssistantOpen && <AIAssistant onClose={() => setIsAIAssistantOpen(false)} />}
    </div>
  )
}

export default App

