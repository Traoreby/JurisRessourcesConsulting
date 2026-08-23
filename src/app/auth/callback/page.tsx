"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle } from "lucide-react";

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const supabase = createClient();
        
        // Handle parameters
        const code = searchParams.get("code");
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type") as any;
        const next = searchParams.get("next") ?? "/admin/dashboard";

        if (token_hash && type) {
          const { error: otpError } = await supabase.auth.verifyOtp({ token_hash, type });
          if (otpError) throw new Error(otpError.message);
        } else if (code) {
          const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
          if (codeError) throw new Error(codeError.message);
        }

        // Wait a short moment to ensure the client has parsed any URL hash fragment (#access_token=...)
        // createBrowserClient automatically parses it and stores it in cookies.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw new Error(sessionError.message);

        if (session) {
          const requiresPasswordUpdate = session.user.user_metadata?.requires_password_update === true;
          
          if (requiresPasswordUpdate) {
            router.replace("/admin/update-password");
          } else {
            router.replace(next);
          }
        } else {
          // If no session is found, it means the token was missing or invalid.
          // Don't redirect to /admin/login silently. Show an error first.
          throw new Error("Lien invalide ou expiré.");
        }
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue lors de l'authentification.");
      }
    };

    handleAuth();
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
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
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
