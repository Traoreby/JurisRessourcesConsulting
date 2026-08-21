"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import Link from "next/link";

export default function ServicesAdminPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('services').select('*').order('ordre', { ascending: true });
    if (!error && data) {
      setServices(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      await supabase.from('services').delete().eq('id', id);
      fetchServices();
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Services"
        description="Gérez les services proposés par le cabinet"
        actions={
          <Link
            href="/admin/services/nouveau"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
          >
            <Plus size={16} aria-hidden="true" />
            Nouveau service
          </Link>
        }
      />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Ordre</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Service</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden md:table-cell">Catégorie</th>
                  <th className="text-left p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Statut</th>
                  <th className="text-right p-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-400">Chargement des services...</td></tr>
                ) : services.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-400">Aucun service trouvé.</td></tr>
                ) : services.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <button  className="text-slate-300 hover:text-primary transition-colors" aria-label="Monter">
                          <ArrowUp size={14} />
                        </button>
                        <span className="text-xs text-slate-400 text-center">{service.ordre}</span>
                        <button  className="text-slate-300 hover:text-primary transition-colors" aria-label="Descendre">
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-primary">{service.titre}</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{service.description}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="px-2.5 py-1 bg-primary/5 text-primary rounded-lg text-xs font-medium">
                        {service.categorie}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge statut={service.statut} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          href={`/admin/services/${service.id}`}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                          aria-label={`Modifier ${service.titre}`}
                        >
                          <Edit2 size={15} aria-hidden="true" />
                        </Link>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                          aria-label={`Supprimer ${service.titre}`}
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
