import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminPaiementsView } from "@/components/admin/paiements/AdminPaiementsView";
import { SuperAdminPaiementsView } from "@/components/admin/paiements/SuperAdminPaiementsView";

export const metadata = {
  title: "Paiements | Administration JRC",
};

export default async function PaiementsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, id, full_name, email")
    .eq("id", session.user.id)
    .single();

  if (!profile) {
    redirect("/admin/login");
  }

  // On récupère le paramètre wave_payment_number
  const { data: settings } = await supabase
    .from("settings")
    .select("wave_payment_number")
    .single();

  const waveNumber = settings?.wave_payment_number || "Numéro non configuré";

  if (profile.role === "SUPER_ADMIN") {
    return <SuperAdminPaiementsView currentUserId={profile.id} waveNumber={waveNumber} />;
  }

  return <AdminPaiementsView currentUserId={profile.id} waveNumber={waveNumber} />;
}
