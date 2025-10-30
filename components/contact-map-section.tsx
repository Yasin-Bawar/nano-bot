"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

interface ContactMapSectionProps {
  language: "pashto" | "dari"
  settings?: {
    title_dari: string
    title_pashto: string
    subtitle_dari: string
    subtitle_pashto: string
    address_dari: string
    address_pashto: string
    address_detail_dari: string
    address_detail_pashto: string
    phone: string
    email: string
    hours_dari: string
    hours_pashto: string
    hours_detail_dari: string
    hours_detail_pashto: string
  }
}

const defaultTranslations = {
  pashto: {
    title: "زموږ سره اړیکه ونیسئ",
    subtitle: "موږ ستاسو د خدمت لپاره دلته یو",
    address: "د هرات ښار، افغانستان",
    addressDetail: "د هرات مرکزي بازار، د موټرسایکل پلورنځي",
    phone: "+93 799 123 456",
    email: "info@electricbikes.af",
    hours: "اونۍ: 8:00 - 18:00",
    hoursDetail: "شنبه تر پنجشنبه",
    getDirections: "لارښوونې ترلاسه کړئ",
    sendMessage: "پیغام واستوئ",
  },
  dari: {
    title: "با ما تماس بگیرید",
    subtitle: "ما اینجا هستیم تا به شما خدمت کنیم",
    address: "شهر هرات، افغانستان",
    addressDetail: "بازار مرکزی هرات، فروشگاه موتورسیکلت",
    phone: "+93 799 123 456",
    email: "info@electricbikes.af",
    hours: "هفته: 8:00 - 18:00",
    hoursDetail: "شنبه تا پنجشنبه",
    getDirections: "دریافت مسیر",
    sendMessage: "ارسال پیام",
  },
}

export function ContactMapSection({ language, settings }: ContactMapSectionProps) {
  const defaults = defaultTranslations[language]
  
  const t = {
    title: language === "dari" ? (settings?.title_dari || defaults.title) : (settings?.title_pashto || defaults.title),
    subtitle: language === "dari" ? (settings?.subtitle_dari || defaults.subtitle) : (settings?.subtitle_pashto || defaults.subtitle),
    address: language === "dari" ? (settings?.address_dari || defaults.address) : (settings?.address_pashto || defaults.address),
    addressDetail: language === "dari" ? (settings?.address_detail_dari || defaults.addressDetail) : (settings?.address_detail_pashto || defaults.addressDetail),
    phone: settings?.phone || defaults.phone,
    email: settings?.email || defaults.email,
    hours: language === "dari" ? (settings?.hours_dari || defaults.hours) : (settings?.hours_pashto || defaults.hours),
    hoursDetail: language === "dari" ? (settings?.hours_detail_dari || defaults.hoursDetail) : (settings?.hours_detail_pashto || defaults.hoursDetail),
    getDirections: defaults.getDirections,
    sendMessage: defaults.sendMessage,
  }

  return (
    <section id="contact" className="relative bg-gray-50 py-20">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4"
          >
            {t.title}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 bg-gradient-to-r from-primary to-accent mx-auto mb-6 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-600"
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Address */}
            <motion.div
              whileHover={{ x: 10 }}
              className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">{t.address}</h3>
                <p className="text-gray-600">{t.addressDetail}</p>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              whileHover={{ x: 10 }}
              className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">{t.phone}</h3>
                <a href={`tel:${t.phone}`} className="text-primary hover:underline">
                  {t.phone}
                </a>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              whileHover={{ x: 10 }}
              className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">{t.email}</h3>
                <a href={`mailto:${t.email}`} className="text-primary hover:underline">
                  {t.email}
                </a>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div
              whileHover={{ x: 10 }}
              className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">{t.hours}</h3>
                <p className="text-gray-600">{t.hoursDetail}</p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-lg text-lg font-medium shadow-lg transition-all duration-300"
            >
              {t.sendMessage}
            </motion.button>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[600px] rounded-xl overflow-hidden shadow-xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d206253.4362193654!2d62.03658!3d34.352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f3cda6b6c5e5e5d%3A0x5e5e5e5e5e5e5e5e!2sHerat%2C%20Afghanistan!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="absolute bottom-6 left-6 right-6 bg-white p-4 rounded-lg shadow-lg"
            >
              <p className="text-sm font-medium text-gray-600 mb-2">{t.address}</p>
              <button className="text-primary font-semibold hover:underline">
                {t.getDirections} →
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
