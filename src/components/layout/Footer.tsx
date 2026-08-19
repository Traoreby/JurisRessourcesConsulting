import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-20 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
        <div className="lg:col-span-1">
          <Logo variant="white" className="mb-6" />
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Assistance et accompagnement juridique, comptable, fiscal et en ressources humaines en Côte d'Ivoire.
          </p>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-accent hover:text-primary transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-accent hover:text-primary transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-accent hover:text-primary transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
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
            <li><Link href="/services#comptable" className="hover:text-accent transition-colors">Accompagnement Comptable</Link></li>
            <li><Link href="/services#fiscal" className="hover:text-accent transition-colors">Conseil Fiscal</Link></li>
            <li><Link href="/services#rh" className="hover:text-accent transition-colors">Ressources Humaines</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-base font-bold mb-6 text-white tracking-wide uppercase">Contact</h4>
          <ul className="space-y-5 text-sm text-gray-400">
            <li className="flex items-start gap-4">
              <MapPin size={20} className="text-accent shrink-0 mt-0.5" />
              <span>Maison Mak, Grand-Bassam<br/>Derrière la pharmacie Mockey-ville</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone size={20} className="text-accent shrink-0" />
              <div>
                <a href="tel:+2252731948863" className="block hover:text-accent transition-colors">+225 27 31 94 88 63</a>
                <a href="tel:+2250576702210" className="block hover:text-accent transition-colors">+225 05 76 70 22 10</a>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <Mail size={20} className="text-accent shrink-0" />
              <a href="mailto:info.jrcsarl@gmail.com" className="hover:text-accent transition-colors">info.jrcsarl@gmail.com</a>
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
