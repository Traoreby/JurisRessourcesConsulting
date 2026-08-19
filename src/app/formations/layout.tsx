import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Formations | Juris Ressources Consulting",
  description: "Catalogue des formations professionnelles en droit, fiscalité et ressources humaines proposées par Juris Ressources Consulting.",
};

export default function FormationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
