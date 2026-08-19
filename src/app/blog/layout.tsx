import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Actualités | Juris Ressources Consulting",
  description: "Toute l'actualité juridique, fiscale, comptable et RH en Côte d'Ivoire par les experts de Juris Ressources Consulting.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
