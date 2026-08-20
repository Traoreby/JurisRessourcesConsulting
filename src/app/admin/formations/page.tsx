"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, AlertCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { mockFormations } from "@/lib/admin/mock-data";

export default function FormationsAdminPage() {
  const [notice, setNotice] = useState(false);

  const showNotice = () => {
    setNotice(true);
    setTimeout(() => setNotice(false), 4000);
  };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Formations"
        description="Gérez le catalogue de formations"
        actions={
          <button
            onClick={showNotice}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
          >
            <Plus size={16} aria-hidden="true" />
            Nouvelle formation
          </button>
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        {notice && (
          <div role="alert" className="flex items-start gap-3 bg-accent/10 border border-accent/30 rounded-xl p-4 text-sm text-primary">
            <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <span><strong>Création disponible après connexion à Supabase.</strong></span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {mockFormations.map((formation) => (
            <div key={formation.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-primary/5 px-5 py-4 border-b border-slate-100">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-primary text-sm leading-snug flex-1">{formation.titre}</h3>
                  <StatusBadge statut={formation.statut} />
                </div>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{formation.description}</p>
                <div className="flex gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">⏱ {formation.duree}</span>
                  <span className="flex items-center gap-1">👥 {formation.publicCible}</span>
                </div>
              </div>
              <div className="px-5 pb-5 flex gap-2">
                <button
                  onClick={showNotice}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-primary border border-slate-200 rounded-lg hover:border-primary hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label={`Modifier ${formation.titre}`}
                >
                  <Edit2 size={14} aria-hidden="true" />
                  Modifier
                </button>
                <button
                  onClick={showNotice}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                  aria-label={`Supprimer ${formation.titre}`}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
