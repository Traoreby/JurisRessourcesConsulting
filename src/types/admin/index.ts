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
export type FormationStatut = "actif" | "inactif";

export interface Formation {
  id: string;
  titre: string;
  description: string;
  duree: string;
  publicCible: string;
  contenu: string;
  image?: string;
  statut: FormationStatut;
  ordre: number;
  createdAt: string;
}

// ---- Services ----
export type ServiceStatut = "publie" | "masque";

export interface Service {
  id: string;
  titre: string;
  description: string;
  icone?: string;
  categorie: string;
  contenu: string;
  ordre: number;
  statut: ServiceStatut;
  createdAt: string;
}

// ---- Partenaires ----
export type PartnerStatut = "actif" | "inactif";

export interface Partner {
  id: string;
  nom: string;
  logo?: string;
  description?: string;
  siteWeb?: string;
  statut: PartnerStatut;
  ordre: number;
  createdAt: string;
}

// ---- Actualités ----
export type ActualiteStatut = "publie" | "brouillon";

export interface Actualite {
  id: string;
  titre: string;
  contenu: string;
  image?: string;
  categorie: string;
  date: string;
  statut: ActualiteStatut;
  createdAt: string;
}

// ---- Publicités / Annonces ----
export type PubliciteStatut = "actif" | "inactif";

export interface Publicite {
  id: string;
  titre: string;
  texte: string;
  image?: string;
  texteBouton?: string;
  urlBouton?: string;
  dateDebut?: string;
  dateFin?: string;
  statut: PubliciteStatut;
  createdAt: string;
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

// ---- Utilisateur Admin ----
export interface AdminUser {
  id: string;
  email: string;
  nom: string;
  role: "admin" | "editeur";
}
