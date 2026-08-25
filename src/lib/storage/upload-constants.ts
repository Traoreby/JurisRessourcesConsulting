export const PUBLIC_ASSETS_BUCKET = "public-assets";

export const ADMIN_IMAGE_UPLOAD_FOLDERS = [
  "articles",
  "formations",
  "actualites",
  "publicites",
  "partners",
] as const;

export type AdminImageUploadFolder = typeof ADMIN_IMAGE_UPLOAD_FOLDERS[number];

export const ADMIN_IMAGE_UPLOAD_ACCEPT = "image/jpeg,image/png,image/webp";
export const MAX_ADMIN_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
