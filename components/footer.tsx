"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

export default function Footer() {
  const { language } = useLanguage()

  const t = (key: string) => getTranslation(language, key)

  return (
    <footer className="bg-foreground text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">♥</div>
              <span className="font-bold text-lg">HealthAI</span>
            </div>
            <p className="text-white/70 text-sm">
              Empowering communities with accessible health information and AI-driven support.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="#" className="hover:text-white transition">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  {t("features")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +1-800-HEALTH-1
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@healthai.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                India, USA, Europe
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-primary transition">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/70">
          <p>© 2025 HealthAI. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}
