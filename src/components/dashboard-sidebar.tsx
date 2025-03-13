"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { NotebookPen, HandPlatter } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function DashboardSidebar() {
  return (
    <div className="flex flex-col w-16 h-screen bg-[#3D2F29] gap-6 items-center pt-4 fixed left-0 top-0">
      <Image 
        src="/logo-icone.svg" 
        alt="Bistro 153 Logo" 
        width={50} 
        height={50}
        className="mt-1"
      />

      <TooltipProvider>
      <Tooltip>
          <TooltipTrigger asChild>
            <Link 
              href="/admin"
              className="p-2 hover:bg-[#2D221E] rounded-lg transition-colors inline-flex"
            >
              <HandPlatter  className="h-6 w-6 text-[#F6E7D7]" />
            </Link>
            
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-sm">Gerenciar Pedidos</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link 
              href="/admin/menu"
              className="p-2 hover:bg-[#2D221E] rounded-lg transition-colors inline-flex"
            >
              <NotebookPen  className="h-6 w-6 text-[#F6E7D7]" />
            </Link>
            
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-sm">Gerenciar Cardápio</p>
          </TooltipContent>
        </Tooltip>

      </TooltipProvider>
    </div>
  )
}