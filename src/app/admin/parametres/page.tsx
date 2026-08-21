"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, Phone, Mail, MapPin, Share2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/client";

export default function ParametresAdminPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    nom: "",
    description: "",
    telephone1: "",
    telephone2: "",
    email: "",
    adresse: "",
    whatsapp: "",
    facebook: "",
    tiktok: "",
    linkedin: "",
    horaires: "",
    seo_title: "",
    seo_description: ""
  });

  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', true)
      .single();
      
    if (data) {
      setForm({
        nom: data.nom || "",
        description: data.description || "",
        telephone1: data.telephone1 || "",
        telephone2: data.telephone2 || "",
        email: data.email || "",
        adresse: data.adresse || "",
        whatsapp: data.whatsapp || "",
        facebook: data.facebook || "",
        tiktok: data.tiktok || "",
        linkedin: data.linkedin || "",
        horaires: data.horaires || "",
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || ""
      });
    } else if (error && error.code !== 'PGRST116') {
      console.error(error);
    }
    setLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setError(null);
    
    // Pour settings, c'est un singleton avec id = true.
    // L'UPDATE doit se faire avec eq('id', true). S'il n'existe pas, on l'insert.
    // Mais SuperAdmin all settings permet d'écrire.
    const { error: upsertError } = await supabase
      .from('settings')
      .upsert({ id: true, ...form, updated_at: new Date().toISOString() });

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Chargement des paramètres...</div>;
  }

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Paramètres du cabinet"
        description="Gérez les informations générales affichées sur le site"
      />

      <div className="flex-1 p-4 md:p-6 max-w-5xl">
        {saved && (
          <div role="alert" className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
            <AlertCircle size={18} className="text-green-600 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong>Paramètres enregistrés.</strong> Les informations ont été mises à jour avec succès.
            </span>
          </div>
        )}
        
        {error && (
          <div role="alert" className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
            <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong>Erreur :</strong> {error}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Informations générales */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-primary/5 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Informations Générales</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-primary mb-1.5">Nom du cabinet</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-primary mb-1.5">Description courte</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm resize-none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-primary mb-1.5">Horaires d'ouverture</label>
                <textarea
                  rows={2}
                  value={form.horaires}
                  onChange={(e) => handleChange("horaires", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm resize-none"
                  placeholder="Ex: Lundi - Vendredi : 08h00 - 17h30"
                />
              </div>
            </div>
          </section>

          {/* Section: Coordonnées */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-primary/5 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Coordonnées</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5 flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" /> Téléphone principal
                </label>
                <input
                  type="text"
                  value={form.telephone1}
                  onChange={(e) => handleChange("telephone1", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5 flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" /> Téléphone secondaire
                </label>
                <input
                  type="text"
                  value={form.telephone2}
                  onChange={(e) => handleChange("telephone2", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5 flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" /> Adresse Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Lien WhatsApp</label>
                <input
                  type="url"
                  value={form.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-primary mb-1.5 flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400" /> Adresse physique
                </label>
                <input
                  type="text"
                  value={form.adresse}
                  onChange={(e) => handleChange("adresse", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>
          </section>

          {/* Section: Réseaux Sociaux */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-primary/5 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Share2 size={16} className="text-primary" />
              <h2 className="font-bold text-primary text-sm uppercase tracking-wide">Réseaux Sociaux</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Facebook (URL)</label>
                <input
                  type="url"
                  value={form.facebook}
                  onChange={(e) => handleChange("facebook", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">TikTok (URL)</label>
                <input
                  type="url"
                  value={form.tiktok}
                  onChange={(e) => handleChange("tiktok", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">LinkedIn (URL)</label>
                <input
                  type="url"
                  value={form.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-sm"
            >
              <Save size={16} aria-hidden="true" />
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
