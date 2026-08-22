import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Formations",
  description: "Parcourez nos programmes de formation professionnelle en droit, fiscalité, comptabilité et gestion des ressources humaines.",
};

export default function FormationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
