"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle, Upload, Image as ImageIcon } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_IMAGE_UPLOAD_ACCEPT, uploadAdminImage } from "@/lib/storage/client-upload";
import Image from "next/image";

const STATUTS = [
  { value: "actif", label: "Actif" },
  { value: "inactif", label: "Inactif" },
  { value: "brouillon", label: "Brouillon" },
];

export default function EditPublicitePage() {
  const params = useParams();
  const id = params?.id as string;
  const supabase = createClient();
  const router = useRouter();
  
  const [pub, setPub] = useState<any>(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [titre, setTitre] = useState("");
  const [texte, setTexte] = useState("");
  const [texte_bouton, setTexteBouton] = useState("");
  const [url_bouton, setUrlBouton] = useState("");
  const [date_debut, setDateDebut] = useState("");
  const [date_fin, setDateFin] = useState("");
  const [statut, setStatut] = useState("brouillon");
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    const fetchPub = async () => {
      const { data, error } = await supabase.from('publicites').select('*').eq('id', id).single();
      if (data) {
        setPub(data);
        setTitre(data.titre || "");
        setTexte(data.texte || "");
        setTexteBouton(data.texte_bouton || "");
        setUrlBouton(data.url_bouton || "");
        setDateDebut(data.date_debut ? new Date(data.date_debut).toISOString().substring(0, 10) : "");
        setDateFin(data.date_fin ? new Date(data.date_fin).toISOString().substring(0, 10) : "");
        setStatut(data.statut || "brouillon");
        setPreview(data.image || "");
      }
      setLoadingFetch(false);
    };
    if (id) fetchPub();
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
      let imageUrl = pub.image;
      
      if (file) {
        imageUrl = await uploadAdminImage(file, "publicites");
      }

      const { error: updateError } = await supabase.from('publicites').update({
        titre,
        texte,
        texte_bouton: texte_bouton || null,
        url_bouton: url_bouton || null,
        date_debut: date_debut || null,
        date_fin: date_fin || null,
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

  if (!pub) {
    return (
      <div className="flex flex-col min-h-full">
        <AdminHeader title="Introuvable" />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div><p>Cette publicité n'existe pas.</p><Link href="/admin/publicites">Retour</Link></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Modifier l'annonce"
        description={pub.titre}
        actions={
          <Link
            href="/admin/publicites"
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
            <span><strong>Succès :</strong> Publicité mise à jour avec succès.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Contenu</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Titre</label>
                  <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent outline-none transition-all text-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Texte / Description</label>
                  <textarea rows={4} value={texte} onChange={(e) => setTexte(e.target.value)} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent outline-none transition-all text-sm resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">Texte du bouton (Optionnel)</label>
                    <input type="text" value={texte_bouton} onChange={(e) => setTexteBouton(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">URL du bouton (Optionnel)</label>
                    <input type="url" value={url_bouton} onChange={(e) => setUrlBouton(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 outline-none text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Visuel</h2>
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
                  <input type="file" accept={ADMIN_IMAGE_UPLOAD_ACCEPT} onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Configuration</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Date de début (Optionnel)</label>
                  <input type="date" value={date_debut} onChange={(e) => setDateDebut(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Date de fin (Optionnel)</label>
                  <input type="date" value={date_fin} onChange={(e) => setDateFin(e.target.value)}
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
