import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Services | Juris Ressources Consulting",
  description: "Découvrez nos services d'assistance juridique, accompagnement comptable, conseil fiscal et ressources humaines à Grand-Bassam, Côte d'Ivoire.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
