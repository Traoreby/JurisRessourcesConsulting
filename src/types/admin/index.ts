// ================================================================
// Types Admin — Juris Ressources Consulting
// À connecter à Supabase lors de l'étape suivante.
// ================================================================

// ---- Articles ----
export type ArticleStatut = "publie" | "brouillon" | "archive";

export interface Article {
  id: string;
  titre: string;
  slug: string;
  extrait: string;
  contenu: string;
  image?: string;
  categorie: string;
  auteur: string;
  datePublication?: string;
  statut: ArticleStatut;
  createdAt: string;
  updatedAt: string;
}

// ---- Formations ----
export type FormationStatut = "actif" | "inactif" | "brouillon";

export interface Formation {
  id: string;
  titre: string;
  slug: string;
  description: string;
  duree: string;
  public_cible: string;
  contenu: string;
  image?: string;
  categorie: string;
  statut: FormationStatut;
  ordre: number;
  created_at: string;
  updated_at?: string;
}

// ---- Services ----
export type ServiceStatut = "publie" | "brouillon";

export interface Service {
  id: string;
  titre: string;
  slug: string;
  description: string;
  icone?: string;
  categorie: string;
  contenu: string;
  prestations: string[];
  ordre: number;
  statut: ServiceStatut;
  created_at: string;
  updated_at?: string;
}

// ---- Partenaires ----
export type PartnerStatut = "actif" | "inactif";

export interface Partner {
  id: string;
  nom: string;
  logo?: string;
  description?: string;
  site_web?: string;
  statut: PartnerStatut;
  ordre: number;
  created_at: string;
  updated_at?: string;
}

// ---- Actualités ----
export type ActualiteStatut = "publie" | "brouillon";

export interface Actualite {
  id: string;
  titre: string;
  slug: string;
  extrait?: string;
  auteur?: string;
  contenu: string;
  image?: string;
  categorie: string;
  date: string;
  statut: ActualiteStatut;
  created_at: string;
  updated_at?: string;
}

// ---- Publicités / Annonces ----
export type PubliciteStatut = "actif" | "inactif" | "brouillon";

export interface Publicite {
  id: string;
  titre: string;
  texte: string;
  image?: string;
  texte_bouton?: string;
  url_bouton?: string;
  date_debut?: string;
  date_fin?: string;
  statut: PubliciteStatut;
  created_at: string;
  updated_at?: string;
}

// ---- Demandes (Contact + Consultation) ----
export type DemandeStatut = "nouvelle" | "en_cours" | "traitee" | "archivee";
export type DemandeTtype = "contact" | "consultation";

export interface Demande {
  id: string;
  nom: string;
  telephone?: string;
  email: string;
  objet?: string;
  message: string;
  service?: string;
  type: DemandeTtype;
  date: string;
  statut: DemandeStatut;
  created_at: string;
  updated_at?: string;
}

// ---- Paramètres du cabinet ----
export interface CabinetSettings {
  nom: string;
  description: string;
  telephone1: string;
  telephone2?: string;
  email: string;
  adresse: string;
  whatsapp: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  horaires: string;
  seoTitle?: string;
  seoDescription?: string;
}

// ---- Utilisateur Admin (Profiles) ----
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: "SUPER_ADMIN" | "ADMIN";
  created_at?: string;
  updated_at?: string;
}


// ---- Paiements ----
export type PaiementStatut = "a_payer" | "en_attente" | "paye";

export interface Paiement {
  id: string;
  admin_id: string;
  periode: string;
  montant: number;
  devise: string;
  date_echeance: string;
  date_paiement?: string;
  statut: PaiementStatut;
  reference_wave?: string;
  date_validation?: string;
  super_admin_id?: string;
  created_at: string;
  updated_at?: string;
  // Relation jointe (Profiles)
  profiles?: Profile;
}
