"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRole?: "admin" | "user"
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    
    if (!storedUser) {
      router.push("/login")
      return
    }

    const user = JSON.parse(storedUser)

    if (allowedRole && user.role !== allowedRole) {
      router.push("/login")
      return
    }

    setIsAuthorized(true)
  }, [router, allowedRole])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Checking authorization...</div>
      </div>
    )
  }

  return <>{children}</>
}
