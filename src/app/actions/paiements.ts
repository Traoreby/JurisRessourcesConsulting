"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function checkIsSuperAdmin() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Non autorisé");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!profile || profile.role !== "SUPER_ADMIN") {
    throw new Error("Accès refusé. Réservé au SUPER_ADMIN.");
  }
  return session.user.id;
}

export async function declarerPaiementWave(
  paiementId: string, 
  referenceWave: string, 
  datePaiement: string
) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error("Non autorisé");

  // RLS will enforce that the admin can only update their own 'a_payer' payments
  const { error } = await supabase
    .from("paiements")
    .update({
      statut: "en_attente",
      reference_wave: referenceWave,
      date_paiement: datePaiement,
    })
    .eq("id", paiementId)
    .eq("admin_id", session.user.id)
    .eq("statut", "a_payer");

  if (error) {
    if (error.code === '23505') {
      throw new Error("Cette référence Wave a déjà été utilisée pour un autre paiement.");
    }
    throw new Error(error.message);
  }

  revalidatePath("/admin/paiements");
  return { success: true };
}

export async function validerPaiement(paiementId: string) {
  const superAdminId = await checkIsSuperAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("paiements")
    .update({
      statut: "paye",
      date_validation: new Date().toISOString(),
      super_admin_id: superAdminId,
    })
    .eq("id", paiementId)
    .eq("statut", "en_attente");

  if (error) throw new Error(error.message);

  revalidatePath("/admin/paiements");
  return { success: true };
}

export async function genererEcheance(
  adminId: string, 
  periode: string, 
  montant: number, 
  dateEcheance: string
) {
  await checkIsSuperAdmin();
  const supabase = await createClient();

  // Try to insert. If unique constraint violation, it will throw an error
  const { error } = await supabase
    .from("paiements")
    .insert([{
      admin_id: adminId,
      periode,
      montant,
      date_echeance: dateEcheance,
      statut: "a_payer"
    }]);

  if (error) {
    if (error.code === '23505') {
      throw new Error(`Une échéance existe déjà pour cet administrateur sur la période "${periode}".`);
    }
    throw new Error(error.message);
  }

  revalidatePath("/admin/paiements");
  return { success: true };
}


export async function supprimerPaiement(paiementId: string) {
  await checkIsSuperAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("paiements")
    .delete()
    .eq("id", paiementId);

  if (error) throw new Error(error.message);

  revalidatePath(/admin/paiements);
  return { success: true };
}
