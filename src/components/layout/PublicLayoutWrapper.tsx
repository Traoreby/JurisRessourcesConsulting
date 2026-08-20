"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ReactNode } from "react";

export function PublicLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Si on est dans l'espace Admin, on ne rend QUE le contenu admin.
  // Cela garantit une isolation parfaite sans conflit de z-index avec la Navbar ou le Footer public.
  if (isAdmin) {
    return <>{children}</>;
  }

  // Sinon, on rend le layout public complet avec Navbar, Footer et bouton WhatsApp.
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
