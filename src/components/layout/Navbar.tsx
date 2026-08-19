"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const links = [
  { name: "Accueil", href: "/" },
  { name: "Le Cabinet", href: "/cabinet" },
  { name: "Nos Services", href: "/services" },
  { name: "Nos Formations", href: "/formations" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled 
        ? "glass py-2" 
        : "bg-background py-4 border-b border-transparent"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Logo />
        
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-[15px] font-semibold text-primary hover:text-accent transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>
        
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/consultation" className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-hover transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Demander une consultation
          </Link>
        </div>
        
        <button className="lg:hidden p-2 text-primary hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 border-b p-4 bg-background shadow-premium animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="text-lg font-semibold text-primary p-3 hover:bg-slate-50 hover:text-accent rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/consultation" 
              className="px-4 py-4 mt-4 bg-primary text-white text-center rounded-lg font-bold shadow-md hover:bg-primary-hover"
              onClick={() => setIsOpen(false)}
            >
              Demander une consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
