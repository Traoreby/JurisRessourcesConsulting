import { createClient } from "@/lib/supabase/server";
import { AlertTriangle, CheckCircle, Clock, Wallet } from "lucide-react";
import { DeclarerPaiementButton } from "./DeclarerPaiementButton";

interface Paiement {
  id: string;
  periode: string;
  montant: number;
  devise: string;
  date_echeance: string;
  date_paiement: string | null;
  statut: "a_payer" | "en_attente" | "paye";
  reference_wave: string | null;
}

export async function AdminPaiementsView({ currentUserId, waveNumber }: { currentUserId: string; waveNumber: string }) {
  const supabase = await createClient();
  const { data: paiements, error } = await supabase
    .from("paiements")
    .select("*")
    .eq("admin_id", currentUserId)
    .order("date_echeance", { ascending: false });

  if (error) {
    return <div className="p-6 text-red-500">Erreur de chargement : {error.message}</div>;
  }

  const paiementsList = (paiements || []) as Paiement[];
  const now = new Date();

  // On détermine l'échéance actuelle (le premier à payer ou en attente)
  const echeanceActuelle = paiementsList.find(p => p.statut === "a_payer" || p.statut === "en_attente");

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Mes Paiements</h1>
        <p className="text-slate-500">Consultez votre historique et vos échéances.</p>
      </div>

      {echeanceActuelle && (
        <div className={`p-6 rounded-2xl border-l-4 shadow-sm ${
          echeanceActuelle.statut === "en_attente" 
            ? "bg-amber-50 border-amber-500"
            : (new Date(echeanceActuelle.date_echeance) < now)
              ? "bg-red-50 border-red-500" 
              : "bg-blue-50 border-blue-500"
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Paiement pour : {echeanceActuelle.periode}
              </h2>
              <p className="text-slate-600 mt-1">
                Montant : <span className="font-bold">{echeanceActuelle.montant.toLocaleString('fr-FR')} {echeanceActuelle.devise}</span>
              </p>
              <p className="text-slate-600">
                Échéance : {new Date(echeanceActuelle.date_echeance).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
              
              <div className="mt-3">
                {echeanceActuelle.statut === "en_attente" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    <Clock className="w-3.5 h-3.5" /> En attente de validation
                  </span>
                ) : new Date(echeanceActuelle.date_echeance) < now ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    <AlertTriangle className="w-3.5 h-3.5" /> En retard
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <Wallet className="w-3.5 h-3.5" /> À payer
                  </span>
                )}
              </div>
            </div>
            
            {echeanceActuelle.statut === "a_payer" && (
              <DeclarerPaiementButton 
                paiementId={echeanceActuelle.id}
                montant={echeanceActuelle.montant}
                devise={echeanceActuelle.devise}
                periode={echeanceActuelle.periode}
                waveNumber={waveNumber}
              />
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Historique des paiements</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-6">Mois</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-6">Montant</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-6">Échéance</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-6">Date paiement</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-6">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paiementsList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Aucun historique de paiement
                  </td>
                </tr>
              ) : (
                paiementsList.map((p) => {
                  const isLate = p.statut === "a_payer" && new Date(p.date_echeance) < now;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-6 text-sm font-medium text-slate-900">{p.periode}</td>
                      <td className="py-3 px-6 text-sm text-slate-600 text-right">
                        {p.montant.toLocaleString('fr-FR')} {p.devise}
                      </td>
                      <td className="py-3 px-6 text-sm text-slate-600">
                        {new Date(p.date_echeance).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3 px-6 text-sm text-slate-600">
                        {p.date_paiement ? new Date(p.date_paiement).toLocaleDateString("fr-FR") : "—"}
                      </td>
                      <td className="py-3 px-6 text-sm">
                        {p.statut === "paye" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle className="w-4 h-4" /> Payé
                          </span>
                        ) : p.statut === "en_attente" ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                            <Clock className="w-4 h-4" /> En attente
                          </span>
                        ) : isLate ? (
                          <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                            <AlertTriangle className="w-4 h-4" /> En retard
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                            À payer
                          </span>
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
    </div>
  );
}
