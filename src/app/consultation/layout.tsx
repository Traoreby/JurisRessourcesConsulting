import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demander une consultation | Juris Ressources Consulting",
  description: "Prenez rendez-vous avec nos experts pour une consultation personnalisée en droit, comptabilité, fiscalité ou RH.",
};

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
