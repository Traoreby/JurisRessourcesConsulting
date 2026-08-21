"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle, Upload, Image as ImageIcon } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

const STATUTS = [
  { value: "actif", label: "Actif" },
  { value: "inactif", label: "Inactif" },
];

export default function EditPartenairePage() {
  const params = useParams();
  const id = params?.id as string;
  const supabase = createClient();
  
  const [partner, setPartner] = useState<any>(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [siteWeb, setSiteWeb] = useState("");
  const [statut, setStatut] = useState("actif");
  const [ordre, setOrdre] = useState("0");
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    const fetchPartner = async () => {
      const { data, error } = await supabase.from('partners').select('*').eq('id', id).single();
      if (data) {
        setPartner(data);
        setNom(data.nom || "");
        setDescription(data.description || "");
        setSiteWeb(data.site_web || "");
        setStatut(data.statut || "inactif");
        setOrdre((data.ordre || 0).toString());
        setPreview(data.logo || "");
      }
      setLoadingFetch(false);
    };
    if (id) fetchPartner();
  }, [id, supabase]);

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
      let logoUrl = partner.logo;
      
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `partners/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('public-assets')
          .upload(filePath, file);
          
        if (uploadError) throw new Error("Erreur lors de l'upload: " + uploadError.message);
        
        const { data } = supabase.storage.from('public-assets').getPublicUrl(filePath);
        logoUrl = data.publicUrl;
      }

      const { error: updateError } = await supabase.from('partners').update({
        nom,
        description,
        site_web: siteWeb,
        logo: logoUrl || null,
        statut,
        ordre: parseInt(ordre, 10) || 0,
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
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-slate-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex flex-col min-h-full">
        <AdminHeader title="Introuvable" />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <p className="text-slate-500 mb-4">Ce partenaire n'existe pas ou a été supprimé.</p>
            <Link href="/admin/partenariats" className="text-accent font-semibold">← Retour</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Modifier le partenaire"
        description={partner.nom}
        actions={
          <Link
            href="/admin/partenariats"
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
            <span><strong>Erreur :</strong> {errorMsg}</span>
          </div>
        )}
        {saved && (
          <div role="alert" className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
            <AlertCircle size={18} className="text-green-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span><strong>Succès :</strong> Partenaire mis à jour avec succès.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Informations</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Nom du partenaire</label>
                  <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Site Web</label>
                  <input type="url" value={siteWeb} onChange={(e) => setSiteWeb(e.target.value)} placeholder="https://..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Description (Optionnelle)</label>
                  <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm resize-none" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Logo</h2>
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 relative group">
                  {preview ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white flex items-center justify-center">
                      <Image src={preview} alt="Aperçu du logo" fill className="object-contain p-2" unoptimized />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon size={40} className="mb-3 opacity-50" />
                      <span className="text-sm">Aucun logo sélectionné</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="absolute inset-0 bg-primary/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl">
                    <Upload size={24} className="mb-2" />
                    <span className="text-sm font-semibold">Changer l'image</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Configuration</h2>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Statut</label>
                  <select value={statut} onChange={(e) => setStatut(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm">
                    {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Ordre d'affichage</label>
                  <input type="number" value={ordre} onChange={(e) => setOrdre(e.target.value)}
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
