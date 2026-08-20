import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Juris Ressources Consulting | Cabinet Juridique, Fiscal, Comptable & RH",
  description: "Cabinet d'assistance et accompagnement juridique, comptable, fiscal et en ressources humaines basé à Grand-Bassam, Côte d'Ivoire.",
  keywords: "cabinet juridique Grand-Bassam, cabinet comptable Grand-Bassam, conseil fiscal Côte d'Ivoire, ressources humaines Côte d'Ivoire, Juris Ressources Consulting, JRC",
  openGraph: {
    title: "Juris Ressources Consulting",
    description: "Votre partenaire stratégique pour une gestion performante en Côte d'Ivoire.",
    url: "https://jurisressources.com",
    siteName: "Juris Ressources Consulting",
    images: [
      {
        url: "/logo/logo.png",
        width: 800,
        height: 600,
        alt: "Logo Juris Ressources Consulting",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  icons: {
    icon: "/logo/logo.png",
    shortcut: "/logo/logo.png",
    apple: "/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${inter.variable} h-full antialiased scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-hidden" suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
