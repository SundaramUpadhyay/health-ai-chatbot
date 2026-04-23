"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, MessageSquare, Map, FileText, Settings, User } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

interface AdminSidebarProps {
  activeView: string
  onViewChange: (view: any) => void
}

const getMenuItems = (t: (key: string) => string) => [
  { id: "dashboard", label: t("dashboard"), icon: BarChart3 },
  { id: "conversations", label: t("conversations"), icon: MessageSquare },
  { id: "map", label: t("outbreakMap"), icon: Map },
  { id: "reports", label: t("reports"), icon: FileText },
  { id: "settings", label: t("settings"), icon: Settings },
  { id: "profile", label: t("profile"), icon: User },
]

export default function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const menuItems = getMenuItems(t)

  return (
    <aside className="w-64 bg-white border-r border-border fixed left-0 top-20 h-screen pt-6">
      <nav className="space-y-2 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}
