import Link from "next/link";
import {
  FileText,
  GraduationCap,
  Briefcase,
  Handshake,
  MessageSquare,
  Plus,
  Clock,
  ChevronRight,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Récupération des statistiques
  const [{ count: articlesPublies }, { count: articlesBrouillon }, { count: formations }, { count: services }, { count: partenaires }, { count: demandesNouvelles }] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("statut", "publié"),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("statut", "brouillon"),
    supabase.from("formations").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("partners").select("id", { count: "exact", head: true }),
    supabase.from("demandes").select("id", { count: "exact", head: true }).eq("statut", "Nouveau"),
  ]);

  // Récupération des dernières demandes
  const { data: recentDemandesData } = await supabase
    .from("demandes")
    .select("id, nom, objet, message, created_at, statut")
    .order("created_at", { ascending: false })
    .limit(4);

  // Récupération des derniers articles
  const { data: recentArticlesData } = await supabase
    .from("articles")
    .select("id, titre, categorie, updated_at, statut")
    .order("updated_at", { ascending: false })
    .limit(3);

  const recentDemandes = recentDemandesData || [];
  const recentArticles = recentArticlesData || [];

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };



  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité de Juris Ressources Consulting"
        actions={
          <Link
            href="/admin/articles/nouveau"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
          >
            <Plus size={16} aria-hidden="true" />
            Nouvel article
          </Link>
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-8">


        {/* Stats */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
            Statistiques
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              title="Articles publiés"
              value={articlesPublies || 0}
              icon={<FileText size={20} />}
            />
            <StatCard
              title="Brouillons"
              value={articlesBrouillon || 0}
              icon={<FileText size={20} />}
            />
            <StatCard
              title="Formations"
              value={formations || 0}
              icon={<GraduationCap size={20} />}
            />
            <StatCard
              title="Services"
              value={services || 0}
              icon={<Briefcase size={20} />}
            />
            <StatCard
              title="Partenaires"
              value={partenaires || 0}
              icon={<Handshake size={20} />}
            />
            <StatCard
              title="Nouvelles demandes"
              value={demandesNouvelles || 0}
              icon={<MessageSquare size={20} />}
              highlight={(demandesNouvelles || 0) > 0}
              description="À traiter"
            />
          </div>
        </section>

        {/* Tables côte à côte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dernières demandes */}
          <section aria-labelledby="demandes-heading" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-accent" aria-hidden="true" />
                <h2 id="demandes-heading" className="font-bold text-primary text-sm">
                  Dernières demandes
                </h2>
              </div>
              <Link
                href="/admin/demandes"
                className="text-xs font-semibold text-accent hover:text-primary transition-colors flex items-center gap-1 focus:outline-none focus:underline"
              >
                Voir tout <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentDemandes.map((d) => (
                <div key={d.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-semibold text-primary text-sm truncate">{d.nom}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{d.objet ?? d.message?.slice(0, 50)}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(d.created_at)}</p>
                  </div>
                  <StatusBadge statut={d.statut} />
                </div>
              ))}
            </div>
          </section>

          {/* Derniers articles */}
          <section aria-labelledby="articles-heading" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-accent" aria-hidden="true" />
                <h2 id="articles-heading" className="font-bold text-primary text-sm">
                  Derniers articles
                </h2>
              </div>
              <Link
                href="/admin/articles"
                className="text-xs font-semibold text-accent hover:text-primary transition-colors flex items-center gap-1 focus:outline-none focus:underline"
              >
                Voir tout <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentArticles.map((a) => (
                <Link
                  key={a.id}
                  href={`/admin/articles/${a.id}`}
                  className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors block focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-primary text-sm truncate">{a.titre}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{a.categorie}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(a.updated_at)}</p>
                  </div>
                  <StatusBadge statut={a.statut} />
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Accès rapides */}
        <section aria-labelledby="quick-access-heading">
          <h2 id="quick-access-heading" className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
            Accès rapides
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Nouvel article", href: "/admin/articles/nouveau", icon: FileText },
              { label: "Nouvelle formation", href: "/admin/formations", icon: GraduationCap },
              { label: "Voir les demandes", href: "/admin/demandes", icon: MessageSquare },
              { label: "Paramètres", href: "/admin/parametres", icon: Briefcase },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-accent/40 hover:shadow-md transition-all group focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-accent transition-colors duration-200">
                  <item.icon size={20} aria-hidden="true" />
                </div>
                <span className="text-xs font-semibold text-primary text-center leading-tight">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
