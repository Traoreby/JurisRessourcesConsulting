"use client";

import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 tracking-tight">Contactez-nous</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Notre équipe est à votre écoute pour toute demande d'information.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-primary mb-8 tracking-tight">Nos Coordonnées</h2>
            
            {[
              { icon: MapPin, title: "Notre Adresse", lines: ["Maison Mak, Grand-Bassam", "Derrière la pharmacie Mockey-ville", "Côte d'Ivoire"], link: null },
              { icon: Phone, title: "Téléphone", lines: ["+225 27 31 94 88 63", "+225 05 76 70 22 10"], link: "tel:+2252731948863" },
              { icon: MessageCircle, title: "WhatsApp", lines: ["+225 07 07 02 05 12 12"], link: "https://wa.me/225070702051212" },
              { icon: Mail, title: "Email", lines: ["info.jrcsarl@gmail.com"], link: "mailto:info.jrcsarl@gmail.com" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ x: 5 }}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-6 group hover:shadow-premium transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                  <item.icon size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-primary">{item.title}</h3>
                  {item.link ? (
                    <a href={item.link} className="text-slate-600 hover:text-accent transition-colors">
                      {item.lines.map((line, i) => <p key={i}>{line}</p>)}
                    </a>
                  ) : (
                    <div className="text-slate-600">
                      {item.lines.map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ConsultationForm />
          </motion.div>
        </div>

        {/* Google Maps Embed */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden h-[500px] shadow-premium border border-slate-100 relative group"
        >
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10"></div>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15891.077651036067!2d-3.7485303914440533!3d5.201974719277054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1c2a0d1b32d5f%3A0x6b09be8c21cd4de6!2sGrand-Bassam%2C%20C%C3%B4te%20d%27Ivoire!5e0!3m2!1sfr!2s!4v1700000000000!5m2!1sfr!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
}
