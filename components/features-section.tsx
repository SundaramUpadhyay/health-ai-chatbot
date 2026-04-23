"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, MapPin, Clock, Shield, BarChart3, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

const featureIcons = [
  MessageSquare,
  MapPin,
  Clock,
  Shield,
  BarChart3,
  Globe,
]

const featureTitles = [
  "AI Chatbot",
  "Geo-Targeted Alerts",
  "24/7 Availability",
  "Medical Safety",
  "Health Tracking",
  "Multilingual Support",
]

const featureDescriptions = [
  "Instant answers to health questions with instant intent detection and accurate QA retrieval.",
  "Receive outbreak alerts and health warnings specific to your location automatically.",
  "Access health guidance anytime via WhatsApp, SMS, or our web widget.",
  "Red-flag detection with automatic escalation to healthcare professionals when needed.",
  "Track vaccination schedules, health updates, and get personalized reminders.",
  "Available in 15+ languages including Hindi, Bengali, and Telugu with audio options.",
]

export default function FeaturesSection() {
  const { language } = useLanguage()

  const t = (key: string) => getTranslation(language, key)

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for modern health awareness and disease prevention
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureIcons.map((Icon, i) => (
            <Card key={i} className="border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">{featureTitles[i]}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{featureDescriptions[i]}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
