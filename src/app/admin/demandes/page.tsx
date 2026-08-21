"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, AlertCircle, X, Mail, Phone, Calendar as CalendarIcon, Tag, Briefcase, User } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { createClient } from "@/lib/supabase/client";
import type { DemandeStatut, DemandeTtype, Demande } from "@/types/admin";

const STATUTS: { value: DemandeStatut | "toutes"; label: string }[] = [
  { value: "toutes", label: "Toutes" },
  { value: "nouvelle", label: "Nouvelles" },
  { value: "en_cours", label: "En cours" },
  { value: "traitee", label: "Traitées" },
  { value: "archivee", label: "Archivées" },
];

export default function DemandesAdminPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState<DemandeStatut | "toutes">("toutes");
  const [type, setType] = useState<DemandeTtype | "tous">("tous");
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('demandes')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) {
      setDemandes(data);
    }
    setLoading(false);
  };

  const updateStatut = async (id: string, newStatut: DemandeStatut) => {
    const { error } = await supabase
      .from('demandes')
      .update({ statut: newStatut, updated_at: new Date().toISOString() })
      .eq('id', id);
      
    if (!error) {
      fetchDemandes();
      if (selectedDemande && selectedDemande.id === id) {
        setSelectedDemande({ ...selectedDemande, statut: newStatut });
      }
    } else {
      alert("Erreur lors de la mise à jour: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      const { error } = await supabase.from('demandes').delete().eq('id', id);
      if (!error) {
        setSelectedDemande(null);
        fetchDemandes();
      } else {
        alert("Erreur lors de la suppression: " + error.message);
      }
    }
  };

  const filtered = demandes.filter((d) => {
    const matchSearch =
      d.nom.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      (d.objet ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatut = statut === "toutes" || d.statut === statut;
    const matchType = type === "tous" || d.type === type;
    return matchSearch && matchStatut && matchType;
  });

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Demandes & Contacts"
        description="Gérez les formulaires de contact et demandes de consultation"
      />

      <div className="flex-1 p-4 md:p-6 space-y-6 relative">
        <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Rechercher nom, email, objet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm text-primary placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="py-2 pl-3 pr-8 border border-slate-200 rounded-xl text-sm text-primary bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              >
                <option value="tous">Tous les types</option>
                <option value="contact">Contact général</option>
                <option value="consultation">Consultation</option>
              </select>
            </div>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl overflow-x-auto">
              {STATUTS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatut(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    statut === s.value
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-500 hover:text-primary"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Expéditeur</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Type / Objet</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Statut</th>
                  <th className="text-right p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400 text-sm">Chargement...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 text-sm">
                      Aucune demande trouvée.
                    </td>
                  </tr>
                ) : (
                  filtered.map((demande) => (
                    <tr key={demande.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-primary">{demande.nom}</p>
                        <p className="text-xs text-slate-500">{demande.email}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          demande.type === 'consultation' ? 'bg-accent/10 text-accent' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {demande.type}
                        </span>
                        <p className="text-primary truncate max-w-xs">{demande.objet ?? demande.service ?? "Sans objet"}</p>
                      </td>
                      <td className="p-4 text-slate-500 text-xs">{new Date(demande.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <StatusBadge statut={demande.statut} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => setSelectedDemande(demande)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                            aria-label="Voir la demande"
                          >
                            <Eye size={16} aria-hidden="true" />
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
              {filtered.length} demande{filtered.length > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Modal Vue détaillée */}
      {selectedDemande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-primary flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-md text-xs uppercase tracking-wider ${
                  selectedDemande.type === 'consultation' ? 'bg-accent/10 text-accent' : 'bg-slate-200 text-slate-600'
                }`}>
                  {selectedDemande.type}
                </span>
                Détails de la demande
              </h2>
              <button 
                onClick={() => setSelectedDemande(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5"><User size={12} className="inline" /> Nom</p>
                  <p className="text-sm font-medium text-primary">{selectedDemande.nom}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5"><Mail size={12} className="inline" /> Email</p>
                  <a href={`mailto:${selectedDemande.email}`} className="text-sm font-medium text-accent hover:underline">{selectedDemande.email}</a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5"><Phone size={12} className="inline" /> Téléphone</p>
                  <p className="text-sm font-medium text-primary">{selectedDemande.telephone || 'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5"><CalendarIcon size={12} className="inline" /> Date</p>
                  <p className="text-sm font-medium text-primary">{new Date(selectedDemande.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5"><Tag size={12} className="inline" /> Objet / Service</p>
                <p className="text-base font-bold text-primary">{selectedDemande.objet ?? selectedDemande.service ?? 'Sans objet'}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5"><Briefcase size={12} className="inline" /> Message</p>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedDemande.message}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">Modifier le statut :</span>
                <select
                  value={selectedDemande.statut}
                  onChange={(e) => updateStatut(selectedDemande.id, e.target.value as DemandeStatut)}
                  className="py-2 pl-3 pr-8 border border-slate-200 rounded-xl text-sm font-medium text-primary bg-white outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  <option value="nouvelle">Nouvelle</option>
                  <option value="en_cours">En cours</option>
                  <option value="traitee">Traitée</option>
                  <option value="archivee">Archivée</option>
                </select>
              </div>
              
              <button
                onClick={() => handleDelete(selectedDemande.id)}
                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
