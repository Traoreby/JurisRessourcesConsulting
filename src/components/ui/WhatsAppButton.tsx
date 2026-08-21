"use client";

import { MessageCircle } from "lucide-react";
import { useSettings } from "@/components/layout/SettingsProvider";

export function WhatsAppButton() {
  const settings = useSettings();
  const WHATSAPP_URL = settings?.whatsapp || "https://wa.me/message/T27HENDTW4LZJ1";
    
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center group">
      <div className="absolute right-full mr-4 bg-white text-primary text-sm font-bold px-4 py-2 rounded-lg shadow-premium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden md:block">
        Besoin d'aide ?
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-[6px] border-transparent border-l-white"></div>
      </div>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] hover:scale-110 transition-all duration-300"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-30 duration-1000"></div>
        <MessageCircle size={32} className="relative z-10" />
      </a>
    </div>
  );
}
