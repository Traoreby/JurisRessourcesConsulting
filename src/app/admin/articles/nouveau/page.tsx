"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Comptabilité", "Fiscalité", "Droit du Travail", "Juridique", "Ressources Humaines", "Actualité"];
const STATUTS = [
  { value: "brouillon", label: "Brouillon" },
  { value: "publie", label: "Publié" },
  { value: "archive", label: "Archivé" },
];

export default function NouvelArticlePage() {
  const supabase = createClient();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titre: "",
    slug: "",
    extrait: "",
    contenu: "",
    categorie: "Comptabilité",
    auteur: "JRC",
    statut: "brouillon",
    image: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "titre") {
      setForm((prev) => ({
        ...prev,
        titre: value,
        slug: value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-"),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    try {
      let imageUrl = form.image;
      
      // Upload image if file is selected
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `articles/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('public-assets')
          .upload(filePath, file);
          
        if (uploadError) throw new Error("Erreur lors de l'upload de l'image");
        
        const { data: { publicUrl } } = supabase.storage
          .from('public-assets')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }
      
      const { error: insertError } = await supabase.from('articles').insert({
        titre: form.titre,
        slug: form.slug,
        extrait: form.extrait,
        contenu: form.contenu,
        categorie: form.categorie,
        auteur: form.auteur,
        statut: form.statut,
        image: imageUrl
      });
      
      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error("Ce slug existe déjà. Veuillez le modifier.");
        }
        throw new Error(insertError.message);
      }
      
      router.push('/admin/articles');
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Nouvel article"
        description="Créez un nouvel article pour le blog"
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
        {errorMsg && (
          <div role="alert" className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong>Erreur :</strong> {errorMsg}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Contenu</h2>

                <div>
                  <label htmlFor="art-titre" className="block text-sm font-semibold text-primary mb-1.5">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="art-titre"
                    type="text"
                    value={form.titre}
                    onChange={(e) => handleChange("titre", e.target.value)}
                    placeholder="Titre de l'article"
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="art-slug" className="block text-sm font-semibold text-primary mb-1.5">
                    Slug (URL)
                  </label>
                  <input
                    id="art-slug"
                    type="text"
                    value={form.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="slug-de-l-article"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-500 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="art-extrait" className="block text-sm font-semibold text-primary mb-1.5">
                    Extrait
                  </label>
                  <textarea
                    id="art-extrait"
                    rows={3}
                    value={form.extrait}
                    onChange={(e) => handleChange("extrait", e.target.value)}
                    placeholder="Résumé court de l'article (affiché sur la liste du blog)..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="art-contenu" className="block text-sm font-semibold text-primary mb-1.5">
                    Contenu
                  </label>
                  <textarea
                    id="art-contenu"
                    rows={12}
                    value={form.contenu}
                    onChange={(e) => handleChange("contenu", e.target.value)}
                    placeholder="Contenu complet de l'article... Un éditeur riche (ex: TipTap) pourra être intégré ici."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  />
                  <p className="text-xs text-slate-400 mt-1">Un éditeur riche (TipTap, Quill...) sera intégré ici lors de la phase suivante.</p>
                </div>
              </div>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Publication</h2>

                <div>
                  <label htmlFor="art-statut" className="block text-sm font-semibold text-primary mb-1.5">
                    Statut
                  </label>
                  <select
                    id="art-statut"
                    value={form.statut}
                    onChange={(e) => handleChange("statut", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  >
                    {STATUTS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="art-categorie" className="block text-sm font-semibold text-primary mb-1.5">
                    Catégorie
                  </label>
                  <select
                    id="art-categorie"
                    value={form.categorie}
                    onChange={(e) => handleChange("categorie", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="art-auteur" className="block text-sm font-semibold text-primary mb-1.5">
                    Auteur
                  </label>
                  <input
                    id="art-auteur"
                    type="text"
                    value={form.auteur}
                    onChange={(e) => handleChange("auteur", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="art-image" className="block text-sm font-semibold text-primary mb-1.5">
                    Image (URL)
                  </label>
                  <input
                    id="art-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/5 file:text-primary hover:file:bg-primary/10"
                  />
                  <p className="text-xs text-slate-400 mt-1">Sélectionnez une image à uploader sur Supabase Storage.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-sm disabled:opacity-50"
              >
                <Save size={16} aria-hidden="true" />
                {loading ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
