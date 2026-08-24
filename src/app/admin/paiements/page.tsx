import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminPaiementsView } from "@/components/admin/paiements/AdminPaiementsView";
import { SuperAdminPaiementsView } from "@/components/admin/paiements/SuperAdminPaiementsView";

export const metadata = {
  title: "Paiements | Administration JRC",
};

export default async function PaiementsPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, id, full_name, email")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/admin/login");
  }

  // On récupère uniquement le numéro Wave via une fonction protégée par rôle.
  const { data: wavePaymentNumber } = await supabase
    .rpc("get_wave_payment_number");

  const waveNumber = typeof wavePaymentNumber === "string" && wavePaymentNumber.trim()
    ? wavePaymentNumber
    : "Numéro non configuré";

  if (profile.role === "SUPER_ADMIN") {
    return <SuperAdminPaiementsView currentUserId={profile.id} waveNumber={waveNumber} />;
  }

  return <AdminPaiementsView currentUserId={profile.id} waveNumber={waveNumber} />;
}
