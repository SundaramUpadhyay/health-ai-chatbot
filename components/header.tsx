"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"
import LanguageSelector from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { language } = useLanguage()

  const t = (key: string) => getTranslation(language, key)

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">♥</div>
          <span className="font-bold text-lg text-primary">HealthAI</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-foreground hover:text-primary transition">
            {t("features")}
          </Link>
          <Link href="#how-it-works" className="text-foreground hover:text-primary transition">
            {t("howItWorks")}
          </Link>
          <Link href="#about" className="text-foreground hover:text-primary transition">
            {t("about")}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <ThemeToggle />
          <Link href="/login">
            <Button variant="outline" className="hidden sm:inline-flex bg-transparent">
              {t("login")}
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {t("signUp")}
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
