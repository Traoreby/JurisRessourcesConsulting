-- ==============================================================================
-- Rate limiting persistant pour le formulaire de contact
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  identifier TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (identifier, window_start)
);

ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(
  p_identifier TEXT,
  p_max_requests INTEGER,
  p_window_seconds INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_request_count INTEGER;
BEGIN
  IF p_identifier IS NULL OR LENGTH(TRIM(p_identifier)) = 0 THEN
    RETURN FALSE;
  END IF;

  IF p_max_requests < 1 OR p_window_seconds < 1 THEN
    RETURN FALSE;
  END IF;

  v_window_start := TO_TIMESTAMP(
    FLOOR(EXTRACT(EPOCH FROM NOW()) / p_window_seconds) * p_window_seconds
  );

  INSERT INTO public.contact_rate_limits (identifier, window_start, request_count)
  VALUES (p_identifier, v_window_start, 1)
  ON CONFLICT (identifier, window_start)
  DO UPDATE SET
    request_count = public.contact_rate_limits.request_count + 1,
    updated_at = NOW()
  RETURNING request_count INTO v_request_count;

  DELETE FROM public.contact_rate_limits
  WHERE window_start < NOW() - INTERVAL '2 days';

  RETURN v_request_count <= p_max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE ALL ON FUNCTION public.check_contact_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_contact_rate_limit(TEXT, INTEGER, INTEGER) TO service_role;
