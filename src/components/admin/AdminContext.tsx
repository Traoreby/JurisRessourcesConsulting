"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const AdminContext = createContext<AdminContextType>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  toggleSidebar: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <AdminContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
