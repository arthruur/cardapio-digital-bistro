"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { LayoutDashboard, Utensils, Users, Calendar, BarChart, Settings, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-50 md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "bg-sidebar text-sidebar-foreground w-64 flex-shrink-0 border-r transition-all duration-300 ease-in-out",
          collapsed ? "-translate-x-full" : "translate-x-0",
          "fixed inset-y-0 z-40 md:static md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full bg-[#F6E7D7]/40 border-r-1 border-[#3D2F29]/20">
          <div className="flex items-center h-24 p-8 m-4 mt-4">
            <Image src="bistro-153-logo.svg" alt="Bistro 153 Logo" width={150} height={80}/>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-auto">
            <NavItem href="/admin" icon={LayoutDashboard} active>
              Dashboard
            </NavItem>
            <NavItem href="/admin" icon={Utensils}>
              Tables
            </NavItem>
            <NavItem href="/admin" icon={Calendar}>
              Reservations
            </NavItem>
            <NavItem href="/admin" icon={Users}>
              Staff
            </NavItem>
            <NavItem href="/admin" icon={BarChart}>
              Analytics
            </NavItem>
            <NavItem href="/admin" icon={Settings}>
              Settings
            </NavItem>
          </nav>

          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start hover:bg-[#3D2F29]/90 hover:text-[#F6E7D7]">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

interface NavItemProps {
  href: string
  icon: React.ElementType
  children: React.ReactNode
  active?: boolean
}

function NavItem({ href, icon: Icon, children, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
        active
          ? "bg-[#3D2F29] text-[#F6E7D7]"
          : "text-sidebar-foreground hover:bg-[#3D2F29]/90 hover:text-[#F6E7D7]",
      )}
    >
      <Icon className="h-4 w-4 mr-3" />
      {children}
    </Link>
  )
}

