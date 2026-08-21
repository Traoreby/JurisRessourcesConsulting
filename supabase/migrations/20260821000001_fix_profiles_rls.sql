-- Correction de la récursion infinie sur les policies de la table profiles
-- On remplace la requête directe par l'appel à la fonction SECURITY DEFINER `is_super_admin()`

DROP POLICY IF EXISTS "Les SUPER_ADMIN peuvent tout lire" ON public.profiles;
CREATE POLICY "Les SUPER_ADMIN peuvent tout lire" 
ON public.profiles FOR SELECT USING (public.is_super_admin());

DROP POLICY IF EXISTS "Les SUPER_ADMIN peuvent tout modifier" ON public.profiles;
CREATE POLICY "Les SUPER_ADMIN peuvent tout modifier" 
ON public.profiles FOR ALL USING (public.is_super_admin());
