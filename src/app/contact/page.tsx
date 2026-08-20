"use client";

import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

const WHATSAPP_URL = "https://wa.me/message/T27HENDTW4LZJ1";

// Classes partagées pour les cartes de coordonnées
const cardClass =
  "bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-6 group hover:shadow-premium transition-all duration-300";
const iconWrapClass =
  "w-14 h-14 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-accent transition-colors duration-300";
const linkClass =
  "text-slate-600 text-sm block hover:text-accent transition-colors focus:outline-none focus:underline";

export default function ContactPage() {
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
            Contactez-nous
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Juris Ressources Consulting vous accompagne à Grand-Bassam et en Côte d&apos;Ivoire pour vos besoins juridiques, comptables, fiscaux et en ressources humaines.
          </p>
        </motion.div>

        {/* Grille coordonnées + formulaire */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">

          {/* Colonne gauche : coordonnées */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-primary mb-8 tracking-tight">Nos Coordonnées</h2>

            {/* Adresse */}
            <motion.div whileHover={{ x: 5 }} className={cardClass}>
              <div className={iconWrapClass}>
                <MapPin size={28} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-primary">Notre Adresse</h3>
                <address className="not-italic text-slate-600 text-sm leading-relaxed">
                  Maison Mak, Grand-Bassam<br />
                  Derrière la pharmacie Mockey-ville<br />
                  Côte d&apos;Ivoire
                </address>
              </div>
            </motion.div>

            {/* Téléphone — deux liens séparés */}
            <motion.div whileHover={{ x: 5 }} className={cardClass}>
              <div className={iconWrapClass}>
                <Phone size={28} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-primary">Téléphone</h3>
                <div className="space-y-1">
                  <a
                    href="tel:+2252731948863"
                    aria-label="Appeler le +225 27 31 94 88 63"
                    className={linkClass}
                  >
                    +225 27 31 94 88 63
                  </a>
                  <a
                    href="tel:+2250749436170"
                    aria-label="Appeler le +225 07 49 43 61 70"
                    className={linkClass}
                  >
                    +225 07 49 43 61 70
                  </a>
                </div>
              </div>
            </motion.div>

            {/* WhatsApp */}
            <motion.div whileHover={{ x: 5 }} className={cardClass}>
              <div className={iconWrapClass}>
                <MessageCircle size={28} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-primary">WhatsApp</h3>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contacter Juris Ressources Consulting sur WhatsApp"
                  className={linkClass}
                >
                  +225 07 07 02 05 12 12
                </a>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div whileHover={{ x: 5 }} className={cardClass}>
              <div className={iconWrapClass}>
                <Mail size={28} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-primary">Email</h3>
                <a
                  href="mailto:info.jrcsarl@gmail.com"
                  aria-label="Envoyer un email à Juris Ressources Consulting"
                  className={linkClass}
                >
                  info.jrcsarl@gmail.com
                </a>
              </div>
            </motion.div>

            {/* Horaires */}
            <motion.div whileHover={{ x: 5 }} className={cardClass}>
              <div className={iconWrapClass}>
                <Clock size={28} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-primary">Horaires d&apos;ouverture</h3>
                <p className="text-slate-600 text-sm">Lundi – Vendredi</p>
                <p className="text-slate-600 text-sm font-semibold">08h00 – 17h30</p>
                <p className="text-slate-400 text-xs mt-2">
                  Réponse sous 24 à 48 heures ouvrées.
                </p>
              </div>
            </motion.div>

          </motion.div>

          {/* Colonne droite : formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ConsultationForm title="Envoyez-nous un message" />
          </motion.div>

        </div>

        {/* Section Google Maps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary tracking-tight">
              Nous trouver à Grand-Bassam
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Maison Mak, derrière la pharmacie Mockey-ville — Grand-Bassam, Côte d&apos;Ivoire
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden h-[500px] shadow-premium border border-slate-100 relative group">
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.310611949146!2d-3.7670358999999998!3d5.2137994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1f9f0967a14c9%3A0xbde5f7a0bd73a183!2sMaison%20Mak%20Espace%20de%20Coworking!5e0!3m2!1sen!2sin!4v1787260322499!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Localisation de Juris Ressources Consulting à Grand-Bassam"
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
