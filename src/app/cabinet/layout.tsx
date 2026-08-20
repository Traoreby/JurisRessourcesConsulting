import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Cabinet | Juris Ressources Consulting – Grand-Bassam, Côte d'Ivoire",
  description:
    "Découvrez Juris Ressources Consulting, cabinet SARLU fondé en 2025 à Grand-Bassam, Côte d'Ivoire. Accompagnement juridique, comptable, fiscal et en ressources humaines pour les entreprises.",
  keywords:
    "cabinet juridique Grand-Bassam, cabinet comptable Côte d'Ivoire, conseil fiscal Grand-Bassam, ressources humaines Côte d'Ivoire, Juris Ressources Consulting, JRC, SARLU",
};

export default function CabinetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
