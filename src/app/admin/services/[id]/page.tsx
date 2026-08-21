"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/client";

const STATUTS = [
  { value: "publie", label: "Publié" },
  { value: "brouillon", label: "Brouillon" },
];

const CATEGORIES = ["Juridique", "Comptabilité", "Fiscalité", "RH", "Autre"];

export default function EditServicePage() {
  const params = useParams();
  const id = params?.id as string;
  const supabase = createClient();
  
  const [service, setService] = useState<any>(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    titre: "",
    slug: "",
    description: "",
    icone: "Scale",
    categorie: "Juridique",
    contenu: "",
    prestationsText: "",
    statut: "brouillon",
    ordre: "0",
  });

  useEffect(() => {
    const fetchService = async () => {
      const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
      if (data) {
        setService(data);
        
        let prestationsString = "";
        if (Array.isArray(data.prestations)) {
          prestationsString = data.prestations.join('\n');
        }

        setForm({
          titre: data.titre || "",
          slug: data.slug || "",
          description: data.description || "",
          icone: data.icone || "Scale",
          categorie: data.categorie || "Juridique",
          contenu: data.contenu || "",
          prestationsText: prestationsString,
          statut: data.statut || "brouillon",
          ordre: (data.ordre || 0).toString(),
        });
      }
      setLoadingFetch(false);
    };
    if (id) fetchService();
  }, [id, supabase]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    try {
      const prestations = form.prestationsText
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      const { error: updateError } = await supabase.from('services').update({
        titre: form.titre,
        slug: form.slug,
        description: form.description,
        icone: form.icone,
        categorie: form.categorie,
        contenu: form.contenu,
        prestations: prestations,
        statut: form.statut,
        ordre: parseInt(form.ordre, 10) || 0,
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
          <p className="text-slate-500">Chargement du service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col min-h-full">
        <AdminHeader title="Service introuvable" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-slate-500 mb-4">Ce service n'existe pas ou a été supprimé.</p>
            <Link href="/admin/services" className="text-accent hover:text-primary font-semibold transition-colors">
              ← Retour aux services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Modifier le service"
        description={service.titre}
        actions={
          <Link
            href="/admin/services"
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
              <strong>Succès :</strong> Service mis à jour avec succès.
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
                  <label htmlFor="form-prestations" className="block text-sm font-semibold text-primary mb-1.5">Prestations incluses (Une par ligne)</label>
                  <textarea id="form-prestations" rows={5} value={form.prestationsText} onChange={(e) => handleChange("prestationsText", e.target.value)}
                    placeholder="Création d'entreprises\nRédaction de contrats..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label htmlFor="form-contenu" className="block text-sm font-semibold text-primary mb-1.5">Contenu détaillé (optionnel selon design)</label>
                  <textarea id="form-contenu" rows={10} value={form.contenu} onChange={(e) => handleChange("contenu", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Configuration</h2>
                <div>
                  <label htmlFor="form-categorie" className="block text-sm font-semibold text-primary mb-1.5">Catégorie</label>
                  <select id="form-categorie" value={form.categorie} onChange={(e) => handleChange("categorie", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="form-icone" className="block text-sm font-semibold text-primary mb-1.5">Icône (Lucide React)</label>
                  <input id="form-icone" type="text" value={form.icone} onChange={(e) => handleChange("icone", e.target.value)} required placeholder="Ex: Scale, Calculator, Users"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" />
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
