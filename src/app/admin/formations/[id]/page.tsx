"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_IMAGE_UPLOAD_ACCEPT, uploadAdminImage } from "@/lib/storage/client-upload";

const CATEGORIES = ["Ressources Humaines", "Fiscalité", "Juridique", "Management", "Comptabilité", "Autre"];
const STATUTS = [
  { value: "actif", label: "Actif" },
  { value: "inactif", label: "Inactif" },
  { value: "brouillon", label: "Brouillon" },
];

export default function EditFormationPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const supabase = createClient();
  
  const [formation, setFormation] = useState<any>(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    titre: "",
    slug: "",
    description: "",
    duree: "",
    public_cible: "",
    categorie: "Ressources Humaines",
    contenu: "",
    statut: "brouillon",
    ordre: "0",
    image: "",
  });

  useEffect(() => {
    const fetchFormation = async () => {
      const { data, error } = await supabase.from('formations').select('*').eq('id', id).single();
      if (data) {
        setFormation(data);
        setForm({
          titre: data.titre || "",
          slug: data.slug || "",
          description: data.description || "",
          duree: data.duree || "",
          public_cible: data.public_cible || "",
          categorie: data.categorie || "Ressources Humaines",
          contenu: data.contenu || "",
          statut: data.statut || "brouillon",
          ordre: (data.ordre || 0).toString(),
          image: data.image || "",
        });
      }
      setLoadingFetch(false);
    };
    if (id) fetchFormation();
  }, [id, supabase]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    try {
      let imageUrl = form.image;
      
      if (file) {
        imageUrl = await uploadAdminImage(file, "formations");
      }
      
      const { error: updateError } = await supabase.from('formations').update({
        titre: form.titre,
        slug: form.slug,
        description: form.description,
        duree: form.duree,
        public_cible: form.public_cible,
        categorie: form.categorie,
        contenu: form.contenu,
        statut: form.statut,
        ordre: parseInt(form.ordre, 10) || 0,
        image: imageUrl,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      
      if (updateError) {
        if (updateError.code === '23505') {
          throw new Error("Ce slug existe déjà. Veuillez le modifier.");
        }
        throw new Error(updateError.message);
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
      setLoading(false);
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  if (loadingFetch) {
    return (
      <div className="flex flex-col min-h-full">
        <AdminHeader title="Chargement..." />
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-slate-500">Chargement de la formation...</p>
        </div>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="flex flex-col min-h-full">
        <AdminHeader title="Formation introuvable" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-slate-500 mb-4">Cette formation n'existe pas ou a été supprimée.</p>
            <Link href="/admin/formations" className="text-accent hover:text-primary font-semibold transition-colors">
              ← Retour aux formations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Modifier la formation"
        description={formation.titre}
        actions={
          <Link
            href="/admin/formations"
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
        {saved && (
          <div role="alert" className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
            <AlertCircle size={18} className="text-green-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong>Succès :</strong> Formation mise à jour avec succès.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Informations principales</h2>
                <div>
                  <label htmlFor="form-titre" className="block text-sm font-semibold text-primary mb-1.5">Titre</label>
                  <input id="form-titre" type="text" value={form.titre} onChange={(e) => handleChange("titre", e.target.value)} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label htmlFor="form-slug" className="block text-sm font-semibold text-primary mb-1.5">Slug (URL)</label>
                  <input id="form-slug" type="text" value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-500 bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm font-mono" />
                </div>
                <div>
                  <label htmlFor="form-description" className="block text-sm font-semibold text-primary mb-1.5">Description (Résumé)</label>
                  <textarea id="form-description" rows={3} value={form.description} onChange={(e) => handleChange("description", e.target.value)} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm resize-none" />
                </div>
                <div>
                  <label htmlFor="form-contenu" className="block text-sm font-semibold text-primary mb-1.5">Contenu détaillé</label>
                  <textarea id="form-contenu" rows={12} value={form.contenu} onChange={(e) => handleChange("contenu", e.target.value)} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Détails pratiques</h2>
                <div>
                  <label htmlFor="form-duree" className="block text-sm font-semibold text-primary mb-1.5">Durée</label>
                  <input id="form-duree" type="text" value={form.duree} onChange={(e) => handleChange("duree", e.target.value)} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label htmlFor="form-cible" className="block text-sm font-semibold text-primary mb-1.5">Public cible</label>
                  <input id="form-cible" type="text" value={form.public_cible} onChange={(e) => handleChange("public_cible", e.target.value)} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label htmlFor="form-categorie" className="block text-sm font-semibold text-primary mb-1.5">Catégorie</label>
                  <select id="form-categorie" value={form.categorie} onChange={(e) => handleChange("categorie", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="form-statut" className="block text-sm font-semibold text-primary mb-1.5">Statut</label>
                  <select id="form-statut" value={form.statut} onChange={(e) => handleChange("statut", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm">
                    {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="form-ordre" className="block text-sm font-semibold text-primary mb-1.5">Ordre d'affichage</label>
                  <input id="form-ordre" type="number" value={form.ordre} onChange={(e) => handleChange("ordre", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label htmlFor="form-image" className="block text-sm font-semibold text-primary mb-1.5">Image de couverture</label>
                  {form.image && <img src={form.image} alt="Couverture" className="w-full h-32 object-cover rounded-xl mb-3 border border-slate-200" />}
                  <input
                    id="form-image"
                    type="file"
                    accept={ADMIN_IMAGE_UPLOAD_ACCEPT}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/5 file:text-primary hover:file:bg-primary/10"
                  />
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
