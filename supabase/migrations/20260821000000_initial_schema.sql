-- ==============================================================================
-- SCHEMA SUPABASE POUR JURIS RESSOURCES CONSULTING (JRC)
-- Ce script est conçu pour être exécuté dans l'éditeur SQL de Supabase.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLE DES PROFILS & ROLES
-- ==============================================================================

-- Si la table existe déjà, on la supprime pour garantir l'idempotence de ce script (optionnel)
-- DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT CHECK (role IN ('SUPER_ADMIN', 'ADMIN')) DEFAULT 'ADMIN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activation RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies Profiles
DROP POLICY IF EXISTS "Les utilisateurs peuvent lire leur propre profil" ON public.profiles;
CREATE POLICY "Les utilisateurs peuvent lire leur propre profil" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Les SUPER_ADMIN peuvent tout lire" ON public.profiles;
CREATE POLICY "Les SUPER_ADMIN peuvent tout lire" 
ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

DROP POLICY IF EXISTS "Les SUPER_ADMIN peuvent tout modifier" ON public.profiles;
CREATE POLICY "Les SUPER_ADMIN peuvent tout modifier" 
ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- Trigger Profiles (Création automatique)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'ADMIN');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- S'assurer qu'il n'y a qu'un seul trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==============================================================================
-- 3. TABLES CMS (CONTENUS)
-- ==============================================================================

-- 3.1 ARTICLES
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  extrait TEXT NOT NULL,
  contenu TEXT NOT NULL,
  image TEXT,
  categorie TEXT NOT NULL,
  auteur TEXT NOT NULL,
  date_publication TIMESTAMPTZ,
  statut TEXT CHECK (statut IN ('publie', 'brouillon', 'archive')) DEFAULT 'brouillon',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 FORMATIONS
CREATE TABLE IF NOT EXISTS public.formations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  duree TEXT NOT NULL,
  public_cible TEXT NOT NULL,
  contenu TEXT NOT NULL,
  image TEXT,
  statut TEXT CHECK (statut IN ('actif', 'inactif', 'brouillon')) DEFAULT 'brouillon',
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 SERVICES
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icone TEXT,
  categorie TEXT NOT NULL,
  contenu TEXT NOT NULL,
  ordre INTEGER DEFAULT 0,
  statut TEXT CHECK (statut IN ('publie', 'masque', 'brouillon')) DEFAULT 'brouillon',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 PARTNERS
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  site_web TEXT,
  statut TEXT CHECK (statut IN ('actif', 'inactif')) DEFAULT 'inactif',
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5 ACTUALITES
CREATE TABLE IF NOT EXISTS public.actualites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  contenu TEXT NOT NULL,
  image TEXT,
  categorie TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  statut TEXT CHECK (statut IN ('publie', 'brouillon')) DEFAULT 'brouillon',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 PUBLICITES
CREATE TABLE IF NOT EXISTS public.publicites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre TEXT NOT NULL,
  texte TEXT NOT NULL,
  image TEXT,
  texte_bouton TEXT,
  url_bouton TEXT,
  date_debut TIMESTAMPTZ,
  date_fin TIMESTAMPTZ,
  statut TEXT CHECK (statut IN ('actif', 'inactif', 'brouillon')) DEFAULT 'brouillon',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.7 DEMANDES (Contacts & Consultations)
CREATE TABLE IF NOT EXISTS public.demandes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  telephone TEXT,
  email TEXT NOT NULL,
  objet TEXT,
  message TEXT NOT NULL,
  service TEXT,
  type TEXT CHECK (type IN ('contact', 'consultation')) NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  statut TEXT CHECK (statut IN ('nouvelle', 'en_cours', 'traitee', 'archivee')) DEFAULT 'nouvelle',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.8 SETTINGS (Table singleton)
CREATE TABLE IF NOT EXISTS public.settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id), -- Garantit une seule ligne
  nom TEXT NOT NULL,
  description TEXT NOT NULL,
  telephone1 TEXT NOT NULL,
  telephone2 TEXT,
  email TEXT NOT NULL,
  adresse TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  facebook TEXT,
  tiktok TEXT,
  linkedin TEXT,
  horaires TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) SUR LES TABLES CMS
-- ==============================================================================

-- Activation RLS sur toutes les tables
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actualites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publicites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;


-- 4.1 Fonction de vérification Admin globale (réutilisable dans les policies)
CREATE OR REPLACE FUNCTION public.is_admin_or_super()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4.2 LECTURE (PUBLIC)
-- Le public ne voit que ce qui est publié/actif
CREATE POLICY "Public articles" ON public.articles FOR SELECT USING (statut = 'publie');
CREATE POLICY "Public formations" ON public.formations FOR SELECT USING (statut = 'actif');
CREATE POLICY "Public services" ON public.services FOR SELECT USING (statut = 'publie');
CREATE POLICY "Public partners" ON public.partners FOR SELECT USING (statut = 'actif');
CREATE POLICY "Public actualites" ON public.actualites FOR SELECT USING (statut = 'publie');
CREATE POLICY "Public publicites" ON public.publicites FOR SELECT USING (statut = 'actif');
CREATE POLICY "Public settings" ON public.settings FOR SELECT USING (true);
-- Le public NE DOIT PAS voir les demandes ! Aucune policy SELECT publique pour demandes.

-- 4.3 CREATION DE DEMANDES (PUBLIC)
-- Le public peut envoyer une demande de contact ou consultation
CREATE POLICY "Public peut créer des demandes" ON public.demandes FOR INSERT WITH CHECK (true);


-- 4.4 ACCES ADMIN & SUPER_ADMIN
-- Les admins et super_admins peuvent TOUT FAIRE sur le contenu, sauf les settings.

-- SELECT ADMIN
CREATE POLICY "Admin select articles" ON public.articles FOR SELECT USING (public.is_admin_or_super());
CREATE POLICY "Admin select formations" ON public.formations FOR SELECT USING (public.is_admin_or_super());
CREATE POLICY "Admin select services" ON public.services FOR SELECT USING (public.is_admin_or_super());
CREATE POLICY "Admin select partners" ON public.partners FOR SELECT USING (public.is_admin_or_super());
CREATE POLICY "Admin select actualites" ON public.actualites FOR SELECT USING (public.is_admin_or_super());
CREATE POLICY "Admin select publicites" ON public.publicites FOR SELECT USING (public.is_admin_or_super());
CREATE POLICY "Admin select demandes" ON public.demandes FOR SELECT USING (public.is_admin_or_super());

-- ALL (INSERT, UPDATE, DELETE) ADMIN
CREATE POLICY "Admin all articles" ON public.articles FOR ALL USING (public.is_admin_or_super());
CREATE POLICY "Admin all formations" ON public.formations FOR ALL USING (public.is_admin_or_super());
CREATE POLICY "Admin all services" ON public.services FOR ALL USING (public.is_admin_or_super());
CREATE POLICY "Admin all partners" ON public.partners FOR ALL USING (public.is_admin_or_super());
CREATE POLICY "Admin all actualites" ON public.actualites FOR ALL USING (public.is_admin_or_super());
CREATE POLICY "Admin all publicites" ON public.publicites FOR ALL USING (public.is_admin_or_super());
CREATE POLICY "Admin all demandes" ON public.demandes FOR ALL USING (public.is_admin_or_super());


-- 4.5 ACCES SPECIFIQUE SUPER_ADMIN SUR LES SETTINGS
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'SUPER_ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "SuperAdmin all settings" ON public.settings FOR ALL USING (public.is_super_admin());


-- ==============================================================================
-- 5. BUCKET STORAGE (public-assets)
-- ==============================================================================

-- Le bucket public-assets (nécessite l'exécution via un rôle ayant les droits sur storage.buckets)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

-- RLS pour le Storage
-- Lecture publique de tous les fichiers du bucket public-assets
CREATE POLICY "Public read public-assets" ON storage.objects 
FOR SELECT USING (bucket_id = 'public-assets');

-- Upload / Modification / Suppression pour ADMIN et SUPER_ADMIN
CREATE POLICY "Admin write public-assets" ON storage.objects 
FOR ALL USING (bucket_id = 'public-assets' AND public.is_admin_or_super());


-- ==============================================================================
-- 6. FONCTION DE MISE A JOUR AUTOMATIQUE DE updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Application du trigger de mise à jour sur toutes les tables CMS
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_formations_updated_at BEFORE UPDATE ON public.formations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_actualites_updated_at BEFORE UPDATE ON public.actualites FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_publicites_updated_at BEFORE UPDATE ON public.publicites FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_demandes_updated_at BEFORE UPDATE ON public.demandes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
