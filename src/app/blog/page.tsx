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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 tracking-tight">Blog & Actualités</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Restez informé des dernières évolutions législatives, fiscales et pratiques professionnelles.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-4 py-2 rounded-lg z-20 shadow-sm">
                  {article.category}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h2 className="text-2xl font-bold text-primary mb-4 leading-tight group-hover:text-accent transition-colors">
                  <Link href={`/blog/${article.id}`}>{article.title}</Link>
                </h2>
                <div className="flex items-center gap-6 text-sm text-slate-500 mb-6 font-medium">
                  <div className="flex items-center gap-2"><Calendar size={16} className="text-accent" /> {article.date}</div>
                  <div className="flex items-center gap-2"><User size={16} className="text-accent" /> {article.author}</div>
                </div>
                <p className="text-slate-600 text-base mb-8 flex-grow leading-relaxed">{article.excerpt}</p>
                
                <Link href={`/blog/${article.id}`} className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-accent transition-colors mt-auto group/link">
                  Lire l'article <ArrowRight size={18} className="transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
