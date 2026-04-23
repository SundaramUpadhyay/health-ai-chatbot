"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import HowItWorks from "@/components/how-it-works"
import Footer from "@/components/footer"
import ChatWidget from "@/components/chat-widget"

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection onOpenChat={() => setChatOpen(true)} />
      <FeaturesSection />
      <HowItWorks />
      <Footer />
      {chatOpen && <ChatWidget onClose={() => setChatOpen(false)} />}
    </main>
  )
}
