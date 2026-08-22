import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contactez-nous",
  description: "Contactez l'équipe de Juris Ressources Consulting (JRC) pour toute question, accompagnement ou demande d'information.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
