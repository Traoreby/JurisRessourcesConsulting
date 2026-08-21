"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, Upload, Image as ImageIcon } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

const STATUTS = [
  { value: "actif", label: "Actif" },
  { value: "inactif", label: "Inactif" },
];

export default function NouveauPartenairePage() {
  const supabase = createClient();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [siteWeb, setSiteWeb] = useState("");
  const [statut, setStatut] = useState("actif");
  const [ordre, setOrdre] = useState("0");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

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
      let logoUrl = "";
      
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `partners/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('public-assets')
          .upload(filePath, file);
          
        if (uploadError) throw new Error("Erreur lors de l'upload du logo: " + uploadError.message);
        
        const { data } = supabase.storage.from('public-assets').getPublicUrl(filePath);
        logoUrl = data.publicUrl;
      }
        
      const { error: insertError } = await supabase.from('partners').insert({
        nom,
        description,
        site_web: siteWeb,
        logo: logoUrl || null,
        statut,
        ordre: parseInt(ordre, 10) || 0
      });
      
      if (insertError) throw new Error(insertError.message);
      
      router.push('/admin/partenariats');
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Nouveau Partenaire"
        description="Ajouter un partenaire ou une collaboration"
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
                    <span className="text-sm font-semibold">Choisir une image</span>
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
