import { redirect } from "next/navigation";

// Redirection automatique vers /admin/dashboard
export default function AdminPage() {
  redirect("/admin/dashboard");
}
