import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact – Juris Ressources Consulting | Grand-Bassam, Côte d’Ivoire",
  description:
    "Contactez Juris Ressources Consulting à Grand-Bassam, Côte d’Ivoire. Téléphone, WhatsApp, email et formulaire de contact disponibles. Réponse sous 24 à 48 heures ouvrées pour vos besoins juridiques, comptables, fiscaux et en ressources humaines.",
  keywords:
    "contact Juris Ressources Consulting, JRC, contact cabinet Grand-Bassam, cabinet juridique Grand-Bassam, comptabilité Côte d’Ivoire, conseil fiscal Côte d’Ivoire, ressources humaines Côte d’Ivoire, Grand-Bassam",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
