"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

// Partner list is empty as requested (no fake partners).
const mockPartenaires: any[] = [];

export default function PartenariatsAdminPage() {
  const [notice, setNotice] = useState(false);
  const showNotice = () => {
    setNotice(true);
    setTimeout(() => setNotice(false), 4000);
  };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Partenariats"
        description="Gérez vos partenaires et collaborations"
        actions={
          <button
            onClick={showNotice}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
          >
            <Plus size={16} aria-hidden="true" />
            Nouveau partenaire
          </button>
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        {notice && (
          <div role="alert" className="flex items-start gap-3 bg-accent/10 border border-accent/30 rounded-xl p-4 text-sm text-primary">
            <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <span><strong>Fonctionnalité disponible après connexion à Supabase.</strong></span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Ordre</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Partenaire</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Statut</th>
                  <th className="text-right p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockPartenaires.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">
                      Aucun partenaire pour le moment.
                    </td>
                  </tr>
                ) : (
                  mockPartenaires.map((partenaire) => (
                    <tr key={partenaire.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <button onClick={showNotice} className="text-slate-300 hover:text-primary transition-colors">
                            <ArrowUp size={14} />
                          </button>
                          <span className="text-xs text-slate-400 text-center">{partenaire.ordre}</span>
                          <button onClick={showNotice} className="text-slate-300 hover:text-primary transition-colors">
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-primary">{partenaire.nom}</p>
                      </td>
                      <td className="p-4">
                        <StatusBadge statut={partenaire.statut} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={showNotice} className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={showNotice} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
