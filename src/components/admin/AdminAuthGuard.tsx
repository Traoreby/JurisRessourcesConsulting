"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle } from "lucide-react";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      const isLoginPage = pathname === "/admin/login";

      if (!session && !isLoginPage) {
        router.replace("/admin/login");
        return;
      }

      if (session && !isLoginPage) {
        // Vérifier si l'utilisateur a un profil valide
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (!profile) {
          setError("Accès refusé. Votre compte utilisateur n'a pas de profil associé.");
          setIsChecking(false);
          return;
        }

        if (profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN") {
          setError("Accès refusé. Vous n'avez pas les permissions nécessaires.");
          setIsChecking(false);
          return;
        }

        const isSuperAdminRoute = pathname.startsWith("/admin/parametres") || pathname.startsWith("/admin/utilisateurs");
        
        if (isSuperAdminRoute && profile.role !== "SUPER_ADMIN") {
          setError("Accès refusé. Cette section est réservée au SUPER_ADMIN.");
          setIsChecking(false);
          return;
        }
      }

      setIsChecking(false);
    }
    
    checkAuth();
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-primary border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-sm border border-red-100 text-center">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Accès Interdit</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              router.replace("/admin/login");
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium text-sm"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
