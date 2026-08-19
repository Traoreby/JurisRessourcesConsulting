"use client";

import Link from "next/link";
import { Clock, Users as UsersIcon, BookOpen } from "lucide-react";
import { motion } from "framer-motion";


const formations = [
  {
    id: 1,
    title: "Maitrise de la paie et des déclarations sociales",
    category: "Ressources Humaines",
    duration: "3 jours",
    audience: "Gestionnaires RH, Comptables",
    desc: "Une formation pratique pour maitriser le traitement de la paie et les obligations sociales en Côte d'Ivoire.",
  },
  {
    id: 2,
    title: "Optimisation fiscale des entreprises",
    category: "Fiscalité",
    duration: "2 jours",
    audience: "Chefs d'entreprise, DAF",
    desc: "Comprendre les leviers d'optimisation fiscale tout en restant en stricte conformité avec la loi.",
  },
  {
    id: 3,
    title: "Les fondamentaux du droit du travail",
    category: "Juridique",
    duration: "2 jours",
    audience: "Managers, Entrepreneurs",
    desc: "Sécurisez vos relations de travail en maîtrisant les règles essentielles du droit social ivoirien.",
  }
];

export default function FormationsPage() {
  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 tracking-tight">Nos Formations</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Développez les compétences de vos équipes grâce à nos programmes de formation animés par des experts de terrain.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {formations.map((form, idx) => (
            <motion.div 
              key={form.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-premium transition-all duration-300 group"
            >
              <div className="bg-primary/5 p-5 border-b border-slate-100 group-hover:bg-primary transition-colors duration-300">
                <span className="text-xs font-bold uppercase tracking-widest text-accent group-hover:text-white transition-colors">{form.category}</span>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-primary mb-4 leading-tight">{form.title}</h3>
                <p className="text-slate-600 text-base mb-8 flex-grow leading-relaxed">{form.desc}</p>
                
                <div className="space-y-3 mb-8 text-sm text-slate-700 font-medium bg-slate-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-accent" />
                    <span>Durée : {form.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <UsersIcon size={18} className="text-accent" />
                    <span>Public : {form.audience}</span>
                  </div>
                </div>
                
                <Link href={`/contact?subject=Inscription formation ${form.id}`} className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all text-sm font-bold shadow-md hover:shadow-lg">
                  Demander le programme <BookOpen size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
