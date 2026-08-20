const statusConfig: Record<string, { label: string; className: string }> = {
  // Article / Actualité
  publie: { label: "Publié", className: "bg-green-100 text-green-800" },
  brouillon: { label: "Brouillon", className: "bg-slate-100 text-slate-600" },
  archive: { label: "Archivé", className: "bg-slate-200 text-slate-500" },
  // Formation / Service / Partenaire / Publicité
  actif: { label: "Actif", className: "bg-green-100 text-green-800" },
  inactif: { label: "Inactif", className: "bg-slate-100 text-slate-500" },
  masque: { label: "Masqué", className: "bg-amber-100 text-amber-800" },
  // Demandes
  nouvelle: {
    label: "Nouvelle",
    className: "bg-accent/20 text-primary font-semibold",
  },
  en_cours: { label: "En cours", className: "bg-blue-100 text-blue-800" },
  traitee: { label: "Traitée", className: "bg-green-100 text-green-800" },
  archivee: { label: "Archivée", className: "bg-slate-100 text-slate-500" },
};

interface StatusBadgeProps {
  statut: string;
}

export function StatusBadge({ statut }: StatusBadgeProps) {
  const config = statusConfig[statut] ?? {
    label: statut,
    className: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${config.className}`}
    >
      {config.label}
    </span>
  );
}
