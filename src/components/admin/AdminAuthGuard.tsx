"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Note : Cette protection est temporaire et fonctionne uniquement côté client via sessionStorage.
    // Elle sera remplacée par une véritable vérification côté serveur avec Supabase Auth.
    
    const isAuthenticated = sessionStorage.getItem("admin_authenticated") === "true";
    const isLoginPage = pathname === "/admin/login";

    if (!isAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Si on est en train de vérifier (ou de rediriger), on peut afficher un loader minimal
  // ou simplement ne rien afficher pour éviter un "flash" de contenu non autorisé.
  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-primary border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
