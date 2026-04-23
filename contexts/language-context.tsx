"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface LanguageContextType {
  language: string
  setLanguage: (language: string) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_STORAGE_KEY = "app-language"

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState("en")

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (savedLanguage) {
      setLanguageState(savedLanguage)
      document.documentElement.lang = savedLanguage
    }
  }, [])

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage)
    document.documentElement.lang = newLanguage
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
