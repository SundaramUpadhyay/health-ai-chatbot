"use client"

import { useEffect } from "react"

const LANGUAGE_STORAGE_KEY = "app-language"

export default function LanguageSync() {
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (savedLanguage) {
      document.documentElement.lang = savedLanguage
    }
  }, [])

  return null
}
