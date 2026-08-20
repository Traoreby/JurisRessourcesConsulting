"use client";

import { Menu } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminContext";

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  const { toggleSidebar } = useAdmin();

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center gap-4 shrink-0 sticky top-0 z-30">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Ouvrir le menu de navigation"
      >
        <Menu size={22} aria-hidden="true" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-lg md:text-xl font-bold text-primary truncate">{title}</h1>
        {description && (
          <p className="text-sm text-slate-500 truncate hidden md:block mt-0.5">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </header>
  );
}
