-- Migration to add missing fields to public.services

ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS categorie TEXT DEFAULT 'Non catégorisé',
ADD COLUMN IF NOT EXISTS prestations JSONB DEFAULT '[]'::jsonb;
