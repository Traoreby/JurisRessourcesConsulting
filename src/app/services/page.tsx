"use client";

import Link from "next/link";
import { Scale, Calculator, Landmark, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    id: "juridique",
    title: "Assistance Juridique",
    icon: Scale,
    desc: "Nous sécurisons vos opérations et vous accompagnons dans toutes vos démarches juridiques, de la création à la restructuration.",
    prestations: ["Création d'entreprises", "Rédaction de contrats et actes", "Secrétariat juridique", "Assistance au contentieux"]
  },
  {
    id: "comptable",
    title: "Accompagnement Comptable",
    icon: Calculator,
    desc: "Une gestion comptable rigoureuse pour vous permettre de vous concentrer sur le cœur de votre métier.",
    prestations: ["Tenue de la comptabilité", "Établissement des états financiers", "Tableaux de bord de gestion", "Audit comptable"]
  },
  {
    id: "fiscal",
    title: "Conseil Fiscal",
    icon: Landmark,
    desc: "Optimisation de votre charge fiscale tout en garantissant le respect strict de la réglementation en vigueur.",
    prestations: ["Déclarations fiscales", "Assistance en cas de contrôle", "Audit fiscal", "Ingénierie fiscale"]
  },
  {
    id: "rh",
    title: "Ressources Humaines",
    icon: Users,
    desc: "Valorisation de votre capital humain par une gestion moderne et conforme au droit du travail.",
    prestations: ["Recrutement", "Gestion de la paie", "Rédaction des contrats de travail", "Gestion des conflits sociaux"]
  }
];

export default function ServicesPage() {
  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 tracking-tight">Nos Domaines d'Expertise</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Une offre de services complète, pensée pour répondre aux exigences de chaque étape du développement de votre entreprise.
          </p>
        </motion.div>

        <div className="space-y-16">
          {services.map((service, index) => (
            <motion.div 
              key={service.id} 
              id={service.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden flex flex-col md:flex-row scroll-mt-32 group hover:shadow-premium-hover transition-all duration-500"
            >
              <div className={`md:w-2/5 bg-primary text-white p-10 flex flex-col justify-center items-center text-center relative overflow-hidden ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                <div className="absolute inset-0 bg-accent/5 transform scale-150 rotate-45 group-hover:rotate-90 transition-transform duration-1000"></div>
                <service.icon size={64} className="text-accent mb-6 relative z-10" />
                <h2 className="text-3xl font-bold mb-6 relative z-10">{service.title}</h2>
                <Link href="/consultation" className="mt-4 px-8 py-3 bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-primary transition-colors font-bold rounded-lg relative z-10">
                  Consulter
                </Link>
              </div>
              <div className="md:w-3/5 p-10 md:p-14">
                <p className="text-slate-600 text-xl mb-10 leading-relaxed">{service.desc}</p>
                <h3 className="font-bold text-primary text-lg mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-accent rounded-full"></span> Nos prestations incluent :
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.prestations.map((prest, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                      <ArrowRight size={20} className="text-accent shrink-0 mt-0.5" />
                      <span>{prest}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
