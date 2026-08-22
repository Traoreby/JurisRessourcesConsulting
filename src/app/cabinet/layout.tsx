import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Cabinet",
  description: "Découvrez l'histoire, la vision et les valeurs de Juris Ressources Consulting, votre cabinet d'experts à Grand-Bassam.",
};

export default function CabinetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
