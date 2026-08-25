import {
  ADMIN_IMAGE_UPLOAD_ACCEPT,
  type AdminImageUploadFolder,
} from "./upload-constants";

export { ADMIN_IMAGE_UPLOAD_ACCEPT };

export async function uploadAdminImage(file: File, folder: AdminImageUploadFolder): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/admin/upload-image", {
    method: "POST",
    body: formData,
  });
  const payload = await response.json().catch(() => null) as { url?: string; error?: string } | null;

  if (!response.ok || !payload?.url) {
    throw new Error(payload?.error || "L'image a été refusée.");
  }

  return payload.url;
}
