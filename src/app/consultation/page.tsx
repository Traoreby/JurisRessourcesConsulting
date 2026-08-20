"use client";

import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { Phone, Mail, Clock, MapPin, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WHATSAPP_URL = "https://wa.me/message/T27HENDTW4LZJ1";

export default function ConsultationPage() {
  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 tracking-tight">
            Consultation Personnalisée
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Basé à Grand-Bassam, Côte d&apos;Ivoire, Juris Ressources Consulting vous accompagne dans vos besoins juridiques, comptables, fiscaux et en ressources humaines.
          </p>
        </motion.div>

        {/* Grille formulaire + sidebar */}
        <div className="grid lg:grid-cols-3 gap-10 items-start">

          {/* Formulaire — col 2/3 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <ConsultationForm />
          </motion.div>

          {/* Sidebar — col 1/3 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-primary text-white p-8 rounded-3xl shadow-premium-hover">
              <h3 className="text-2xl font-bold mb-8 tracking-tight">
                Contactez-nous directement
              </h3>

              <div className="space-y-7">

                {/* Localisation */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="text-accent" size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Localisation</p>
                    <p className="text-slate-300 text-sm mt-2">
                      Grand-Bassam, Côte d&apos;Ivoire
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      Maison Mak, derrière la pharmacie Mockey-ville
                    </p>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="text-accent" size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Téléphone</p>
                    <a
                      href="tel:+2252731948863"
                      className="text-slate-300 text-sm mt-2 block hover:text-accent transition-colors focus:outline-none focus:underline"
                    >
                      +225 27 31 94 88 63
                    </a>
                    <a
                      href="tel:+2250749436170"
                      className="text-slate-300 text-sm block hover:text-accent transition-colors focus:outline-none focus:underline"
                    >
                      +225 07 49 43 61 70
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="text-accent" size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Email</p>
                    <a
                      href="mailto:info.jrcsarl@gmail.com"
                      className="text-slate-300 text-sm mt-2 block hover:text-accent transition-colors focus:outline-none focus:underline"
                    >
                      info.jrcsarl@gmail.com
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle className="text-accent" size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">WhatsApp</p>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 text-sm mt-2 block hover:text-accent transition-colors focus:outline-none focus:underline"
                      aria-label="Ouvrir WhatsApp pour contacter Juris Ressources Consulting"
                    >
                      Nous écrire sur WhatsApp
                    </a>
                  </div>
                </div>

                {/* Horaires */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="text-accent" size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Horaires d&apos;ouverture</p>
                    <p className="text-slate-300 text-sm mt-2">Lundi — Vendredi</p>
                    <p className="text-slate-300 text-sm font-semibold">08h00 — 17h30</p>
                    <p className="text-slate-400 text-xs mt-2">
                      Réponse sous 24 à 48 heures ouvrées.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Badge confidentialité */}
            <div className="bg-accent/10 border border-accent/20 p-6 rounded-2xl">
              <p className="text-primary font-semibold text-sm leading-relaxed">
                📌 <strong>Confidentialité garantie :</strong> Toutes vos informations sont traitées avec la plus stricte confidentialité et ne sont jamais partagées avec des tiers.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
