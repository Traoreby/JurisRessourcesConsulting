"use client";

import Link from "next/link";
import { Clock, Users as UsersIcon, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const formations = [
  {
    id: 1,
    title: "Maîtrise de la paie et des déclarations sociales",
    category: "Ressources Humaines",
    duration: "3 jours",
    audience: "Gestionnaires RH, Comptables",
    desc: "Une formation pratique pour maîtriser le traitement de la paie et les obligations sociales en Côte d'Ivoire.",
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
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 tracking-tight">
            Nos Formations
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Juris Ressources Consulting vous accompagne à Grand-Bassam et en Côte d&apos;Ivoire avec des formations professionnelles conçues pour développer les compétences de vos équipes.
          </p>
        </motion.div>

        {/* Introduction Liste */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-primary tracking-tight">Des formations adaptées à vos besoins</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Découvrez nos programmes animés par des experts de terrain, pensés pour répondre aux défis réels des entreprises ivoiriennes.
          </p>
        </motion.div>

        {/* Grille de formations */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
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
                    <Clock size={18} className="text-accent" aria-hidden="true" />
                    <span>Durée : {form.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <UsersIcon size={18} className="text-accent" aria-hidden="true" />
                    <span>Public : {form.audience}</span>
                  </div>
                </div>
                
                <Link 
                  href={`/contact?subject=Inscription formation ${form.id}`} 
                  aria-label={`Demander le programme – ${form.title}`}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all text-sm font-bold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                >
                  Demander le programme <BookOpen size={18} aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary rounded-3xl p-8 md:p-12 text-center shadow-premium relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2 pointer-events-none" aria-hidden="true"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Formation sur mesure</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Un besoin spécifique pour votre équipe ?
            </h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Juris Ressources Consulting peut concevoir des formations adaptées aux besoins de votre entreprise, de vos collaborateurs ou de votre organisation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact?subject=Demande%20de%20formation%20sur%20mesure"
                className="w-full sm:w-auto px-8 py-4 bg-accent text-primary font-bold rounded-xl hover:bg-white hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              >
                Demander une formation
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-primary-hover text-white font-bold rounded-xl border border-slate-600 hover:border-slate-400 hover:bg-slate-700 transition-all duration-300 flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
