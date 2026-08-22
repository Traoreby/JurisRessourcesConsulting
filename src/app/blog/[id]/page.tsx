import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from('actualites')
    .select('*')
    .eq('id', id)
    .eq('statut', 'publie')
    .single();

  if (!article) return {};

  const description = article.contenu?.substring(0, 150) + "..." || "Découvrez notre actualité.";

  return {
    title: article.titre,
    description: description,
    openGraph: {
      title: article.titre,
      description: description,
      images: article.image ? [article.image] : undefined,
    }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: article } = await supabase
    .from('actualites')
    .select('*')
    .eq('id', id)
    .eq('statut', 'publie')
    .single();

  if (!article) {
    notFound();
  }

  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium mb-10"
        >
          <ArrowLeft size={18} /> Retour aux actualités
        </Link>
        
        <article className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-12">
          {article.image && (
            <div className="relative w-full h-[300px] md:h-[450px]">
              <Image 
                src={article.image}
                alt={article.titre}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          )}
          
          <div className="p-8 md:p-14">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="bg-accent/10 text-accent font-bold px-4 py-2 rounded-lg text-sm">
                {article.categorie}
              </span>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Calendar size={16} className="text-accent" />
                {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mb-10 leading-tight">
              {article.titre}
            </h1>
            
            <div className="prose prose-lg max-w-none text-slate-600">
              <div dangerouslySetInnerHTML={{ __html: article.contenu.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        </article>

        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="font-semibold text-primary">Avez-vous des questions sur cet article ?</p>
          <Link 
            href={`/contact?subject=${encodeURIComponent("Question sur : " + article.titre)}`}
            className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-hover transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
