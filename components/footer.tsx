"use client"

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface FooterProps {
  language: "pashto" | "dari"
}

const translations = {
  pashto: {
    home: "کور",
    products: "محصولات",
    models: "ماډلونه",
    technology: "ټکنالوژي",
    sustainability: "پایښت",
    about: "زموږ په اړه",
    contact: "اړیکه",
    privacy: "د محرمیت تګلاره",
    terms: "شرایط",
    copyright: "© 2025 NANO BOT. ټول حقونه خوندي دي.",
  },
  dari: {
    home: "خانه",
    products: "محصولات",
    models: "مدل‌ها",
    technology: "تکنولوژی",
    sustainability: "پایداری",
    about: "درباره ما",
    contact: "تماس",
    privacy: "سیاست حفظ حریم خصوصی",
    terms: "شرایط",
    copyright: "© 2025 NANO BOT. تمام حقوق محفوظ است.",
  },
}

export function Footer({ language }: FooterProps) {
  const t = translations[language]
  const pathname = usePathname()

  const scrollToSection = (id: string) => {
    if (pathname !== "/") {
      window.location.href = `/#${id}`
    } else {
      const element = document.getElementById(id)
      element?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-background border-t border-border py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-6">
            <div className="text-3xl font-bold tracking-tighter">
              <span className="text-foreground">NANO</span>
              <span className="text-primary">BOT</span>
            </div>
            <p className="text-muted-foreground max-w-md text-lg font-light leading-relaxed">
              {language === "pashto" ? "د بریښنایی موټرسایکل صنعت کې مخکښ" : "پیشرو در صنعت موتورسیکلت‌های الکتریکی"}
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <a key={index} href="#" className="p-2 text-muted-foreground hover:text-primary transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">
              {language === "pashto" ? "لینکونه" : "لینک‌ها"}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t.products}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("models")}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm text-right w-full"
                >
                  {t.models}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("technology")}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm text-right w-full"
                >
                  {t.technology}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">
              {language === "pashto" ? "قانوني" : "قانونی"}
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm text-right w-full"
                >
                  {t.contact}
                </button>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">{t.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
