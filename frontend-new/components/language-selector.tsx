"use client"

import { useLanguage } from "@/contexts/language-context"

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "te", label: "Telugu" },
  { code: "ta", label: "Tamil" },
  { code: "mr", label: "Marathi" },
]

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <select
      aria-label="Select language"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
    >
      {languages.map((item) => (
        <option key={item.code} value={item.code}>
          {item.label}
        </option>
      ))}
    </select>
  )
}
