import { NextRequest, NextResponse } from "next/server";
import {
  AdminImageUploadError,
  uploadAdminImage,
} from "@/lib/storage/admin-image-upload";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Requête d'upload invalide." },
      { status: 400 }
    );
  }

  try {
    const result = await uploadAdminImage({
      file: formData.get("file"),
      folder: formData.get("folder"),
    });

    return NextResponse.json({ url: result.publicUrl });
  } catch (error) {
    if (error instanceof AdminImageUploadError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("[api/admin/upload-image] Erreur inattendue:", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer l'image pour le moment." },
      { status: 500 }
    );
  }
}
