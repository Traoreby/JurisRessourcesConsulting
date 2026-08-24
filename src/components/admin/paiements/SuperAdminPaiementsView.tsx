"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Clock, Plus, Search, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { validerPaiement } from "@/app/actions/paiements";
import { GenererEcheanceModal } from "./GenererEcheanceModal";

interface Profile {
  id: string;
  full_name: string;
  email: string;
}

interface Paiement {
  id: string;
  admin_id: string;
  periode: string;
  montant: number;
  devise: string;
  date_echeance: string;
  date_paiement: string | null;
  statut: "a_payer" | "en_attente" | "paye";
  reference_wave: string | null;
  date_validation: string | null;
  profiles: {
    full_name: string;
    email: string;
  } | null;
}

export function SuperAdminPaiementsView({ currentUserId, waveNumber }: { currentUserId: string; waveNumber: string }) {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [admins, setAdmins] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("tous");
  const [isGenererModalOpen, setIsGenererModalOpen] = useState(false);
  const [validatingId, setValidatingId] = useState<string | null>(null);

  const supabase = createClient();

  const loadData = async () => {
    setIsLoading(true);
    
    // Fetch Admins
    const { data: adminsData } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "ADMIN");
      
    if (adminsData) setAdmins(adminsData);

    // Fetch Paiements
    const { data: paiementsData, error } = await supabase
      .from("paiements")
      .select(`
        *,
        profiles:admin_id (
          full_name,
          email
        )
      `)
      .order("date_echeance", { ascending: false });

    if (error) {
      alert("Erreur lors du chargement des paiements");
    } else {
      setPaiements(paiementsData as any[]);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleValider = async (paiementId: string) => {
    if (!confirm("Confirmer la validation de ce paiement ?")) return;
    
    setValidatingId(paiementId);
    try {
      await validerPaiement(paiementId);
      alert("Paiement validé avec succès");
      await loadData();
    } catch (err: any) {
      alert(err.message || "Erreur de validation");
    } finally {
      setValidatingId(null);
    }
  };

  const now = new Date();

  const filteredPaiements = paiements.filter(p => {
    if (filter === "tous") return true;
    if (filter === "en_retard") return p.statut === "a_payer" && new Date(p.date_echeance) < now;
    return p.statut === filter;
  });

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion des Paiements</h1>
          <p className="text-slate-500">Suivez et validez les paiements des administrateurs.</p>
        </div>
        <button
          onClick={() => setIsGenererModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Générer une échéance
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2">
          {["tous", "en_attente", "a_payer", "en_retard", "paye"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f 
                  ? "bg-slate-800 text-white" 
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {f === "tous" && "Tous"}
              {f === "en_attente" && "En attente"}
              {f === "a_payer" && "À payer"}
              {f === "en_retard" && "En retard"}
              {f === "paye" && "Payé"}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-6">Administrateur</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-6">Période</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-6">Montant</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-6">Échéance</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-6">Réf. Wave</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-6">Statut</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Chargement des paiements...
                  </td>
                </tr>
              ) : filteredPaiements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Aucun paiement trouvé
                  </td>
                </tr>
              ) : (
                filteredPaiements.map((p) => {
                  const isLate = p.statut === "a_payer" && new Date(p.date_echeance) < now;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-6">
                        <div className="text-sm font-bold text-slate-900">{p.profiles?.full_name || "Utilisateur supprimé"}</div>
                        <div className="text-xs text-slate-500">{p.profiles?.email}</div>
                      </td>
                      <td className="py-3 px-6 text-sm font-medium text-slate-900">{p.periode}</td>
                      <td className="py-3 px-6 text-sm text-slate-600 text-right whitespace-nowrap">
                        {p.montant.toLocaleString('fr-FR')} {p.devise}
                      </td>
                      <td className="py-3 px-6 text-sm text-slate-600 whitespace-nowrap">
                        {new Date(p.date_echeance).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3 px-6 text-sm text-slate-600 font-mono">
                        {p.reference_wave || "—"}
                        {p.date_paiement && (
                          <div className="text-xs text-slate-400 mt-0.5">
                            le {new Date(p.date_paiement).toLocaleDateString("fr-FR")}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-6 text-sm">
                        {p.statut === "paye" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            <CheckCircle className="w-3.5 h-3.5" /> Payé
                          </span>
                        ) : p.statut === "en_attente" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <Clock className="w-3.5 h-3.5" /> En attente
                          </span>
                        ) : isLate ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <AlertTriangle className="w-3.5 h-3.5" /> En retard
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            À payer
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-right">
                        {p.statut === "en_attente" && (
                          <button
                            onClick={() => handleValider(p.id)}
                            disabled={validatingId === p.id}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-sm font-bold rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                          >
                            {validatingId === p.id ? "..." : <><Check className="w-4 h-4" /> Valider</>}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isGenererModalOpen && (
        <GenererEcheanceModal
          admins={admins}
          onClose={() => setIsGenererModalOpen(false)}
          onSuccess={() => {
            setIsGenererModalOpen(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
