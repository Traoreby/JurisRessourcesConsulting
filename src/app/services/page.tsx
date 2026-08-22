"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import * as LucideIcons from "lucide-react";



export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('statut', 'publie')
        .order('ordre', { ascending: true });
        
      if (data) {
        setServices(data);
      }
      setLoading(false);
    };
    
    fetchServices();
  }, [supabase]);

  // Helper to render icon component dynamically
  const renderIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = LucideIcons[iconName] || LucideIcons.Circle;
    return <IconComponent size={64} className="text-accent mb-6 relative z-10" />;
  };
  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 tracking-tight">
            Nos Domaines d&apos;Expertise
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium">
            Juris Ressources Consulting accompagne les entreprises et professionnels à Grand-Bassam et en Côte d&apos;Ivoire dans leurs besoins juridiques, comptables, fiscaux et en ressources humaines.
          </p>
        </motion.div>

        {/* Services */}
        <div className="space-y-16">
          {loading ? (
            <div className="text-center py-20 text-slate-500">Chargement des services...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 text-slate-500">Aucun service disponible pour le moment.</div>
          ) : services.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden flex flex-col md:flex-row scroll-mt-32 group hover:shadow-premium-hover transition-all duration-500"
            >
              {/* Panneau coloré */}
              <div
                className={`md:w-2/5 bg-primary text-white p-10 flex flex-col justify-center items-center text-center relative overflow-hidden ${
                  index % 2 !== 0 ? "md:order-last" : ""
                }`}
              >
                <div className="absolute inset-0 bg-accent/5 transform scale-150 rotate-45 group-hover:rotate-90 transition-transform duration-1000" />
                {renderIcon(service.icone)}
                <h2 className="text-3xl font-bold mb-6 relative z-10">
                  <Link href={`/services/${service.id}`} className="hover:text-accent transition-colors focus:outline-none focus:underline">
                    {service.titre}
                  </Link>
                </h2>
                <Link
                  href="/consultation"
                  aria-label={`Demander une consultation pour ${service.titre}`}
                  className="mt-4 px-8 py-3 bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary transition-colors font-bold rounded-lg relative z-10"
                >
                  Consulter
                </Link>
              </div>

              {/* Panneau texte */}
              <div className="md:w-3/5 p-10 md:p-14">
                <p className="text-slate-600 text-xl mb-10 leading-relaxed">{service.description}</p>
                <h3 className="font-bold text-primary text-lg mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-accent rounded-full" /> Nos prestations incluent :
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(Array.isArray(service.prestations) ? service.prestations : []).map((prest: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                      <ArrowRight size={20} className="text-accent shrink-0 mt-0.5" />
                      <span>{prest}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex justify-end">
                  <Link 
                    href={`/services/${service.id}`}
                    className="inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors group focus:outline-none focus:ring-2 focus:ring-accent rounded-lg px-3 py-2"
                  >
                    Détails du service <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 bg-primary text-white p-10 md:p-14 rounded-3xl shadow-premium-hover text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-accent/5 rounded-3xl" />
          <div className="relative z-10">
            <span className="text-sm font-bold uppercase tracking-widest text-accent mb-4 block">
              Besoin d&apos;un accompagnement ?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Parlons de vos besoins professionnels
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto font-medium">
              Nos équipes sont à votre disposition pour comprendre votre situation et vous orienter vers l&apos;accompagnement le plus adapté.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/consultation"
                className="px-8 py-4 bg-accent text-primary font-bold rounded-lg hover:bg-accent-hover transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              >
                Demander une consultation
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-accent transition-colors font-semibold text-sm group focus:outline-none focus:underline"
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
