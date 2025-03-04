"use client"

import type React from "react"

import Image from "next/image"

export function DashboardSidebar() {
  return (
    <div className="flex flex-col w-16 h-full bg-[#3D2F29] gap-6 items-center pt-4">
      <Image 
        src="bistro-153-logo-icone.svg" 
        alt="Bistro 153 Logo" 
        width={50} 
        height={50}
        className="mt-1"
      />
    </div>
  )
}