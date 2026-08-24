"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Briefcase,
  Handshake,
  Newspaper,
  Megaphone,
  MessageSquare,
  Settings,
  LogOut,
  Users,
  X,
  Wallet,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAdmin } from "@/components/admin/AdminContext";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/formations", label: "Formations", icon: GraduationCap },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/partenariats", label: "Partenariats", icon: Handshake },
  { href: "/admin/actualites", label: "Actualités", icon: Newspaper },
  { href: "/admin/publicites", label: "Publicités", icon: Megaphone },
  { href: "/admin/demandes", label: "Demandes", icon: MessageSquare },
  { href: "/admin/paiements", label: "Paiements", icon: Wallet },
];

const superAdminOnlyItems = [
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useAdmin();
  const [role, setRole] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile) setRole(profile.role);
      }
    }
    getRole();
  }, [supabase]);

  const close = () => setSidebarOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-primary text-white z-50 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu d'administration"
      >
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between min-h-[72px]">
          <Logo variant="white" showText={true} className="scale-[0.72] origin-left" />
          <button
            onClick={close}
            className="lg:hidden text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded p-1"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin badge */}
        <div className="px-5 py-2.5 bg-accent/10 border-b border-white/10">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            Espace Administration
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Navigation admin">
          <ul className="space-y-0.5 px-3">
            {[...navItems, ...(role === "SUPER_ADMIN" ? superAdminOnlyItems : [])].map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href + "/"));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset ${
                      isActive
                        ? "bg-accent text-primary font-semibold"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon
                      size={17}
                      className={
                        isActive
                          ? "text-primary shrink-0"
                          : "text-white/50 group-hover:text-white shrink-0"
                      }
                      aria-hidden="true"
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom — user info + logout */}
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">
              Connecté en tant que
            </p>
            <p className="text-sm font-semibold text-white truncate">
              Administrateur JRC
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset w-full"
          >
            <LogOut size={17} aria-hidden="true" className="shrink-0" />
            Se déconnecter
          </button>
        </div>
      </aside>
    </>
  );
}
