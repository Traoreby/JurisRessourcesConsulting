"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, AlertCircle, Calendar } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import Link from "next/link";

export default function ActualitesAdminPage() {
  const [actualites, setActualites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('actualites').select('*').order('date', { ascending: false });
    if (!error && data) {
      setActualites(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      await supabase.from('actualites').delete().eq('id', id);
      fetchActualites();
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Actualités"
        description="Gérez les brèves et publications"
        actions={
          <Link
            href="/admin/actualites/nouveau"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
          >
            <Plus size={16} aria-hidden="true" />
            Nouvelle actualité
          </Link>
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Titre</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Statut</th>
                  <th className="text-right p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={4} className="p-10 text-center text-slate-400">Chargement des actualités...</td></tr>
                ) : actualites.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">
                      Aucune actualité pour le moment.
                    </td>
                  </tr>
                ) : (
                  actualites.map((actu) => (
                    <tr key={actu.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-primary">{actu.titre}</p>
                      </td>
                      <td className="p-4 text-slate-500">{actu.date}</td>
                      <td className="p-4">
                        <StatusBadge statut={actu.statut} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 justify-end">
                          <Link href={`/admin/actualites/${actu.id}`} className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg">
                            <Edit2 size={15} />
                          </Link>
                          <button onClick={() => handleDelete(actu.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
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
