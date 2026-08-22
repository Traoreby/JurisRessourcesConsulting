import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demander une consultation",
  description: "Prenez rendez-vous avec nos experts juridiques, fiscaux et comptables pour analyser vos besoins et vous proposer des solutions sur mesure.",
};

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
