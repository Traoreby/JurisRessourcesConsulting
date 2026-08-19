"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function CabinetPage() {
  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-12 text-center tracking-tight"
        >
          Notre Cabinet
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white p-8 md:p-14 rounded-3xl shadow-premium border border-slate-100 mb-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-4">
            <span className="w-10 h-1 bg-accent rounded-full inline-block"></span>
            Notre Histoire
          </h2>
          <p className="text-slate-600 mb-10 text-lg leading-relaxed max-w-3xl">
            Juris Ressources Consulting est né de la volonté d'offrir aux entreprises ivoiriennes et internationales un accompagnement sur mesure. Forts d'une expérience solide, nous avons réuni des experts passionnés pour répondre aux exigences complexes du monde des affaires.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 mt-12">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <h3 className="text-2xl font-bold text-primary mb-4">Notre Mission</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Accompagner les entreprises dans leur croissance en leur fournissant des conseils stratégiques, sécurisés et innovants dans les domaines juridique, fiscal, comptable et RH.
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-primary mb-10 text-center tracking-tight">Nos Valeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Excellence", desc: "La recherche constante de la perfection dans nos rendus." },
              { title: "Intégrité", desc: "L'éthique et la transparence au cœur de nos actions." },
              { title: "Engagement", desc: "Une implication totale dans la réussite de nos clients." }
            ].map((valeur, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-premium border border-slate-100 text-center transition-all duration-300 group"
              >
                <div className="w-16 h-16 mx-auto bg-primary/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <CheckCircle className="text-accent group-hover:text-white transition-colors duration-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{valeur.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed">{valeur.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
