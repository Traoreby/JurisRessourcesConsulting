import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('statut', 'publie')
    .single();

  if (!service) return {};

  const description = service.description || `Découvrez nos prestations pour : ${service.titre}`;

  return {
    title: service.titre,
    description: description,
    openGraph: {
      title: service.titre,
      description: description,
    }
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('statut', 'publie')
    .single();

  if (!service) {
    notFound();
  }

  // @ts-ignore
  const IconComponent = LucideIcons[service.icone] || LucideIcons.Circle;

  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/services" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium mb-10"
        >
          <ArrowLeft size={18} /> Retour aux domaines d'expertise
        </Link>
        
        <article className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-12 relative">
          <div className="bg-primary text-white p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-accent/5 transform scale-150 rotate-45" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <IconComponent size={64} className="text-accent mb-6" />
              <span className="bg-white/10 border border-white/20 text-white font-bold px-4 py-1.5 rounded-full text-xs tracking-widest uppercase mb-4">
                {service.categorie}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                {service.titre}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
          
          <div className="p-8 md:p-14">
            <div className="prose prose-lg max-w-none text-slate-600 mb-12">
              <div className="whitespace-pre-line">{service.contenu}</div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 md:p-10 rounded-2xl text-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-primary mb-4">Besoin d'accompagnement sur ce domaine ?</h3>
                <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                  Prenez rendez-vous avec l'un de nos experts pour une première analyse de votre situation.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Link 
                    href={`/consultation?service=${encodeURIComponent(service.titre)}`}
                    className="w-full sm:w-auto px-8 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-accent-hover transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    Demander une consultation
                  </Link>
                  <Link 
                    href={`/contact?subject=${encodeURIComponent("Question sur : " + service.titre)}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-primary font-bold hover:text-accent transition-colors"
                  >
                    Nous contacter <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
