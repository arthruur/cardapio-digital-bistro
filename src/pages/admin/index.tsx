import { redirect } from "next/navigation"
import Dashboard from "@/components/dashboard"

export default function Home() {
  // In a real app, you would check authentication here
  // If not authenticated, redirect to login
  const isAuthenticated = true

  if (!isAuthenticated) {
    redirect("/login")
  }

  return <Dashboard />
}

