"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  email: z.string().email("Adresse email invalide"),
  serviceType: z.string().min(1, "Veuillez sélectionner un service"),
  subject: z.string().min(5, "L'objet doit contenir au moins 5 caractères"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type FormValues = z.infer<typeof formSchema>;

export function ConsultationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    // Simulation d'envoi à une API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form data:", data);
    setIsSuccess(true);
    setIsSubmitting(false);
    reset();
    
    // Cacher le message de succès après 5 secondes
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-premium border border-slate-100">
      <h2 className="text-3xl font-bold text-primary mb-8 tracking-tight">Demander une consultation</h2>
      
      {isSuccess && (
        <div className="mb-8 p-6 bg-green-50 text-green-800 rounded-xl flex items-start gap-4 border border-green-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="shrink-0 mt-0.5 text-green-600" size={24} />
          <div>
            <p className="font-bold text-lg">Demande envoyée avec succès !</p>
            <p className="text-green-700 mt-1">Notre équipe vous contactera dans les plus brefs délais.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 relative">
            <label htmlFor="fullName" className="text-sm font-bold text-primary">Nom complet *</label>
            <input
              id="fullName"
              {...register("fullName")}
              className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent focus:bg-white outline-none transition-all ${errors.fullName ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="Jean Dupont"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.fullName.message}</p>}
          </div>
          
          <div className="space-y-2 relative">
            <label htmlFor="phone" className="text-sm font-bold text-primary">Téléphone *</label>
            <input
              id="phone"
              {...register("phone")}
              className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent focus:bg-white outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="+225 00 00 00 00"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2 relative">
            <label htmlFor="email" className="text-sm font-bold text-primary">Email *</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent focus:bg-white outline-none transition-all ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="jean.dupont@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-2 relative">
            <label htmlFor="serviceType" className="text-sm font-bold text-primary">Service concerné *</label>
            <select
              id="serviceType"
              {...register("serviceType")}
              className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent focus:bg-white outline-none transition-all ${errors.serviceType ? 'border-red-500' : 'border-slate-200'}`}
            >
              <option value="">Sélectionnez un service</option>
              <option value="juridique">Assistance Juridique</option>
              <option value="comptable">Accompagnement Comptable</option>
              <option value="fiscal">Conseil Fiscal</option>
              <option value="rh">Ressources Humaines</option>
              <option value="formation">Formation</option>
              <option value="autre">Autre</option>
            </select>
            {errors.serviceType && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.serviceType.message}</p>}
          </div>
        </div>

        <div className="space-y-2 relative pt-2">
          <label htmlFor="subject" className="text-sm font-bold text-primary">Objet de la demande *</label>
          <input
            id="subject"
            {...register("subject")}
            className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent focus:bg-white outline-none transition-all ${errors.subject ? 'border-red-500' : 'border-slate-200'}`}
            placeholder="Création d'entreprise"
          />
          {errors.subject && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.subject.message}</p>}
        </div>

        <div className="space-y-2 relative pt-2">
          <label htmlFor="message" className="text-sm font-bold text-primary">Message *</label>
          <textarea
            id="message"
            rows={5}
            {...register("message")}
            className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent focus:bg-white outline-none transition-all resize-y ${errors.message ? 'border-red-500' : 'border-slate-200'}`}
            placeholder="Décrivez votre besoin..."
          />
          {errors.message && <p className="text-red-500 text-xs mt-1 absolute -bottom-3">{errors.message.message}</p>}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Envoi en cours...
              </>
            ) : (
              "Envoyer ma demande"
            )}
          </button>
        </div>
        <p className="text-xs font-medium text-slate-500 text-center mt-6">
          Vos données personnelles sont traitées de manière strictement confidentielle.
        </p>
      </form>
    </div>
  );
}
