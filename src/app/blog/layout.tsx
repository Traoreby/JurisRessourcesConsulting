import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualités et Blog",
  description: "Suivez nos dernières actualités, analyses juridiques et fiscales, et décryptages de la législation en Côte d'Ivoire.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
