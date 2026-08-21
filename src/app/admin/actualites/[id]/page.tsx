"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle, Upload, Image as ImageIcon } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

const CATEGORIES = ["Corporate", "Événements", "Mises à jour", "Presse"];
const STATUTS = [
  { value: "publie", label: "Publié" },
  { value: "brouillon", label: "Brouillon" },
];

export default function EditActualitePage() {
  const params = useParams();
  const id = params?.id as string;
  const supabase = createClient();
  const router = useRouter();
  
  const [actualite, setActualite] = useState<any>(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [titre, setTitre] = useState("");
  const [slug, setSlug] = useState("");
  const [extrait, setExtrait] = useState("");
  const [auteur, setAuteur] = useState("");
  const [contenu, setContenu] = useState("");
  const [categorie, setCategorie] = useState(CATEGORIES[0]);
  const [date, setDate] = useState("");
  const [statut, setStatut] = useState("brouillon");
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    const fetchActualite = async () => {
      const { data, error } = await supabase.from('actualites').select('*').eq('id', id).single();
      if (data) {
        setActualite(data);
        setTitre(data.titre || "");
        setSlug(data.slug || "");
        setExtrait(data.extrait || "");
        setAuteur(data.auteur || "");
        setContenu(data.contenu || "");
        setCategorie(data.categorie || CATEGORIES[0]);
        setDate(data.date ? new Date(data.date).toISOString().substring(0, 10) : "");
        setStatut(data.statut || "brouillon");
        setPreview(data.image || "");
      }
      setLoadingFetch(false);
    };
    if (id) fetchActualite();
  }, [id, supabase]);

  const handleTitreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitre = e.target.value;
    setTitre(newTitre);
    setSlug(
      newTitre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    try {
      let imageUrl = actualite.image;
      
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `actualites/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('public-assets')
          .upload(filePath, file);
          
        if (uploadError) throw new Error("Erreur upload: " + uploadError.message);
        
        const { data } = supabase.storage.from('public-assets').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      const { error: updateError } = await supabase.from('actualites').update({
        titre,
        slug,
        extrait,
        auteur,
        contenu,
        categorie,
        date,
        image: imageUrl || null,
        statut,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      
      if (updateError) throw new Error(updateError.message);
      
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
        <div className="flex-1 flex items-center justify-center p-6"><p>Chargement...</p></div>
      </div>
    );
  }

  if (!actualite) {
    return (
      <div className="flex flex-col min-h-full">
        <AdminHeader title="Introuvable" />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div><p>Cette actualité n'existe pas.</p><Link href="/admin/actualites">Retour</Link></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Modifier l'actualité"
        description={actualite.titre}
        actions={
          <Link
            href="/admin/actualites"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-primary text-sm font-semibold rounded-lg hover:border-primary transition-all"
          >
            <ArrowLeft size={15} />
            Retour
          </Link>
        }
      />

      <div className="flex-1 p-4 md:p-6">
        {errorMsg && (
          <div role="alert" className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <span><strong>Erreur :</strong> {errorMsg}</span>
          </div>
        )}
        {saved && (
          <div role="alert" className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
            <AlertCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
            <span><strong>Succès :</strong> Actualité mise à jour avec succès.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Contenu</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Titre</label>
                  <input type="text" value={titre} onChange={handleTitreChange} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent outline-none transition-all text-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">URL (Slug)</label>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-500 bg-slate-100 outline-none transition-all text-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Auteur</label>
                  <input type="text" value={auteur} onChange={(e) => setAuteur(e.target.value)} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent outline-none transition-all text-sm mb-5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Extrait (résumé)</label>
                  <textarea rows={3} value={extrait} onChange={(e) => setExtrait(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent outline-none transition-all text-sm resize-none mb-5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Contenu</label>
                  <textarea rows={8} value={contenu} onChange={(e) => setContenu(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent outline-none transition-all text-sm resize-none" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Image principale</h2>
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 relative group">
                  {preview ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100">
                      <Image src={preview} alt="Aperçu" fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon size={40} className="mb-3 opacity-50" />
                      <span className="text-sm">Aucune image</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Configuration</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Catégorie</label>
                  <select value={categorie} onChange={(e) => setCategorie(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-sm">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Statut</label>
                  <select value={statut} onChange={(e) => setStatut(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-sm">
                    {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-md text-sm disabled:opacity-50"
              >
                <Save size={16} />
                {loading ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
