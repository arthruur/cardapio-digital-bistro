"use client"

import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Dashboard from "@/components/dashboard"

export default function AdminPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return <Dashboard />
}
