"use client";

import { useState, useRef, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

// ── Schéma de validation côté client ─────────────────────────────────────────
const formSchema = z.object({
  fullName:    z.string().min(2,  "Le nom doit contenir au moins 2 caractères"),
  phone:       z.string().min(8,  "Numéro de téléphone invalide"),
  email:       z.string().email("Adresse email invalide"),
  serviceType: z.string().min(1,  "Veuillez sélectionner un service"),
  subject:     z.string().min(5,  "L'objet doit contenir au moins 5 caractères"),
  message:     z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type FormValues = z.infer<typeof formSchema>;

// ── Classes réutilisables ──────────────────────────────────────────────────────
const inputBase =
  "w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent focus:bg-white outline-none transition-all";
const inputValid   = "border-slate-200";
const inputInvalid = "border-red-500 bg-red-50/30";

interface ConsultationFormProps {
  /** Titre affiché dans la carte du formulaire. Défaut : "Demander une consultation". */
  title?: string;
}

function ConsultationFormInner({ title = "Demander une consultation" }: ConsultationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,    setIsSuccess]    = useState(false);
  const [apiError,     setApiError]     = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Lecture du paramètre 'subject' depuis l'URL pour le préremplissage
  const searchParams = useSearchParams();
  const defaultSubject = searchParams.get("subject") || "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ 
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: defaultSubject,
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setApiError(null);
    setIsSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          _gotcha: honeypotRef.current?.value ?? "",
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setApiError(
          json?.error ??
          "Une erreur est survenue. Veuillez réessayer ou nous contacter directement."
        );
        return;
      }

      setIsSuccess(true);
      reset();
    } catch {
      setApiError(
        "Impossible de se connecter au serveur. Vérifiez votre connexion Internet ou contactez-nous directement."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-premium border border-slate-100">
      <h2 className="text-3xl font-bold text-primary mb-8 tracking-tight">
        {title}
      </h2>

      {/* Message de succès */}
      {isSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="mb-8 p-6 bg-green-50 text-green-800 rounded-xl flex items-start gap-4 border border-green-200 shadow-sm"
        >
          <CheckCircle2 className="shrink-0 mt-0.5 text-green-600" size={24} aria-hidden="true" />
          <div>
            <p className="font-bold text-lg">Demande envoyée avec succès !</p>
            <p className="text-green-700 mt-1">
              Votre demande a bien été envoyée. Notre équipe vous répondra généralement sous 24 à 48 heures ouvrées.
            </p>
          </div>
        </div>
      )}

      {/* Message d'erreur API */}
      {apiError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-8 p-6 bg-red-50 text-red-800 rounded-xl flex items-start gap-4 border border-red-200 shadow-sm"
        >
          <AlertCircle className="shrink-0 mt-0.5 text-red-600" size={24} aria-hidden="true" />
          <div>
            <p className="font-bold text-lg">Erreur lors de l&apos;envoi</p>
            <p className="text-red-700 mt-1">{apiError}</p>
          </div>
        </div>
      )}

      {/* Honeypot anti-spam — invisible pour les humains */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", opacity: 0, top: 0, left: 0, height: 0, width: 0, overflow: "hidden", pointerEvents: "none" }}
      >
        <label htmlFor="_gotcha">Ne pas remplir ce champ</label>
        <input
          ref={honeypotRef}
          id="_gotcha"
          name="_gotcha"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        aria-busy={isSubmitting}
        noValidate
      >
        {/* Nom + Téléphone */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-bold text-primary">
              Nom complet <span aria-hidden="true">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              aria-required="true"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              {...register("fullName")}
              className={`${inputBase} ${errors.fullName ? inputInvalid : inputValid}`}
              placeholder="Jean Dupont"
            />
            {errors.fullName && (
              <p id="fullName-error" role="alert" className="text-red-500 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-bold text-primary">
              Téléphone <span aria-hidden="true">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              aria-required="true"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              {...register("phone")}
              className={`${inputBase} ${errors.phone ? inputInvalid : inputValid}`}
              placeholder="+225 00 00 00 00"
            />
            {errors.phone && (
              <p id="phone-error" role="alert" className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Email + Service */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-primary">
              Email <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
              className={`${inputBase} ${errors.email ? inputInvalid : inputValid}`}
              placeholder="jean.dupont@email.com"
            />
            {errors.email && (
              <p id="email-error" role="alert" className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="serviceType" className="text-sm font-bold text-primary">
              Service concerné <span aria-hidden="true">*</span>
            </label>
            <select
              id="serviceType"
              aria-required="true"
              aria-invalid={!!errors.serviceType}
              aria-describedby={errors.serviceType ? "serviceType-error" : undefined}
              {...register("serviceType")}
              className={`${inputBase} ${errors.serviceType ? inputInvalid : inputValid}`}
            >
              <option value="">Sélectionnez un service</option>
              <option value="juridique">Assistance Juridique</option>
              <option value="comptable">Accompagnement Comptable</option>
              <option value="fiscal">Conseil Fiscal</option>
              <option value="rh">Ressources Humaines</option>
              <option value="formation">Formation</option>
              <option value="autre">Autre</option>
            </select>
            {errors.serviceType && (
              <p id="serviceType-error" role="alert" className="text-red-500 text-xs mt-1">
                {errors.serviceType.message}
              </p>
            )}
          </div>
        </div>

        {/* Objet */}
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-bold text-primary">
            Objet de la demande <span aria-hidden="true">*</span>
          </label>
          <input
            id="subject"
            type="text"
            aria-required="true"
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            {...register("subject")}
            className={`${inputBase} ${errors.subject ? inputInvalid : inputValid}`}
            placeholder="Création d'entreprise"
          />
          {errors.subject && (
            <p id="subject-error" role="alert" className="text-red-500 text-xs mt-1">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-bold text-primary">
            Message <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            {...register("message")}
            className={`${inputBase} resize-y ${errors.message ? inputInvalid : inputValid}`}
            placeholder="Décrivez votre besoin..."
          />
          {errors.message && (
            <p id="message-error" role="alert" className="text-red-500 text-xs mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Bouton submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            {isSubmitting ? (
              <>
                <div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span>Envoi en cours...</span>
              </>
            ) : (
              "Envoyer ma demande"
            )}
          </button>
        </div>

        <p className="text-xs font-medium text-slate-500 text-center">
          Vos données personnelles sont traitées de manière strictement confidentielle.
        </p>
      </form>
    </div>
  );
}

export function ConsultationForm(props: ConsultationFormProps) {
  return (
    <Suspense fallback={
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-premium border border-slate-100 min-h-[500px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" aria-label="Chargement du formulaire" />
      </div>
    }>
      <ConsultationFormInner {...props} />
    </Suspense>
  );
}
