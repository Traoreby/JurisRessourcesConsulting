"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle } from "lucide-react";

const DEFAULT_AUTH_REDIRECT = "/admin/dashboard";
const ALLOWED_AUTH_REDIRECTS = new Set([
  DEFAULT_AUTH_REDIRECT,
  "/admin/update-password",
]);

function getSafeAuthRedirect(nextParam: string | null) {
  if (!nextParam) return DEFAULT_AUTH_REDIRECT;
  return ALLOWED_AUTH_REDIRECTS.has(nextParam) ? nextParam : DEFAULT_AUTH_REDIRECT;
}

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const handleAuth = async () => {
      try {
        const hashStr = window.location.hash;
        const supabase = createClient();
        
        // Handle explicit parameters
        const code = searchParams.get("code");
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type") as any;
        const next = getSafeAuthRedirect(searchParams.get("next"));

        if (token_hash && type) {
          const { error: otpError } = await supabase.auth.verifyOtp({ token_hash, type });
          if (otpError) throw new Error(otpError.message);
        } else if (code) {
          const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
          if (codeError) throw new Error(codeError.message);
        } else if (hashStr && hashStr.includes("access_token=")) {
          // Extract access_token and refresh_token from hash (Implicit Flow)
          const hashParams = new URLSearchParams(hashStr.substring(1));
          const access_token = hashParams.get("access_token");
          const refresh_token = hashParams.get("refresh_token");
          
          if (access_token && refresh_token) {
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token
            });
            
            if (setSessionError) throw new Error("Le lien d'invitation est invalide ou a expiré.");
            
            // Nettoyer immédiatement l'URL pour des raisons de sécurité
            if (window.history && window.history.replaceState) {
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw new Error("Erreur de session.");

        if (session) {
          const requiresPasswordUpdate = session.user.user_metadata?.requires_password_update === true;
          
          if (requiresPasswordUpdate) {
            router.replace("/admin/update-password");
          } else {
            router.replace(next);
          }
        } else {
           setError("Lien invalide ou expiré.");
        }

      } catch (err: any) {
        setError(err.message || "Une erreur est survenue lors de l'authentification.");
      }
    };

    handleAuth();
    
    return () => { mounted = false; };
  }, [router, searchParams]);

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
            onClick={() => router.replace("/admin/login")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium text-sm"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-4">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Authentification en cours...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-primary border-t-accent rounded-full animate-spin mx-auto"></div>
      </div>
    }>
      <AuthCallbackHandler />
    </Suspense>
  );
}
