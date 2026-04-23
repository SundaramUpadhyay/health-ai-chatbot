"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Phone } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

interface HeroSectionProps {
  onOpenChat: () => void
}

export default function HeroSection({ onOpenChat }: HeroSectionProps) {
  const { language } = useLanguage()

  const t = (key: string) => getTranslation(language, key)

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          {t("aiPoweredHealth")}
          <span className="block text-primary mt-2">{t("twentyFourSeven")}</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
          {t("getInstantAnswers")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onOpenChat}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 h-auto"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            {t("tryChatbot")}
          </Button>
          <Button variant="outline" className="text-lg px-8 py-6 h-auto border-2 bg-transparent">
            <Phone className="w-5 h-5 mr-2" />
            {t("callNow")}
          </Button>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="text-3xl font-bold text-primary mb-2">{t("livesHelpedCount")}</div>
            <p className="text-muted-foreground">{t("livesHelped")}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="text-3xl font-bold text-accent mb-2">{t("languagesSupportedCount")}</div>
            <p className="text-muted-foreground">{t("languagesSupported")}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="text-3xl font-bold text-secondary mb-2">{t("accuracyRateCount")}</div>
            <p className="text-muted-foreground">{t("accuracyRate")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
