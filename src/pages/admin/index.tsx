"use client"

import Dashboard from "@/components/dashboard"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function AdminPage() {
  return (
    <div className="flex min-h-screen"> {/* Container principal */}
      <DashboardSidebar/>
      <main className="flex-1 ml-16"> {/* Conteúdo principal */}
        <Dashboard />
      </main>
    </div>
  )
}
