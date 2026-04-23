"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, Settings, User } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import LanguageSelector from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

interface AdminHeaderProps {
  activeView: string
  onViewChange: (view: any) => void
}

export default function AdminHeader({ activeView, onViewChange }: AdminHeaderProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">♥</div>
          <span className="font-bold text-lg text-primary">{t("healthaiAdmin")}</span>
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <ThemeToggle />
          <Button 
            variant={activeView === "settings" ? "default" : "ghost"} 
            size="sm"
            onClick={() => onViewChange("settings")}
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button 
            variant={activeView === "profile" ? "default" : "ghost"} 
            size="sm"
            onClick={() => onViewChange("profile")}
          >
            <User className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            {t("logout")}
          </Button>
        </div>
      </div>
    </header>
  )
}
