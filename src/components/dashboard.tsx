/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import { LayoutDashboard, Utensils, Table } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import animationData from "@/animations/logo-animation.json"
import OrdersDashboard from "./ordersDashboard"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

const menuItems = [
  { label: "Cardápio", icon: Utensils, key: "menu" },
  { label: "Pedidos", icon: LayoutDashboard, key: "orders" },
  { label: "Mesas", icon: Table, key: "tables" },
]

export default function AdminDashboard() {
  const [active, setActive] = useState("menu")
  const lottieRef = useRef<any>(null)

  const renderContent = () => {
    switch (active) {
      case "menu":
        return <div>📋 Gerencie o cardápio aqui</div>
      case "orders":
        return <OrdersDashboard />
      case "tables":
        return <div>🪑 Controle as mesas ocupadas</div>
      default:
        return null
    }
  }

  const handleAnimationClick = () => {
    if (lottieRef.current) {
      lottieRef.current.goToAndPlay(0, true)
    }
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-[#F6E7D7] text-[#0B0A0B]">
        {/* Sidebar compacta com logo */}
        <aside className="w-20 bg-[#3D2F29] text-[#FFFCF7] flex flex-col py-6 px-2 items-center gap-6">
          {/* Logo */}
          <div onClick={handleAnimationClick} className="cursor-pointer">
            <Lottie
              lottieRef={lottieRef}
              animationData={animationData}
              loop={false}
              autoplay={false}
              style={{ width: 70, height: 70 }}
            />
          </div>

          {/* Ícones com tooltip */}
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Tooltip key={item.key}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActive(item.key)}
                    className={`p-3 rounded-lg transition-colors ${
                      active === item.key
                        ? "bg-[#F6E7D7] text-[#0B0A0B]"
                        : "hover:bg-[#2c241f]"
                    }`}
                  >
                    <Icon size={22} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>{item.label}</span>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-semibold mb-6 capitalize">
            {menuItems.find((i) => i.key === active)?.label}
          </h1>
          <div className="bg-white rounded-xl shadow p-6">{renderContent()}</div>
        </main>
      </div>
    </TooltipProvider>
  )
}
