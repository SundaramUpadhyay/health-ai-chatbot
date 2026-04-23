"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import DashboardContent from "@/components/admin/dashboard-content"
import ConversationsView from "@/components/admin/conversations-view"
import ReportsView from "@/components/admin/reports-view"
import OutbreakMap from "@/components/admin/outbreak-map"
import SettingsView from "@/components/admin/settings-view"
import ProfileView from "@/components/admin/profile-view"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

type AdminView = "dashboard" | "conversations" | "reports" | "map" | "settings" | "profile"

export default function AdminDashboard() {
  const router = useRouter()
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [activeView, setActiveView] = useState<AdminView>("dashboard")
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if user is authenticated as admin
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const user = JSON.parse(storedUser)
    if (user.role !== "admin") {
      router.push("/login")
      return
    }

    setIsAuthorized(true)
  }, [router])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">{t("checkingAuthorization")}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <AdminHeader activeView={activeView} onViewChange={setActiveView} />
      <div className="flex">
        <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 pt-20 p-6">
          {activeView === "dashboard" && <DashboardContent />}
          {activeView === "conversations" && <ConversationsView />}
          {activeView === "reports" && <ReportsView />}
          {activeView === "map" && <OutbreakMap />}
          {activeView === "settings" && <SettingsView />}
          {activeView === "profile" && <ProfileView />}
        </main>
      </div>
    </div>
  )
}
