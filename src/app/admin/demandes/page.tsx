"use client";

import { useState } from "react";
import { Search, Filter, Eye } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { mockDemandes } from "@/lib/admin/mock-data";
import type { DemandeStatut, DemandeTtype } from "@/types/admin";

const STATUTS: { value: DemandeStatut | "toutes"; label: string }[] = [
  { value: "toutes", label: "Toutes" },
  { value: "nouvelle", label: "Nouvelles" },
  { value: "en_cours", label: "En cours" },
  { value: "traitee", label: "Traitées" },
  { value: "archivee", label: "Archivées" },
];

export default function DemandesAdminPage() {
  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState<DemandeStatut | "toutes">("toutes");
  const [type, setType] = useState<DemandeTtype | "tous">("tous");

  const filtered = mockDemandes.filter((d) => {
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

      <div className="flex-1 p-4 md:p-6 space-y-6">
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
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
              {STATUTS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatut(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
                {filtered.length === 0 ? (
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
                      <td className="p-4 text-slate-500 text-xs">{demande.date}</td>
                      <td className="p-4">
                        <StatusBadge statut={demande.statut} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => alert("Lecture de la demande disponible avec Supabase.")}
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
    </div>
  );
}
