"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import Link from "next/link";

export default function FormationsAdminPage() {
  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('formations').select('*').order('ordre', { ascending: true });
    if (!error && data) {
      setFormations(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      await supabase.from('formations').delete().eq('id', id);
      fetchFormations();
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Formations"
        description="Gérez le catalogue de formations"
        actions={
          <Link
            href="/admin/formations/nouveau"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
          >
            <Plus size={16} aria-hidden="true" />
            Nouvelle formation
          </Link>
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-full py-10 text-center text-slate-400">Chargement des formations...</div>
          ) : formations.length === 0 ? (
            <div className="col-span-full py-10 text-center text-slate-400">Aucune formation trouvée.</div>
          ) : formations.map((formation) => (
            <div key={formation.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-primary/5 px-5 py-4 border-b border-slate-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-primary text-sm leading-snug">{formation.titre}</h3>
                    <span className="text-[10px] uppercase font-bold text-accent tracking-wider mt-1 block">{formation.categorie || 'Non catégorisé'}</span>
                  </div>
                  <StatusBadge statut={formation.statut} />
                </div>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{formation.description}</p>
                <div className="flex gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">⏱ {formation.duree}</span>
                  <span className="flex items-center gap-1">👥 {formation.public_cible}</span>
                </div>
              </div>
              <div className="px-5 pb-5 flex gap-2">
                <Link
                  href={`/admin/formations/${formation.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-primary border border-slate-200 rounded-lg hover:border-primary hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label={`Modifier ${formation.titre}`}
                >
                  <Edit2 size={14} aria-hidden="true" />
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(formation.id)}
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
