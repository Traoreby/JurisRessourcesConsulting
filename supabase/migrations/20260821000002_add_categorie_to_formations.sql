-- Migration to add 'categorie' column to public.formations

ALTER TABLE public.formations 
ADD COLUMN IF NOT EXISTS categorie TEXT DEFAULT 'Non catégorisé';
