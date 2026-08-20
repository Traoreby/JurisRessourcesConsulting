"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

// Page de connexion admin.
// Structure uniquement — l'authentification réelle sera branchée via Supabase Auth.
export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'une session temporaire avant intégration Supabase Auth
    sessionStorage.setItem("admin_authenticated", "true");
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Décoration de fond */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo variant="white" showText={true} />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-premium-hover p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-primary" size={24} aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold text-primary mb-1">
              Espace Administration
            </h1>
            <p className="text-slate-500 text-sm">
              Connectez-vous pour accéder au tableau de bord.
            </p>
          </div>

          {/* Notice Supabase */}
          {notice && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 bg-accent/10 border border-accent/30 rounded-xl p-4 text-sm text-primary"
            >
              <AlertCircle
                size={18}
                className="text-accent shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>
                <strong>Authentification non encore activée.</strong> Elle sera
                connectée à Supabase lors de la prochaine étape.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="admin-email"
                className="block text-sm font-semibold text-primary mb-2"
              >
                Adresse email
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jurisressources.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-primary placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="mb-6">
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-primary mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl text-primary placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} aria-hidden="true" />
                  ) : (
                    <Eye size={17} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-sm"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-primary transition-colors focus:outline-none focus:underline"
            >
              ← Retour au site public
            </Link>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Juris Ressources Consulting — Espace réservé
        </p>
      </div>
    </div>
  );
}
