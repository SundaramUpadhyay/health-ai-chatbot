"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AiChat } from "@/components/ai-chat"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is authenticated
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(storedUser)
    if (userData.role !== "user") {
      router.push("/login")
      return
    }

    setUser(userData)
  }, [router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Full page chat with back button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="bg-white/90 backdrop-blur-sm shadow-md"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      <div className="h-screen">
        <AiChat />
      </div>
    </div>
  )
}
