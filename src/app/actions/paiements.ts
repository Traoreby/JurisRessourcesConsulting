"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import * as z from "zod";

type AdminRole = "ADMIN" | "SUPER_ADMIN";

const MAX_PAYMENT_AMOUNT = 10_000_000;

const paiementIdSchema = z.string().uuid("Identifiant de paiement invalide.");

const isoDateTimeSchema = z.string().datetime({
  offset: true,
  message: "Date invalide.",
});

const declarerPaiementSchema = z.object({
  paiementId: paiementIdSchema,
  referenceWave: z.string()
    .trim()
    .min(3, "Référence Wave invalide.")
    .max(100, "Référence Wave trop longue."),
  datePaiement: isoDateTimeSchema.refine(
    (value) => Date.parse(value) <= Date.now() + 5 * 60 * 1000,
    "La date de paiement ne peut pas être dans le futur."
  ),
});

const genererEcheanceSchema = z.object({
  adminId: z.string().uuid("Administrateur cible invalide."),
  periode: z.string()
    .trim()
    .min(2, "Période invalide.")
    .max(80, "Période trop longue."),
  montant: z.number()
    .refine(Number.isFinite, "Montant invalide.")
    .int("Le montant doit être un entier.")
    .min(1, "Le montant doit être supérieur à 0.")
    .max(MAX_PAYMENT_AMOUNT, "Le montant est trop élevé."),
  dateEcheance: isoDateTimeSchema.refine(
    (value) => {
      const time = Date.parse(value);
      return Number.isFinite(time) &&
        time >= Date.UTC(2020, 0, 1) &&
        time <= Date.UTC(2100, 0, 1);
    },
    "Date d'échéance invalide."
  ),
});

function parseActionInput<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message || "Données invalides.");
  }

  return result.data;
}

function isAdminRole(role: unknown): role is AdminRole {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

async function getAuthenticatedAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Non autorisé.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || !isAdminRole(profile.role)) {
    throw new Error("Accès refusé.");
  }

  return { supabase, user, role: profile.role };
}

async function checkIsSuperAdmin() {
  const admin = await getAuthenticatedAdmin();

  if (admin.role !== "SUPER_ADMIN") {
    throw new Error("Accès refusé. Réservé au SUPER_ADMIN.");
  }

  return admin;
}

export async function declarerPaiementWave(
  paiementId: string,
  referenceWave: string,
  datePaiement: string
) {
  const input = parseActionInput(declarerPaiementSchema, {
    paiementId,
    referenceWave,
    datePaiement,
  });
  const { supabase, user } = await getAuthenticatedAdmin();

  const { error } = await supabase
    .from("paiements")
    .update({
      statut: "en_attente",
      reference_wave: input.referenceWave,
      date_paiement: input.datePaiement,
    })
    .eq("id", input.paiementId)
    .eq("admin_id", user.id)
    .eq("statut", "a_payer")
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Cette référence Wave a déjà été utilisée pour un autre paiement.");
    }
    if (error.code === "PGRST116") {
      throw new Error("Paiement introuvable ou action non autorisée.");
    }
    console.error("[paiements] Erreur déclaration Wave:", error);
    throw new Error("Impossible de déclarer ce paiement.");
  }

  revalidatePath("/admin/paiements");
  return { success: true };
}

export async function validerPaiement(paiementId: string) {
  const validPaiementId = parseActionInput(paiementIdSchema, paiementId);
  const { supabase, user } = await checkIsSuperAdmin();

  const { error } = await supabase
    .from("paiements")
    .update({
      statut: "paye",
      date_validation: new Date().toISOString(),
      super_admin_id: user.id,
    })
    .eq("id", validPaiementId)
    .eq("statut", "en_attente")
    .select("id")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Paiement introuvable, déjà traité ou action non autorisée.");
    }
    console.error("[paiements] Erreur validation:", error);
    throw new Error("Impossible de valider ce paiement.");
  }

  revalidatePath("/admin/paiements");
  return { success: true };
}

export async function genererEcheance(
  adminId: string,
  periode: string,
  montant: number,
  dateEcheance: string
) {
  const input = parseActionInput(genererEcheanceSchema, {
    adminId,
    periode,
    montant,
    dateEcheance,
  });
  const { supabase } = await checkIsSuperAdmin();

  const { data: targetProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", input.adminId)
    .single();

  if (profileError || !targetProfile || targetProfile.role !== "ADMIN") {
    throw new Error("Administrateur cible invalide.");
  }

  const { error } = await supabase
    .from("paiements")
    .insert([{
      admin_id: input.adminId,
      periode: input.periode,
      montant: input.montant,
      date_echeance: input.dateEcheance,
      statut: "a_payer",
    }])
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(`Une échéance existe déjà pour cet administrateur sur la période "${input.periode}".`);
    }
    console.error("[paiements] Erreur génération échéance:", error);
    throw new Error("Impossible de générer cette échéance.");
  }

  revalidatePath("/admin/paiements");
  return { success: true };
}

export async function supprimerPaiement(paiementId: string) {
  const validPaiementId = parseActionInput(paiementIdSchema, paiementId);
  const { supabase } = await checkIsSuperAdmin();

  const { error } = await supabase
    .from("paiements")
    .delete()
    .eq("id", validPaiementId)
    .select("id")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Paiement introuvable ou action non autorisée.");
    }
    console.error("[paiements] Erreur suppression:", error);
    throw new Error("Impossible de supprimer ce paiement.");
  }

  revalidatePath("/admin/paiements");
  return { success: true };
}
