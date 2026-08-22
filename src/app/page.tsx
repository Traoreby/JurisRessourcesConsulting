"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Scale, Calculator, Landmark, Users, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [partners, setPartners] = useState<any[]>([]);
  const [publicite, setPublicite] = useState<any | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchPartners = async () => {
      const { data } = await supabase
        .from('partners')
        .select('*')
        .eq('statut', 'actif')
        .order('ordre', { ascending: true });
        
      if (data) {
        setPartners(data);
      }
    };
    
    const fetchPublicite = async () => {
      const { data } = await supabase
        .from('publicites')
        .select('*')
        .eq('statut', 'actif');
        
      if (data && data.length > 0) {
        const now = new Date();
        const validAds = data.filter((ad) => {
          const start = ad.date_debut ? new Date(ad.date_debut) : null;
          const end = ad.date_fin ? new Date(ad.date_fin) : null;
          if (start && now < start) return false;
          if (end && now > end) return false;
          return true;
        });
        if (validAds.length > 0) {
          // On prend la première publicité valide (la plus récente par exemple)
          setPublicite(validAds[0]);
        }
      }
    };

    fetchPartners();
    fetchPublicite();
  }, [supabase]);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image 
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Background" 
            fill 
            className="object-cover object-center" 
            priority
            unoptimized 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/85 to-primary" />
        
        <div className="container relative z-10 mx-auto px-4 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
              Votre partenaire stratégique pour une gestion <span className="text-accent relative inline-block">performante<svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M0 15 Q 50 30 100 10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/></svg></span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-medium"
          >
            Cabinet basé à Grand-Bassam, Côte d'Ivoire, Juris Ressources Consulting (JRC) vous accompagne avec expertise en conseil juridique, fiscalité, comptabilité et gestion des ressources humaines.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link href="/services" className="px-8 py-4 bg-accent text-primary font-bold rounded-lg hover:bg-accent-hover transition-all w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
              Découvrez nos offres
            </Link>
            <Link href="/formations" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all w-full sm:w-auto border border-white/20 backdrop-blur-md transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
              Découvrez nos formations
            </Link>
          </motion.div>
        </div>
      </section>

      {/* À propos brève */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-accent mb-4 block">À propos de JRC</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6 tracking-tight">Un cabinet de confiance à votre écoute</h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
              Basé à Grand-Bassam, Côte d'Ivoire, et créé pour répondre aux défis complexes des entreprises modernes, Juris Ressources Consulting met à votre disposition une équipe d'experts dévoués. Notre approche pluridisciplinaire nous permet d'offrir des solutions sur mesure adaptées au contexte ivoirien et international.
            </p>
            <Link href="/cabinet" className="inline-flex items-center gap-3 text-primary font-bold hover:text-accent transition-colors group text-lg">
              En savoir plus sur JRC <ArrowRight size={22} className="transform group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Domaines d'expertise */}
      <section className="py-24 bg-slate-50/80 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-accent mb-4 block">Nos Spécialités</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 tracking-tight">Nos domaines d'expertise</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">Des solutions complètes pour structurer, protéger et développer votre activité.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Assistance Juridique", icon: Scale, desc: "Rédaction d'actes, création d'entreprises, contentieux et conseil juridique.", link: "/services#juridique" },
              { title: "Accompagnement Comptable", icon: Calculator, desc: "Tenue comptable, bilans, déclarations et optimisation.", link: "/services#comptabilite" },
              { title: "Conseil Fiscal", icon: Landmark, desc: "Audit fiscal, assistance à contrôle et ingénierie fiscale.", link: "/services#fiscalite" },
              { title: "Ressources Humaines", icon: Users, desc: "Recrutement, paie, contrats et gestion des conflits.", link: "/services#ressources-humaines" }
            ].map((service, idx) => (
              <Link href={service.link} key={idx} className="block focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-premium transition-all group h-full cursor-pointer"
                >
                  <div className="w-16 h-16 bg-primary/5 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                    <service.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{service.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Publicité (si disponible) */}
      {publicite && (
        <section className="py-20 bg-accent/5 border-y border-accent/10">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden flex flex-col md:flex-row items-center max-w-5xl mx-auto"
            >
              {publicite.image && (
                <div className="w-full md:w-2/5 aspect-video md:aspect-auto md:h-full min-h-[300px] relative">
                  <Image 
                    src={publicite.image} 
                    alt={publicite.titre}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className={`w-full p-10 md:p-14 flex flex-col justify-center ${publicite.image ? 'md:w-3/5' : 'items-center text-center'}`}>
                <span className="text-sm font-bold uppercase tracking-widest text-accent mb-4 block">Annonce</span>
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">{publicite.titre}</h3>
                <p className="text-slate-600 mb-8 text-lg font-medium leading-relaxed">{publicite.texte}</p>
                {publicite.texte_bouton && publicite.url_bouton && (
                  <div>
                    <a 
                      href={publicite.url_bouton} 
                      target={publicite.url_bouton.startsWith('/') ? "_self" : "_blank"} 
                      rel="noopener noreferrer"
                      className="inline-flex px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                    >
                      {publicite.texte_bouton}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Pourquoi nous choisir */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6 tracking-tight">Pourquoi faire appel à nos experts ?</h2>
              <p className="text-slate-600 mb-10 text-lg font-medium leading-relaxed">
                Nous bâtissons avec nos clients des relations de confiance basées sur l'excellence et la transparence.
              </p>
              <ul className="space-y-5">
                {[
                  "Une expertise pointue et actualisée",
                  "Un accompagnement 100% personnalisé",
                  "Confidentialité absolue de vos données",
                  "Réactivité et respect des délais",
                  "Une approche profondément professionnelle"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="text-accent" size={20} />
                    </div>
                    <span className="text-primary font-semibold">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-premium-hover relative">
                <Image 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop" 
                  alt="Équipe en réunion" 
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-primary text-white p-6 rounded-2xl shadow-lg border border-white/10 hidden md:block">
                <p className="text-3xl font-extrabold text-accent mb-1">Expertise</p>
                <p className="text-sm font-semibold">Au service de votre réussite</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partenariats (Préparation) */}
      <section className="py-24 bg-slate-50/80 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold uppercase tracking-widest text-accent mb-4 block">Réseau</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 tracking-tight">Nos partenariats</h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg font-medium leading-relaxed">
              Nous construisons des partenariats durables avec des acteurs engagés pour créer davantage d'opportunités et apporter une réelle valeur à nos clients.
            </p>
          </motion.div>

          {partners.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-12 md:p-16 rounded-3xl shadow-sm border border-slate-100 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/[0.02]" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-primary mb-4">Nos partenaires</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Découvrez prochainement les organisations et acteurs avec lesquels Juris Ressources Consulting développe des collaborations.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {partners.map((partner) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center gap-4 h-full"
                >
                  {partner.logo ? (
                    <div className="relative w-full aspect-[3/2] flex items-center justify-center">
                      <Image 
                        src={partner.logo} 
                        alt={`Logo de ${partner.nom}`}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-xl">
                      {partner.nom.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-primary mb-1">{partner.nom}</h4>
                    {partner.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">{partner.description}</p>
                    )}
                  </div>
                  {partner.site_web && (
                    <a 
                      href={partner.site_web} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-accent hover:text-primary transition-colors mt-auto pt-2"
                    >
                      Visiter le site
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-28 bg-primary text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66cb85?q=80&w=2000&auto=format&fit=crop" 
            alt="CTA Background" 
            fill 
            className="object-cover object-center"
            unoptimized 
          />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 max-w-3xl relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Besoin d'un accompagnement professionnel ?</h2>
          <p className="text-slate-300 mb-10 text-xl font-medium">
            Nos experts sont à votre disposition pour analyser vos besoins et vous proposer des solutions concrètes.
          </p>
          <Link href="/services" className="inline-flex px-10 py-5 bg-accent text-primary font-extrabold rounded-xl hover:bg-accent-hover transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
            Découvrez nos offres
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
