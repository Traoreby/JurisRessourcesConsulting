import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Services",
  description: "Découvrez nos services d'assistance juridique, accompagnement comptable, conseil fiscal et ressources humaines pour les entreprises en Côte d'Ivoire.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
