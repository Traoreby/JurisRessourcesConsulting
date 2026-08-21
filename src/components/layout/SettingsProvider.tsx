"use client";

import { createContext, useContext, ReactNode } from "react";
import type { CabinetSettings } from "@/types/admin";

const SettingsContext = createContext<CabinetSettings | null>(null);

export function SettingsProvider({ settings, children }: { settings: CabinetSettings | null, children: ReactNode }) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
