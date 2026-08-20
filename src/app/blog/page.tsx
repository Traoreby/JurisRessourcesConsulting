"use client";

import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const articles = [
  {
    id: 1,
    title: "La loi de finances 2026 : Ce qui change pour les PME en Côte d'Ivoire",
    category: "Fiscalité",
    date: "15 Août 2026",
    author: "Expert Fiscal",
    excerpt: "Une analyse détaillée des nouvelles dispositions fiscales et de leur impact sur la gestion quotidienne des entreprises ivoiriennes.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Bien rédiger un contrat de travail : Les pièges à éviter",
    category: "Juridique",
    date: "2 Août 2026",
    author: "Expert Juridique",
    excerpt: "Le contrat de travail est le socle de la relation employeur-employé. Découvrez les clauses essentielles pour sécuriser vos recrutements.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Comment optimiser la gestion de la paie de votre entreprise",
    category: "Ressources Humaines",
    date: "20 Juillet 2026",
    author: "Expert RH",
    excerpt: "La gestion de la paie peut être un casse-tête administratif. Voici nos conseils pour la simplifier et éviter les erreurs coûteuses.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
  }
];

export default function BlogPage() {
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 tracking-tight">Blog & Actualités</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Juris Ressources Consulting décrypte pour vous l'actualité juridique, fiscale, comptable et RH à Grand-Bassam et en Côte d'Ivoire.
          </p>
        </motion.div>

        {/* Introduction H2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold text-primary tracking-tight">Nos dernières actualités</h2>
        </motion.div>

        {/* Grille d'articles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {articles.map((article, idx) => (
            <motion.article 
              key={article.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-premium transition-all duration-300 group"
            >
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-4 py-2 rounded-lg z-20 shadow-sm">
                  {article.category}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-primary mb-4 leading-tight group-hover:text-accent transition-colors">
                  <Link 
                    href={`/contact?subject=${encodeURIComponent("Question sur : " + article.title)}`}
                    className="focus:outline-none focus:underline"
                  >
                    {article.title}
                  </Link>
                </h3>
                <div className="flex items-center gap-6 text-sm text-slate-500 mb-6 font-medium">
                  <div className="flex items-center gap-2"><Calendar size={16} className="text-accent" aria-hidden="true" /> {article.date}</div>
                  <div className="flex items-center gap-2"><User size={16} className="text-accent" aria-hidden="true" /> {article.author}</div>
                </div>
                <p className="text-slate-600 text-base mb-8 flex-grow leading-relaxed">{article.excerpt}</p>
                
                <Link 
                  href={`/contact?subject=${encodeURIComponent("Question sur : " + article.title)}`}
                  className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-accent transition-colors mt-auto group/link focus:outline-none focus:ring-2 focus:ring-accent rounded-md px-2 py-1 -ml-2"
                >
                  En savoir plus <ArrowRight size={18} className="transform group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Une question sur votre situation ?
            </h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Nos experts de Juris Ressources Consulting vous accompagnent en droit, comptabilité, fiscalité et ressources humaines.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/consultation"
                className="w-full sm:w-auto px-8 py-4 bg-accent text-primary font-bold rounded-xl hover:bg-white hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              >
                Demander une consultation
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
