import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demander une consultation – Juris Ressources Consulting | Grand-Bassam, Côte d'Ivoire",
  description:
    "Prenez rendez-vous avec les experts de Juris Ressources Consulting à Grand-Bassam, Côte d'Ivoire. Consultation juridique, comptabilité, conseil fiscal et ressources humaines. Réponse sous 24 à 48 heures ouvrées.",
  keywords:
    "consultation juridique Grand-Bassam, consultation comptable Côte d'Ivoire, conseil fiscal Grand-Bassam, ressources humaines Côte d'Ivoire, Juris Ressources Consulting, JRC, cabinet Grand-Bassam, prise de rendez-vous cabinet juridique",
};

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
