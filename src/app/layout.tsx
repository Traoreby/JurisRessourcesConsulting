import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PublicLayoutWrapper } from "@/components/layout/PublicLayoutWrapper";
import { SettingsProvider } from "@/components/layout/SettingsProvider";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/env/public";

type PublicSettings = {
  id: boolean;
  nom: string;
  description: string;
  telephone1: string;
  telephone2?: string;
  email: string;
  adresse: string;
  whatsapp: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  horaires: string;
  seo_title?: string;
  seo_description?: string;
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const PUBLIC_SETTINGS_COLUMNS = [
  "id",
  "nom",
  "description",
  "telephone1",
  "telephone2",
  "email",
  "adresse",
  "whatsapp",
  "facebook",
  "tiktok",
  "linkedin",
  "horaires",
  "seo_title",
  "seo_description",
].join(", ");

export async function generateMetadata(): Promise<Metadata> {
  const { supabaseUrl, supabaseAnonKey } = getSupabasePublicEnv();
  const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  const { data } = await supabase
    .from("public_settings" as "settings")
    .select(PUBLIC_SETTINGS_COLUMNS)
    .eq("id", true)
    .single();
  const settings = data as PublicSettings | null;

  const title = settings?.seo_title || "Juris Ressources Consulting | Cabinet Juridique, Fiscal, Comptable & RH";
  const description = settings?.seo_description || "Cabinet d'assistance et accompagnement juridique, comptable, fiscal et en ressources humaines basé à Grand-Bassam, Côte d'Ivoire.";
  
  return {
    metadataBase: new URL("https://www.jrcsarl.com"),
    title: {
      default: title,
      template: `%s | Juris Ressources Consulting`,
    },
    description,
    keywords: "cabinet juridique Grand-Bassam, cabinet comptable Grand-Bassam, conseil fiscal Côte d'Ivoire, ressources humaines Côte d'Ivoire, Juris Ressources Consulting, JRC",
    openGraph: {
      title: title,
      description: description,
      url: "https://www.jrcsarl.com",
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
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { supabaseUrl, supabaseAnonKey } = getSupabasePublicEnv();
  const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  const { data } = await supabase
    .from("public_settings" as "settings")
    .select(PUBLIC_SETTINGS_COLUMNS)
    .eq("id", true)
    .single();
  const settings = data as PublicSettings | null;

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
