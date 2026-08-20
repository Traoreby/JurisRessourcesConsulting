import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Actualités | Juris Ressources Consulting – Grand-Bassam",
  description: "Toute l'actualité juridique, fiscale, comptable et RH en Côte d'Ivoire par les experts de Juris Ressources Consulting à Grand-Bassam.",
  keywords: "Juris Ressources Consulting, JRC, blog juridique Côte d'Ivoire, fiscalité Côte d'Ivoire, comptabilité SYSCOHADA, droit du travail Côte d'Ivoire, ressources humaines Côte d'Ivoire, Grand-Bassam, actualité fiscale Côte d'Ivoire",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
