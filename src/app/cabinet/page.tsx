"use client";

import Link from "next/link";
import { Star, ShieldCheck, Handshake, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const valeurs = [
  {
    title: "Excellence",
    icon: Star,
    desc: "Nous nous engageons à fournir des prestations de haute qualité, avec rigueur et précision, pour que chaque dossier traité soit à la hauteur des attentes de nos clients.",
  },
  {
    title: "Intégrité",
    icon: ShieldCheck,
    desc: "La transparence et l'éthique professionnelle guident chacune de nos interventions. Vos informations sont traitées avec la plus stricte confidentialité.",
  },
  {
    title: "Engagement",
    icon: Handshake,
    desc: "Nous nous impliquons pleinement dans la réussite de chaque client, en offrant un suivi personnalisé et une disponibilité adaptée à vos besoins.",
  },
];

export default function CabinetPage() {
  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-12 text-center tracking-tight"
        >
          Juris Ressources Consulting,{" "}
          <span className="text-accent">un cabinet engagé</span> aux côtés des entreprises
        </motion.h1>

        {/* Histoire + Mission + Vision */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white p-8 md:p-14 rounded-3xl shadow-premium border border-slate-100 mb-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />

          <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-4">
            <span className="w-10 h-1 bg-accent rounded-full inline-block" />
            Notre Histoire
          </h2>

          <p className="text-slate-600 mb-4 text-lg leading-relaxed max-w-3xl">
            Créé en 2025 et basé à Grand-Bassam, en Côte d'Ivoire, Juris Ressources Consulting (JRC) est né de la volonté d'offrir aux entreprises et aux professionnels un accompagnement de proximité, rigoureux et personnalisé.
          </p>
          <p className="text-slate-600 mb-10 text-lg leading-relaxed max-w-3xl">
            Face aux exigences croissantes du monde des affaires, nous avons réuni une équipe d'experts dans les domaines juridique, comptable, fiscal et des ressources humaines, pour apporter des solutions concrètes et adaptées aux réalités des entreprises ivoiriennes et de la sous-région.
          </p>

          {/* Badge institutionnel discret */}
          <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-sm text-slate-500 font-medium mb-10">
            <span className="w-2 h-2 bg-accent rounded-full" />
            SARLU &bull; Fondée en 2025 &bull; Grand-Bassam, Côte d'Ivoire
          </div>

          {/* Mission / Vision */}
          <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <h3 className="text-2xl font-bold text-primary mb-4">Notre Mission</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Accompagner les entreprises dans leur croissance en leur fournissant des conseils stratégiques, rigoureux et adaptés dans les domaines juridique, fiscal, comptable et RH.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <h3 className="text-2xl font-bold text-primary mb-4">Notre Vision</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Devenir le partenaire de référence en Côte d'Ivoire et dans la sous-région pour toutes les entreprises souhaitant allier performance et conformité.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Valeurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-primary mb-10 text-center tracking-tight">Nos Valeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {valeurs.map((valeur, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-premium border border-slate-100 text-center transition-all duration-300 group"
              >
                <div className="w-16 h-16 mx-auto bg-primary/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <valeur.icon className="text-accent group-hover:text-white transition-colors duration-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{valeur.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed">{valeur.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary text-white p-10 md:p-14 rounded-3xl shadow-premium-hover text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-accent/5 rounded-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Parlons de vos besoins
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto font-medium">
              Vous recherchez un accompagnement juridique, comptable, fiscal ou en ressources humaines ? Notre équipe est à votre écoute.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/consultation"
                className="px-8 py-4 bg-accent text-primary font-bold rounded-lg hover:bg-accent-hover transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
              >
                Demander une consultation
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-accent transition-colors font-semibold text-sm group"
              >
                Nous contacter
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
