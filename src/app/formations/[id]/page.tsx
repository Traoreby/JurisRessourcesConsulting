import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Users as UsersIcon, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: formation } = await supabase
    .from('formations')
    .select('*')
    .eq('id', id)
    .eq('statut', 'actif')
    .single();

  if (!formation) return {};

  const description = formation.description || `Découvrez notre formation : ${formation.titre}`;

  return {
    title: formation.titre,
    description: description,
    openGraph: {
      title: formation.titre,
      description: description,
      images: formation.image ? [formation.image] : undefined,
    }
  };
}

export default async function FormationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: formation } = await supabase
    .from('formations')
    .select('*')
    .eq('id', id)
    .eq('statut', 'actif')
    .single();

  if (!formation) {
    notFound();
  }

  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/formations" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium mb-10"
        >
          <ArrowLeft size={18} /> Retour aux formations
        </Link>
        
        <article className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-12">
          {formation.image && (
            <div className="relative w-full h-[300px] md:h-[450px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={formation.image}
                alt={formation.titre}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8 md:p-14">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {formation.categorie && (
                <span className="bg-primary/5 border border-slate-100 text-accent font-bold px-4 py-2 rounded-lg text-sm tracking-widest uppercase">
                  {formation.categorie}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mb-6 leading-tight">
              {formation.titre}
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 font-medium leading-relaxed">
              {formation.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                  <Clock size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Durée</p>
                  <p className="font-bold text-primary">{formation.duree}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                  <UsersIcon size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Public cible</p>
                  <p className="font-bold text-primary">{formation.public_cible}</p>
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none text-slate-600 mb-12">
              <h3 className="text-2xl font-bold text-primary mb-6">Programme de la formation</h3>
              <div dangerouslySetInnerHTML={{ __html: formation.contenu.replace(/\n/g, '<br />') }} />
            </div>

            <div className="bg-primary text-white p-8 md:p-10 rounded-2xl shadow-premium-hover text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Intéressé par ce programme ?</h3>
                <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                  Contactez-nous pour connaître les prochaines sessions ou organiser une formation sur mesure pour votre équipe.
                </p>
                <Link 
                  href={`/contact?subject=${encodeURIComponent("Inscription formation : " + formation.titre)}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-primary font-bold rounded-xl hover:bg-white transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                >
                  Demander le programme détaillé <BookOpen size={20} />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
