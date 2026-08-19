import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Juris Ressources Consulting",
  description: "Contactez Juris Ressources Consulting à Grand-Bassam, Côte d'Ivoire. Téléphone, WhatsApp, email et formulaire de contact.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
