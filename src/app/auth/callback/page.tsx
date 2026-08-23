"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Terminal } from "lucide-react";

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${msg}`]);
  };

  useEffect(() => {
    let mounted = true;

    const handleAuth = async () => {
      try {
        const hashStr = window.location.hash;
        addLog(`Page mounted. Hash: ${hashStr ? "Present" : "Empty"}`);
        addLog(`Query params: ${searchParams.toString()}`);
        
        const supabase = createClient();
        addLog("Supabase client initialized.");
        
        // Handle explicit parameters
        const code = searchParams.get("code");
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type") as any;
        const next = searchParams.get("next") ?? "/admin/dashboard";

        if (token_hash && type) {
          addLog("Calling verifyOtp...");
          const { error: otpError } = await supabase.auth.verifyOtp({ token_hash, type });
          if (otpError) throw new Error(otpError.message);
        } else if (code) {
          addLog("Calling exchangeCodeForSession...");
          const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
          if (codeError) throw new Error(codeError.message);
        } else if (hashStr && hashStr.includes("access_token=")) {
          addLog("Hash fragment detected. Parsing manually...");
          // Extract access_token and refresh_token from hash
          const hashParams = new URLSearchParams(hashStr.substring(1)); // remove '#'
          const access_token = hashParams.get("access_token");
          const refresh_token = hashParams.get("refresh_token");
          
          if (access_token && refresh_token) {
            addLog("Calling setSession with extracted tokens...");
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token
            });
            if (setSessionError) throw new Error(`setSession error: ${setSessionError.message}`);
            addLog("setSession succeeded.");
          } else {
            addLog("Hash present but missing access_token or refresh_token.");
          }
        } else {
          addLog("No explicit code, token_hash, or hash fragment. Assuming unauthenticated.");
        }

        addLog("Calling getSession()...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw new Error(`getSession error: ${sessionError.message}`);

        if (session) {
          addLog(`Session is valid for: ${session.user.email}`);
          const requiresPasswordUpdate = session.user.user_metadata?.requires_password_update === true;
          addLog(`Requires password update: ${requiresPasswordUpdate}`);
          
          addLog("Redirecting in 1s...");
          setTimeout(() => {
            if (requiresPasswordUpdate) {
              router.replace("/admin/update-password");
            } else {
              router.replace(next);
            }
          }, 1000);
        } else {
           addLog("No session found. Firing error.");
           setError("Lien invalide ou expiré.");
        }

      } catch (err: any) {
        addLog(`Error caught: ${err.message}`);
        setError(err.message || "Une erreur est survenue lors de l'authentification.");
      }
    };

    handleAuth();
    
    return () => { mounted = false; };
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-sm border border-red-100 text-center mb-4">
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
        
        {/* Debug Logs */}
        <div className="max-w-md w-full bg-slate-900 rounded-xl p-4 shadow-sm text-left">
           <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-slate-700 pb-2">
             <Terminal size={16} />
             <span className="text-xs font-bold uppercase tracking-wider">Debug Logs</span>
           </div>
           <pre className="text-[10px] text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
             {logs.join('\n')}
           </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center bg-slate-50 p-4">
      <div className="text-center mb-8">
        <div className="w-8 h-8 border-4 border-primary border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Authentification en cours...</p>
      </div>
      
      {/* Debug Logs while loading */}
      <div className="max-w-md w-full bg-slate-900 rounded-xl p-4 shadow-sm text-left opacity-70">
         <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-slate-700 pb-2">
           <Terminal size={16} />
           <span className="text-xs font-bold uppercase tracking-wider">Debug Logs</span>
         </div>
         <pre className="text-[10px] text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
           {logs.length > 0 ? logs.join('\n') : "Waiting for logs..."}
         </pre>
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
