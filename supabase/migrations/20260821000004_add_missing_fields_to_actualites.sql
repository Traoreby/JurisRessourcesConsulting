-- Migration pour ajouter les champs manquants à public.actualites selon le design public
ALTER TABLE public.actualites
ADD COLUMN IF NOT EXISTS extrait TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS auteur TEXT DEFAULT 'JRC';
