"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Brain, AlertTriangle, User } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

const stepIcons = [MessageSquare, Brain, AlertTriangle, User]

const stepTitles = [
  "Send a Message",
  "AI Processing",
  "Smart Triage",
  "Get Help",
]

const stepDescriptions = [
  "Ask any health question via WhatsApp, SMS, or web chat",
  "NLU engine detects intent and retrieves accurate answers",
  "Red-flag detection escalates critical cases to health workers",
  "Receive personalized guidance or connect with professionals",
]

export default function HowItWorks() {
  const { language } = useLanguage()

  const t = (key: string) => getTranslation(language, key)

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t("howItWorksTitle")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and reliable health information at your fingertips
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {stepIcons.map((Icon, i) => (
            <div key={i}>
              <Card className="border-border h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">{stepTitles[i]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{stepDescriptions[i]}</p>
                </CardContent>
              </Card>
              {i < stepIcons.length - 1 && (
                <div className="hidden md:flex justify-center mt-6">
                  <div className="text-2xl text-primary/30">→</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
