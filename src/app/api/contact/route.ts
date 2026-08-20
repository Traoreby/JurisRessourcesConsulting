import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import * as z from "zod";

// ── Schéma de validation serveur ──────────────────────────────────────────────
const contactSchema = z.object({
  fullName:    z.string().min(2,  "Nom invalide"),
  phone:       z.string().min(8,  "Numéro invalide"),
  email:       z.string().email("Email invalide"),
  serviceType: z.string().min(1,  "Service requis"),
  subject:     z.string().min(5,  "Objet trop court"),
  message:     z.string().min(10, "Message trop court"),
  _gotcha:     z.string().optional(), // champ honeypot anti-spam
});

// ── Labels lisibles pour les services ─────────────────────────────────────────
const SERVICE_LABELS: Record<string, string> = {
  juridique: "Assistance Juridique",
  comptable: "Accompagnement Comptable",
  fiscal:    "Conseil Fiscal",
  rh:        "Ressources Humaines",
  formation: "Formation",
  autre:     "Autre",
};

// ── Échappement HTML pour éviter l'injection dans les emails ──────────────────
function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Route POST ────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // Vérification de la clé API
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("re_xxx")) {
    console.error("[API/contact] RESEND_API_KEY non configurée.");
    return NextResponse.json(
      { error: "Service d'email non configuré. Veuillez nous contacter directement." },
      { status: 500 }
    );
  }

  // Lecture du body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  // Validation serveur
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Les données soumises sont invalides. Veuillez vérifier le formulaire." },
      { status: 400 }
    );
  }

  const { fullName, phone, email, serviceType, subject, message, _gotcha } = result.data;

  // Honeypot : si rempli → bot détecté, réponse silencieuse
  if (_gotcha) {
    return NextResponse.json({ success: true });
  }

  const resend       = new Resend(apiKey);
  const serviceLabel = SERVICE_LABELS[serviceType] ?? esc(serviceType);
  const contactEmail = process.env.CONTACT_EMAIL ?? "info.jrcsarl@gmail.com";
  const fromEmail    = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  try {
    // ── Email reçu par JRC ────────────────────────────────────────────────────
    const { error: sendError } = await resend.emails.send({
      from:    `Juris Ressources Consulting <${fromEmail}>`,
      to:      [contactEmail],
      replyTo: email,
      subject: `Nouvelle demande de consultation — ${serviceLabel}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:8px;">
          <h2 style="color:#0F172A;border-bottom:3px solid #C5A880;padding-bottom:12px;margin-bottom:20px;">
            Nouvelle demande de consultation
          </h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:10px 8px;font-weight:bold;color:#0F172A;width:170px;vertical-align:top;">Nom :</td>
              <td style="padding:10px 8px;color:#475569;">${esc(fullName)}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:10px 8px;font-weight:bold;color:#0F172A;vertical-align:top;">Téléphone :</td>
              <td style="padding:10px 8px;color:#475569;">${esc(phone)}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:10px 8px;font-weight:bold;color:#0F172A;vertical-align:top;">Email :</td>
              <td style="padding:10px 8px;color:#475569;">${esc(email)}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:10px 8px;font-weight:bold;color:#0F172A;vertical-align:top;">Service concerné :</td>
              <td style="padding:10px 8px;color:#475569;">${serviceLabel}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:10px 8px;font-weight:bold;color:#0F172A;vertical-align:top;">Objet :</td>
              <td style="padding:10px 8px;color:#475569;">${esc(subject)}</td>
            </tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f8fafc;border-left:4px solid #C5A880;border-radius:4px;">
            <p style="font-weight:bold;color:#0F172A;margin:0 0 8px;">Message :</p>
            <p style="color:#475569;margin:0;white-space:pre-wrap;">${esc(message)}</p>
          </div>
          <p style="margin-top:24px;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;">
            Demande envoyée depuis le site Juris Ressources Consulting — Grand-Bassam, Côte d'Ivoire
          </p>
        </div>
      `,
    });

    if (sendError) {
      console.error("[API/contact] Erreur Resend (JRC):", sendError);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi. Veuillez réessayer ou nous contacter directement." },
        { status: 500 }
      );
    }

    // ── Email de confirmation au client ───────────────────────────────────────
    await resend.emails.send({
      from:    `Juris Ressources Consulting <${fromEmail}>`,
      to:      [email],
      subject: "Confirmation de votre demande — Juris Ressources Consulting",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:8px;">
          <h2 style="color:#0F172A;border-bottom:3px solid #C5A880;padding-bottom:12px;margin-bottom:20px;">
            Votre demande a bien été reçue
          </h2>
          <p style="color:#475569;font-size:15px;">Bonjour ${esc(fullName)},</p>
          <p style="color:#475569;font-size:15px;line-height:1.6;">
            Nous avons bien reçu votre demande de consultation auprès de
            <strong>Juris Ressources Consulting</strong> concernant : <em>${serviceLabel}</em>.
          </p>
          <div style="margin:20px 0;padding:16px;background:#f8fafc;border-left:4px solid #C5A880;border-radius:4px;">
            <p style="margin:0 0 6px;color:#0F172A;font-weight:bold;">Récapitulatif de votre demande</p>
            <p style="margin:4px 0;color:#475569;font-size:14px;"><strong>Service :</strong> ${serviceLabel}</p>
            <p style="margin:4px 0;color:#475569;font-size:14px;"><strong>Objet :</strong> ${esc(subject)}</p>
          </div>
          <p style="color:#475569;font-size:15px;line-height:1.6;">
            Notre équipe reviendra vers vous généralement sous <strong>24 à 48 heures ouvrées</strong>.
          </p>
          <p style="color:#475569;font-size:15px;line-height:1.6;">
            Pour toute urgence, vous pouvez nous joindre directement au :<br/>
            <strong>+225 27 31 94 88 63</strong> — <strong>+225 07 49 43 61 70</strong>
          </p>
          <p style="color:#475569;font-size:15px;margin-top:24px;">Cordialement,</p>
          <p style="color:#0F172A;font-weight:bold;font-size:15px;margin:0;">
            Juris Ressources Consulting
          </p>
          <p style="color:#C5A880;font-size:13px;margin:4px 0 0;">
            Grand-Bassam, Côte d'Ivoire
          </p>
          <p style="margin-top:24px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;">
            Ce message a été envoyé automatiquement en réponse à votre demande sur le site de Juris Ressources Consulting.
            Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce message.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API/contact] Erreur inattendue:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer ou nous contacter directement par téléphone." },
      { status: 500 }
    );
  }
}
