import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Mail, Phone, MapPin } from "lucide-react";

import { useSettings } from "@/components/layout/SettingsProvider";

export function Footer() {
  const settings = useSettings();
  return (
    <footer className="bg-primary text-white pt-20 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
        <div className="lg:col-span-1">
          <Logo variant="white" className="mb-6" />
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Assistance et accompagnement juridique, comptable, fiscal et en ressources humaines en Côte d'Ivoire.
          </p>
          <div className="flex space-x-4">
            <a
              href={settings?.facebook || "https://www.facebook.com/share/19GSpywnZN/"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Suivre Juris Ressources Consulting sur Facebook"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-accent hover:text-primary transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a
              href={settings?.tiktok || "https://www.tiktok.com/@juris.ressources?_r=1&_t=ZS-9933N6lI38b"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Suivre Juris Ressources Consulting sur TikTok"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-accent hover:text-primary transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            </a>
            <a
              href={settings?.whatsapp || "https://wa.me/message/T27HENDTW4LZJ1"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contacter Juris Ressources Consulting sur WhatsApp"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-accent hover:text-primary transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </a>
            {/* LinkedIn — lien à ajouter dès que la page officielle est disponible */}
            {/* <a href="https://linkedin.com/company/juris-ressources-consulting" target="_blank" rel="noopener noreferrer" aria-label="Suivre Juris Ressources Consulting sur LinkedIn" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-accent hover:text-primary transition-all"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a> */}
          </div>
        </div>
        
        <div>
          <h4 className="text-base font-bold mb-6 text-white tracking-wide uppercase">Liens rapides</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-accent transition-colors">Accueil</Link></li>
            <li><Link href="/cabinet" className="hover:text-accent transition-colors">Le Cabinet</Link></li>
            <li><Link href="/services" className="hover:text-accent transition-colors">Nos Services</Link></li>
            <li><Link href="/formations" className="hover:text-accent transition-colors">Nos Formations</Link></li>
            <li><Link href="/blog" className="hover:text-accent transition-colors">Blog & Actualités</Link></li>
            <li><Link href="/consultation" className="hover:text-accent transition-colors">Consultation</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-base font-bold mb-6 text-white tracking-wide uppercase">Nos Services</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/services#juridique" className="hover:text-accent transition-colors">Assistance Juridique</Link></li>
            <li><Link href="/services#comptabilite" className="hover:text-accent transition-colors">Accompagnement Comptable</Link></li>
            <li><Link href="/services#fiscalite" className="hover:text-accent transition-colors">Conseil Fiscal</Link></li>
            <li><Link href="/services#ressources-humaines" className="hover:text-accent transition-colors">Ressources Humaines</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-base font-bold mb-6 text-white tracking-wide uppercase">Contact</h4>
          <ul className="space-y-5 text-sm text-gray-400">
            <li className="flex items-start gap-4">
              <MapPin size={20} className="text-accent shrink-0 mt-0.5" />
              <span>{settings?.adresse ? settings.adresse.split(",").map((line, i) => <span key={i}>{line}<br/></span>) : <>Maison Mak, Grand-Bassam<br/>Derrière la pharmacie Mockey-ville</>}</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone size={20} className="text-accent shrink-0" />
              <div>
                <a href={`tel:${settings?.telephone1 || "+2252731948863"}`} className="block hover:text-accent transition-colors">{settings?.telephone1 || "+225 27 31 94 88 63"}</a>
                <a href={`tel:${settings?.telephone2 || "+2250749436170"}`} className="block hover:text-accent transition-colors">{settings?.telephone2 || "+225 07 49 43 61 70"}</a>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <Mail size={20} className="text-accent shrink-0" />
              <a href={`mailto:${settings?.email || "info.jrcsarl@gmail.com"}`} className="hover:text-accent transition-colors">{settings?.email || "info.jrcsarl@gmail.com"}</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 border-t border-slate-700/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
        <p>© {new Date().getFullYear()} Juris Ressources Consulting. Tous droits réservés.</p>
        <div className="flex gap-6">
          <Link href="/mentions-legales" className="hover:text-accent transition-colors">Mentions légales</Link>
          <Link href="/confidentialite" className="hover:text-accent transition-colors">Politique de confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}
