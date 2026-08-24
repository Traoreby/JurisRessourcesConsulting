-- ==============================================================================
-- Protection des settings sensibles et accès contrôlé au numéro Wave
-- ==============================================================================

DROP POLICY IF EXISTS "Public settings" ON public.settings;

REVOKE ALL ON public.settings FROM anon;
REVOKE ALL ON public.settings FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;

CREATE OR REPLACE VIEW public.public_settings AS
SELECT
  id,
  nom,
  description,
  telephone1,
  telephone2,
  email,
  adresse,
  whatsapp,
  facebook,
  tiktok,
  linkedin,
  horaires,
  seo_title,
  seo_description
FROM public.settings
WHERE id = TRUE;

GRANT SELECT ON public.public_settings TO anon;
GRANT SELECT ON public.public_settings TO authenticated;

CREATE OR REPLACE FUNCTION public.get_wave_payment_number()
RETURNS TEXT AS $$
DECLARE
  v_wave_payment_number TEXT;
BEGIN
  IF NOT public.is_admin_or_super() THEN
    RAISE EXCEPTION 'Not allowed' USING ERRCODE = '42501';
  END IF;

  SELECT wave_payment_number
  INTO v_wave_payment_number
  FROM public.settings
  WHERE id = TRUE;

  RETURN v_wave_payment_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE ALL ON FUNCTION public.get_wave_payment_number() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_wave_payment_number() TO authenticated;
