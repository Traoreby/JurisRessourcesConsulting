import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Services | Juris Ressources Consulting – Grand-Bassam, Côte d'Ivoire",
  description:
    "Juris Ressources Consulting propose des services d'assistance juridique, d'accompagnement comptable (SYSCOHADA), de conseil fiscal et de gestion des ressources humaines à Grand-Bassam, en Côte d'Ivoire.",
  keywords:
    "cabinet juridique Grand-Bassam, conseil juridique Côte d'Ivoire, comptabilité SYSCOHADA, conseil fiscal Côte d'Ivoire, ressources humaines Côte d'Ivoire, OHADA, DGI Côte d'Ivoire, CNPS, Juris Ressources Consulting, JRC",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
