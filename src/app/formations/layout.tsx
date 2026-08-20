import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Formations – Juris Ressources Consulting | Grand-Bassam",
  description: "Découvrez les formations professionnelles en droit, fiscalité, ressources humaines et comptabilité proposées par Juris Ressources Consulting à Grand-Bassam, Côte d'Ivoire.",
  keywords: "Juris Ressources Consulting, formations professionnelles, formation Grand-Bassam, formation Côte d'Ivoire, formation droit, formation fiscalité, formation ressources humaines, formation paie, droit du travail, SYSCOHADA, JRC",
};

export default function FormationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
