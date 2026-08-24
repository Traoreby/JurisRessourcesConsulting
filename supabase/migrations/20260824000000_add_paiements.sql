-- ==============================================================================
-- SCHEMA SUPABASE POUR LE MODULE DE PAIEMENTS
-- ==============================================================================

-- 1. Ajout du numéro Wave dans la table settings
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS wave_payment_number TEXT;

-- 2. Création de la table paiements
CREATE TABLE IF NOT EXISTS public.paiements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  periode TEXT NOT NULL, -- Ex: 'Août 2026' ou '2026-08'
  montant INTEGER NOT NULL CHECK (montant > 0),
  devise TEXT NOT NULL DEFAULT 'XOF',
  date_echeance TIMESTAMPTZ NOT NULL,
  date_paiement TIMESTAMPTZ,
  statut TEXT NOT NULL CHECK (statut IN ('a_payer', 'en_attente', 'paye')) DEFAULT 'a_payer',
  reference_wave TEXT UNIQUE,
  date_validation TIMESTAMPTZ,
  super_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(admin_id, periode)
);

-- Activation RLS
ALTER TABLE public.paiements ENABLE ROW LEVEL SECURITY;

-- 3. Policies pour ADMIN

-- Un ADMIN peut voir uniquement ses propres paiements
DROP POLICY IF EXISTS "Les ADMIN peuvent lire leurs propres paiements" ON public.paiements;
CREATE POLICY "Les ADMIN peuvent lire leurs propres paiements"
ON public.paiements FOR SELECT
USING (auth.uid() = admin_id);

-- Un ADMIN peut modifier uniquement ses paiements, et seulement s'ils sont 'a_payer'
-- et il ne peut modifier que reference_wave, date_paiement, statut (qui passe à en_attente)
DROP POLICY IF EXISTS "Les ADMIN peuvent declarer un paiement" ON public.paiements;
CREATE POLICY "Les ADMIN peuvent declarer un paiement"
ON public.paiements FOR UPDATE
USING (auth.uid() = admin_id AND statut = 'a_payer')
WITH CHECK (
  auth.uid() = admin_id AND 
  statut = 'en_attente' AND
  reference_wave IS NOT NULL AND
  date_paiement IS NOT NULL
);

-- 4. Policies pour SUPER_ADMIN

-- Un SUPER_ADMIN peut tout lire
DROP POLICY IF EXISTS "Les SUPER_ADMIN peuvent tout lire sur paiements" ON public.paiements;
CREATE POLICY "Les SUPER_ADMIN peuvent tout lire sur paiements"
ON public.paiements FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- Un SUPER_ADMIN peut tout inserer (créer des échéances)
DROP POLICY IF EXISTS "Les SUPER_ADMIN peuvent inserer des paiements" ON public.paiements;
CREATE POLICY "Les SUPER_ADMIN peuvent inserer des paiements"
ON public.paiements FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- Un SUPER_ADMIN peut tout modifier (valider les paiements)
DROP POLICY IF EXISTS "Les SUPER_ADMIN peuvent modifier des paiements" ON public.paiements;
CREATE POLICY "Les SUPER_ADMIN peuvent modifier des paiements"
ON public.paiements FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- Un SUPER_ADMIN peut supprimer (optionnel mais utile en cas d'erreur de génération)
DROP POLICY IF EXISTS "Les SUPER_ADMIN peuvent supprimer des paiements" ON public.paiements;
CREATE POLICY "Les SUPER_ADMIN peuvent supprimer des paiements"
ON public.paiements FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- Trigger pour la mise à jour de updated_at
CREATE TRIGGER update_paiements_updated_at
BEFORE UPDATE ON public.paiements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
