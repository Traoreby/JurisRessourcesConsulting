import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Cabinet | Juris Ressources Consulting",
  description: "Découvrez l'histoire, la mission, la vision et les valeurs de Juris Ressources Consulting, cabinet d'expertise en Côte d'Ivoire.",
};

export default function CabinetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
