"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { mockArticles } from "@/lib/admin/mock-data";

const CATEGORIES = ["Comptabilité", "Fiscalité", "Droit du Travail", "Juridique", "Ressources Humaines", "Actualité"];
const STATUTS = [
  { value: "brouillon", label: "Brouillon" },
  { value: "publie", label: "Publié" },
  { value: "archive", label: "Archivé" },
];

export default function EditArticlePage() {
  const params = useParams();
  const id = params?.id as string;
  const article = mockArticles.find((a) => a.id === id);

  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    titre: article?.titre ?? "",
    slug: article?.slug ?? "",
    extrait: article?.extrait ?? "",
    contenu: article?.contenu ?? "",
    categorie: article?.categorie ?? "Comptabilité",
    auteur: article?.auteur ?? "JRC",
    statut: article?.statut ?? "brouillon",
    image: article?.image ?? "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: supabase.from('articles').update(form).eq('id', id)
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  if (!article) {
    return (
      <div className="flex flex-col min-h-full">
        <AdminHeader title="Article introuvable" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-slate-500 mb-4">Cet article n'existe pas dans les données actuelles.</p>
            <Link href="/admin/articles" className="text-accent hover:text-primary font-semibold transition-colors">
              ← Retour aux articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Modifier l'article"
        description={article.titre}
        actions={
          <Link
            href="/admin/articles"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-primary text-sm font-semibold rounded-lg hover:border-primary transition-all focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Retour
          </Link>
        }
      />

      <div className="flex-1 p-4 md:p-6">
        {saved && (
          <div role="alert" className="mb-6 flex items-start gap-3 bg-accent/10 border border-accent/30 rounded-xl p-4 text-sm text-primary">
            <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong>Modifications simulées.</strong> La connexion à Supabase permettra la sauvegarde réelle.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Contenu</h2>
                <div>
                  <label htmlFor="edit-titre" className="block text-sm font-semibold text-primary mb-1.5">Titre</label>
                  <input id="edit-titre" type="text" value={form.titre} onChange={(e) => handleChange("titre", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label htmlFor="edit-slug" className="block text-sm font-semibold text-primary mb-1.5">Slug</label>
                  <input id="edit-slug" type="text" value={form.slug} onChange={(e) => handleChange("slug", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-500 bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm font-mono" />
                </div>
                <div>
                  <label htmlFor="edit-extrait" className="block text-sm font-semibold text-primary mb-1.5">Extrait</label>
                  <textarea id="edit-extrait" rows={3} value={form.extrait} onChange={(e) => handleChange("extrait", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm resize-none" />
                </div>
                <div>
                  <label htmlFor="edit-contenu" className="block text-sm font-semibold text-primary mb-1.5">Contenu</label>
                  <textarea id="edit-contenu" rows={12} value={form.contenu} onChange={(e) => handleChange("contenu", e.target.value)}
                    placeholder="Contenu complet de l'article..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Publication</h2>
                <div>
                  <label htmlFor="edit-statut" className="block text-sm font-semibold text-primary mb-1.5">Statut</label>
                  <select id="edit-statut" value={form.statut} onChange={(e) => handleChange("statut", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm">
                    {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-categorie" className="block text-sm font-semibold text-primary mb-1.5">Catégorie</label>
                  <select id="edit-categorie" value={form.categorie} onChange={(e) => handleChange("categorie", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-auteur" className="block text-sm font-semibold text-primary mb-1.5">Auteur</label>
                  <input id="edit-auteur" type="text" value={form.auteur} onChange={(e) => handleChange("auteur", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" />
                </div>
              </div>

              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-sm">
                <Save size={16} aria-hidden="true" />
                Sauvegarder
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
