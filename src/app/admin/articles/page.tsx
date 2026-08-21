"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { ArticleStatut } from "@/types/admin";

const STATUTS: { value: ArticleStatut | "tous"; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "publie", label: "Publiés" },
  { value: "brouillon", label: "Brouillons" },
  { value: "archive", label: "Archivés" },
];

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState<ArticleStatut | "tous">("tous");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setArticles(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      await supabase.from('articles').delete().eq('id', id);
      fetchArticles();
    }
  };

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.titre.toLowerCase().includes(search.toLowerCase()) ||
      a.categorie.toLowerCase().includes(search.toLowerCase());
    const matchStatut = statut === "tous" || a.statut === statut;
    return matchSearch && matchStatut;
  });

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Articles"
        description="Gérez les articles du blog"
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

      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Rechercher un article..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-primary placeholder:text-slate-400 bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUTS.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatut(s.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
                  statut === s.value
                    ? "bg-primary text-white"
                    : "bg-white border border-slate-200 text-primary hover:border-primary"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Titre</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden md:table-cell">Catégorie</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden lg:table-cell">Date</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Statut</th>
                  <th className="text-right p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 text-sm">
                      Chargement des articles...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 text-sm">
                      Aucun article trouvé.
                    </td>
                  </tr>
                ) : (
                  filtered.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-primary truncate max-w-xs">{article.titre}</p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{article.extrait}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="px-2.5 py-1 bg-primary/5 text-primary rounded-lg text-xs font-medium">
                          {article.categorie}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-xs hidden lg:table-cell">
                        {new Date(article.updated_at || article.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="p-4">
                        <StatusBadge statut={article.statut} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 justify-end">
                          <Link
                            href={`/admin/articles/${article.id}`}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                            aria-label={`Modifier ${article.titre}`}
                          >
                            <Edit2 size={15} aria-hidden="true" />
                          </Link>
                          <button
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                            aria-label={`Supprimer ${article.titre}`}
                            onClick={() => handleDelete(article.id)}
                          >
                            <Trash2 size={15} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="p-4 border-t border-slate-100 text-xs text-slate-400">
              {filtered.length} article{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
