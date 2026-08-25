import "server-only";

import { randomUUID } from "crypto";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdminEnv } from "@/lib/env/server";
import {
  ADMIN_IMAGE_UPLOAD_FOLDERS,
  MAX_ADMIN_IMAGE_SIZE_BYTES,
  PUBLIC_ASSETS_BUCKET,
  type AdminImageUploadFolder,
} from "./upload-constants";

const IMAGE_TYPES = {
  "image/jpeg": {
    extension: "jpg",
    matches: (bytes: Uint8Array) =>
      bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
  "image/png": {
    extension: "png",
    matches: (bytes: Uint8Array) =>
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a,
  },
  "image/webp": {
    extension: "webp",
    matches: (bytes: Uint8Array) =>
      bytes.length >= 12 &&
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50,
  },
} as const;

type AllowedImageMimeType = keyof typeof IMAGE_TYPES;

export class AdminImageUploadError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "AdminImageUploadError";
  }
}

function isAllowedFolder(value: unknown): value is AdminImageUploadFolder {
  return typeof value === "string" &&
    ADMIN_IMAGE_UPLOAD_FOLDERS.includes(value as AdminImageUploadFolder);
}

function isAllowedMimeType(value: string): value is AllowedImageMimeType {
  return Object.hasOwn(IMAGE_TYPES, value);
}

async function requireAdminOrSuperAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new AdminImageUploadError(401, "Vous devez être connecté pour envoyer une image.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    (profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN")
  ) {
    throw new AdminImageUploadError(403, "Vous n'avez pas l'autorisation d'envoyer une image.");
  }
}

function validateImageFile(file: File, bytes: Uint8Array): AllowedImageMimeType {
  if (file.size <= 0) {
    throw new AdminImageUploadError(400, "Le fichier image est vide.");
  }

  if (file.size > MAX_ADMIN_IMAGE_SIZE_BYTES) {
    throw new AdminImageUploadError(413, "L'image dépasse la taille maximale autorisée de 5 Mo.");
  }

  if (!isAllowedMimeType(file.type)) {
    throw new AdminImageUploadError(400, "Format refusé. Utilisez une image JPEG, PNG ou WebP.");
  }

  if (!IMAGE_TYPES[file.type].matches(bytes)) {
    throw new AdminImageUploadError(400, "Le contenu du fichier ne correspond pas au format annoncé.");
  }

  return file.type;
}

export async function uploadAdminImage(input: { file: unknown; folder: unknown }) {
  await requireAdminOrSuperAdmin();

  if (!(input.file instanceof File)) {
    throw new AdminImageUploadError(400, "Aucun fichier image valide n'a été reçu.");
  }

  if (!isAllowedFolder(input.folder)) {
    throw new AdminImageUploadError(400, "Destination d'upload invalide.");
  }

  const arrayBuffer = await input.file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const mimeType = validateImageFile(input.file, bytes);
  const extension = IMAGE_TYPES[mimeType].extension;
  const path = `${input.folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
  const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseAdminEnv();
  const supabaseAdmin = createSupabaseAdminClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await supabaseAdmin.storage
    .from(PUBLIC_ASSETS_BUCKET)
    .upload(path, bytes, {
      cacheControl: "31536000",
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    console.error("[admin-image-upload] Erreur Supabase Storage:", error);
    throw new AdminImageUploadError(500, "L'image n'a pas pu être envoyée.");
  }

  const { data } = supabaseAdmin.storage
    .from(PUBLIC_ASSETS_BUCKET)
    .getPublicUrl(path);

  return {
    publicUrl: data.publicUrl,
  };
}
