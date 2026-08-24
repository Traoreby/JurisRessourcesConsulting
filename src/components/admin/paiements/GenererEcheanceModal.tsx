"use client";

import { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { genererEcheance } from "@/app/actions/paiements";

interface GenererEcheanceModalProps {
  admins: { id: string; full_name: string; email: string }[];
  onClose: () => void;
  onSuccess: () => void;
}

export function GenererEcheanceModal({ admins, onClose, onSuccess }: GenererEcheanceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [periode, setPeriode] = useState("");
  const [montant, setMontant] = useState("25000");
  const [dateEcheance, setDateEcheance] = useState("");
  
  // By default, select all admins
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>(admins.map(a => a.id));

  const toggleAdmin = (id: string) => {
    if (selectedAdmins.includes(id)) {
      setSelectedAdmins(selectedAdmins.filter(a => a !== id));
    } else {
      setSelectedAdmins([...selectedAdmins, id]);
    }
  };

  const toggleAll = () => {
    if (selectedAdmins.length === admins.length) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(admins.map(a => a.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedAdmins.length === 0) {
      alert("Veuillez sélectionner au moins un administrateur.");
      return;
    }
    
    if (!periode.trim()) {
      alert("La période est requise.");
      return;
    }

    const numMontant = parseInt(montant, 10);
    if (isNaN(numMontant) || numMontant <= 0) {
      alert("Le montant doit être supérieur à 0.");
      return;
    }

    setIsLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const adminId of selectedAdmins) {
      try {
        await genererEcheance(
          adminId, 
          periode.trim(), 
          numMontant, 
          new Date(dateEcheance).toISOString()
        );
        successCount++;
      } catch (err: any) {
        errorCount++;
        // If it's the duplicate error, we can show a specific toast if we want, 
        // but to avoid spamming, we just count errors.
        console.error(`Erreur pour l'admin ${adminId}:`, err);
      }
    }

    setIsLoading(false);

    if (successCount > 0) {
      alert(`${successCount} échéance(s) générée(s) avec succès.`);
    }
    if (errorCount > 0) {
      alert(`${errorCount} échéance(s) ignorée(s) (déjà existante ou erreur).`);
    }

    if (successCount > 0) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="text-lg font-bold text-slate-800">
            Générer une échéance de paiement
          </h3>
          <button
            onClick={() => !isLoading && onClose()}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="periode" className="block text-sm font-bold text-slate-700 mb-1">
                Période <span className="text-red-500">*</span>
              </label>
              <input
                id="periode"
                type="text"
                required
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                placeholder="Ex: Août 2026"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="montant" className="block text-sm font-bold text-slate-700 mb-1">
                Montant (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                id="montant"
                type="number"
                required
                min="1"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="dateEcheance" className="block text-sm font-bold text-slate-700 mb-1">
              Date d'échéance <span className="text-red-500">*</span>
            </label>
            <input
              id="dateEcheance"
              type="date"
              required
              value={dateEcheance}
              onChange={(e) => setDateEcheance(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
              disabled={isLoading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-700">
                Administrateurs ({selectedAdmins.length}/{admins.length})
              </label>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs text-primary font-bold hover:underline"
                disabled={isLoading}
              >
                Tout (dé)sélectionner
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50 p-2 space-y-1">
              {admins.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">Aucun administrateur trouvé.</p>
              ) : (
                admins.map(admin => (
                  <label 
                    key={admin.id} 
                    className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAdmins.includes(admin.id)}
                      onChange={() => toggleAdmin(admin.id)}
                      disabled={isLoading}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-800">{admin.full_name}</div>
                      <div className="text-xs text-slate-500">{admin.email}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Note : Si une échéance existe déjà pour un administrateur sur cette même période, elle sera ignorée.
            </p>
          </div>

          <div className="pt-4 flex gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onClose()}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading || selectedAdmins.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Génération...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" /> Générer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
