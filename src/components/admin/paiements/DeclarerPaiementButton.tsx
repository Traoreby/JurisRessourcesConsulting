"use client";

import { useState } from "react";
import { declarerPaiementWave } from "@/app/actions/paiements";
import { X, Check, CreditCard, Loader2 } from "lucide-react";

export function DeclarerPaiementButton({
  paiementId,
  montant,
  devise,
  periode,
  waveNumber
}: {
  paiementId: string;
  montant: number;
  devise: string;
  periode: string;
  waveNumber: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [reference, setReference] = useState("");
  const [datePaiement, setDatePaiement] = useState(new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) {
      alert("Veuillez saisir la référence Wave");
      return;
    }

    setIsLoading(true);
    try {
      await declarerPaiementWave(paiementId, reference.trim(), new Date(datePaiement).toISOString());
      alert("Paiement déclaré avec succès");
      setIsOpen(false);
    } catch (err: any) {
      alert(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <CreditCard className="w-5 h-5" />
        Payer par Wave
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CreditCard className="text-primary w-5 h-5" />
                Déclarer un paiement
              </h3>
              <button
                onClick={() => !isLoading && setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-sm">
                <p className="text-slate-600 mb-2">
                  1. Effectuez le paiement de <strong className="text-slate-900">{montant.toLocaleString('fr-FR')} {devise}</strong> sur le numéro Wave :
                </p>
                <p className="text-xl font-bold text-primary mb-2 text-center py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                  {waveNumber}
                </p>
                <p className="text-slate-600">
                  2. Saisissez la référence de la transaction ci-dessous.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="reference" className="block text-sm font-bold text-slate-700 mb-1">
                    Référence de la transaction Wave <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reference"
                    type="text"
                    required
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ex: CI230824.1432.A1B2C3"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="date_paiement" className="block text-sm font-bold text-slate-700 mb-1">
                    Date du paiement <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="date_paiement"
                    type="date"
                    required
                    value={datePaiement}
                    onChange={(e) => setDatePaiement(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                    disabled={isLoading}
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isLoading || !reference.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Envoi...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" /> Confirmer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
