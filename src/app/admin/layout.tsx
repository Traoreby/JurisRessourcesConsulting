"use client";

import { AdminProvider } from "@/components/admin/AdminContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";

// Layout d'administration — isolé visuellement du site public.
// Utilise z-[99] pour couvrir la Navbar/Footer du root layout jusqu'à
// ce que la migration vers des route groups soit effectuée avec Supabase Auth.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminAuthGuard>
        <div
          className="flex h-screen bg-slate-50 overflow-hidden"
          style={{ fontFamily: "var(--font-sans), sans-serif" }}
        >
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </AdminAuthGuard>
    </AdminProvider>
  );
}
