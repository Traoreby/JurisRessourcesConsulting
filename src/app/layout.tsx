import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PublicLayoutWrapper } from "@/components/layout/PublicLayoutWrapper";
import { SettingsProvider } from "@/components/layout/SettingsProvider";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('settings').select('*').eq('id', true).single();

  const title = settings?.seo_title || "Juris Ressources Consulting | Cabinet Juridique, Fiscal, Comptable & RH";
  const description = settings?.seo_description || "Cabinet d'assistance et accompagnement juridique, comptable, fiscal et en ressources humaines basé à Grand-Bassam, Côte d'Ivoire.";
  
  return {
    metadataBase: new URL("https://jurisressources.com"),
    title,
    description,
    keywords: "cabinet juridique Grand-Bassam, cabinet comptable Grand-Bassam, conseil fiscal Côte d'Ivoire, ressources humaines Côte d'Ivoire, Juris Ressources Consulting, JRC",
    openGraph: {
      title: title,
      description: description,
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('settings').select('*').eq('id', true).single();

  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${inter.variable} h-full antialiased scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-hidden" suppressHydrationWarning>
        <SettingsProvider settings={settings}>
          <PublicLayoutWrapper>
            {children}
          </PublicLayoutWrapper>
        </SettingsProvider>
      </body>
    </html>
  );
}
