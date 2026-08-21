"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, AlertCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import Link from "next/link";

export default function PublicitesAdminPage() {
  const [publicites, setPublicites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchPublicites();
  }, []);

  const fetchPublicites = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('publicites').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setPublicites(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      await supabase.from('publicites').delete().eq('id', id);
      fetchPublicites();
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Annonces & Publicités"
        description="Gérez les promotions et annonces sur le site"
        actions={
          <Link
            href="/admin/publicites/nouveau"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
          >
            <Plus size={16} aria-hidden="true" />
            Nouvelle annonce
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
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Période</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Statut</th>
                  <th className="text-right p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={4} className="p-10 text-center text-slate-400">Chargement des annonces...</td></tr>
                ) : publicites.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">
                      Aucune annonce active.
                    </td>
                  </tr>
                ) : (
                  publicites.map((pub) => (
                    <tr key={pub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-primary">{pub.titre}</p>
                      </td>
                      <td className="p-4 text-slate-500">
                        {pub.dateDebut} - {pub.dateFin}
                      </td>
                      <td className="p-4">
                        <StatusBadge statut={pub.statut} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 justify-end">
                          <Link href={`/admin/publicites/${pub.id}`} className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg">
                            <Edit2 size={15} />
                          </Link>
                          <button onClick={() => handleDelete(pub.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
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
