// ================================================================
// DONNÉES TEMPORAIRES — À REMPLACER PAR SUPABASE
// Ces données servent uniquement à rendre l'UI lisible.
// Elles ne sont PAS présentées comme données réelles du cabinet.
// ================================================================

import type {
  Article,
  Formation,
  Service,
  Demande,
  CabinetSettings,
} from "@/types/admin";

export const mockArticles: Article[] = [
  {
    id: "1",
    titre: "Les obligations comptables des PME en Côte d'Ivoire",
    slug: "obligations-comptables-pme-cote-ivoire",
    extrait:
      "Un tour d'horizon des obligations comptables essentielles pour les PME ivoiriennes en 2024.",
    contenu: "",
    categorie: "Comptabilité",
    auteur: "JRC",
    datePublication: "2024-11-15",
    statut: "publie",
    createdAt: "2024-11-10",
    updatedAt: "2024-11-15",
  },
  {
    id: "2",
    titre: "Comment optimiser votre charge fiscale légalement",
    slug: "optimiser-charge-fiscale-legalement",
    extrait:
      "Stratégies d'optimisation fiscale conformes au droit ivoirien pour réduire votre imposition.",
    contenu: "",
    categorie: "Fiscalité",
    auteur: "JRC",
    datePublication: "2024-10-20",
    statut: "publie",
    createdAt: "2024-10-15",
    updatedAt: "2024-10-20",
  },
  {
    id: "3",
    titre: "Guide du droit du travail ivoirien pour les employeurs",
    slug: "guide-droit-travail-ivoirien-employeurs",
    extrait:
      "Les règles essentielles du Code du travail ivoirien que tout employeur doit connaître.",
    contenu: "",
    categorie: "Droit du Travail",
    auteur: "JRC",
    datePublication: undefined,
    statut: "brouillon",
    createdAt: "2024-12-01",
    updatedAt: "2024-12-01",
  },
];

export const mockFormations: Formation[] = [
  {
    id: "1",
    titre: "Maîtrise de la paie et des déclarations sociales",
    slug: "maitrise-paie",
    description:
      "Formation pratique pour maîtriser le traitement de la paie et les obligations sociales en Côte d'Ivoire.",
    duree: "2 jours",
    public_cible: "DRH, gestionnaires de paie",
    categorie: "Ressources Humaines",
    contenu: "",
    statut: "actif",
    ordre: 1,
    created_at: "2024-10-01",
  },
  {
    id: "2",
    titre: "Fiscalité des entreprises : optimiser sans risque",
    slug: "fiscalite-entreprises",
    description:
      "Comprendre les leviers d'optimisation fiscale tout en restant en stricte conformité avec la loi.",
    duree: "2 jours",
    public_cible: "Dirigeants, DAF, comptables",
    categorie: "Fiscalité",
    contenu: "",
    statut: "actif",
    ordre: 2,
    created_at: "2024-10-01",
  },
  {
    id: "3",
    titre: "Droit du travail et gestion des conflits",
    slug: "droit-travail",
    description:
      "Sécurisez vos relations de travail en maîtrisant les règles essentielles du droit social ivoirien.",
    duree: "1 jour",
    public_cible: "RH, managers, chefs d'entreprise",
    categorie: "Juridique",
    contenu: "",
    statut: "actif",
    ordre: 3,
    created_at: "2024-10-01",
  },
];

export const mockServices: Service[] = [
  {
    id: "1",
    titre: "Assistance Juridique",
    slug: "assistance-juridique",
    description:
      "Rédaction d'actes, création d'entreprises, contentieux et conseil juridique.",
    icone: "Scale",
    categorie: "Juridique",
    contenu: "",
    prestations: ["Prestation 1"],
    ordre: 1,
    statut: "publie",
    created_at: "2024-01-01",
  },
  {
    id: "2",
    titre: "Accompagnement Comptable",
    slug: "accompagnement-comptable",
    description: "Tenue comptable, bilans, déclarations et optimisation.",
    icone: "Calculator",
    categorie: "Comptabilité",
    contenu: "",
    prestations: ["Prestation 1"],
    ordre: 2,
    statut: "publie",
    created_at: "2024-01-01",
  },
  {
    id: "3",
    titre: "Conseil Fiscal",
    slug: "conseil-fiscal",
    description:
      "Audit fiscal, assistance à contrôle et ingénierie fiscale.",
    icone: "Landmark",
    categorie: "Fiscalité",
    contenu: "",
    prestations: ["Prestation 1"],
    ordre: 3,
    statut: "publie",
    created_at: "2024-01-01",
  },
  {
    id: "4",
    titre: "Ressources Humaines",
    slug: "ressources-humaines",
    description:
      "Recrutement, paie, contrats et gestion des conflits.",
    icone: "Users",
    categorie: "RH",
    contenu: "",
    prestations: ["Prestation 1"],
    ordre: 4,
    statut: "publie",
    created_at: "2024-01-01",
  },
];

export const mockDemandes: Demande[] = [
  {
    id: "1",
    nom: "Kouassi Abo",
    telephone: "+225 07 00 00 00 00",
    email: "kouassi@example.com",
    objet: "Demande de consultation juridique",
    message:
      "Je souhaite obtenir un rendez-vous pour une consultation concernant la création de mon entreprise.",
    service: "Assistance Juridique",
    type: "consultation",
    date: "2024-12-10",
    statut: "nouvelle", created_at: "2024-12-10T00:00:00Z",
  },
  {
    id: "2",
    nom: "Adjoua Konan",
    telephone: "+225 05 00 00 00 00",
    email: "adjoua@example.com",
    objet: "Question sur la comptabilité",
    message:
      "J'ai besoin d'aide pour la tenue de ma comptabilité mensuelle.",
    service: "Accompagnement Comptable",
    type: "contact",
    date: "2024-12-09",
    statut: "en_cours", created_at: "2024-12-09T00:00:00Z",
  },
  {
    id: "3",
    nom: "Koffi Bamba",
    telephone: "+225 01 00 00 00 00",
    email: "koffi@example.com",
    objet: "Inscription formation paie",
    message:
      "Je souhaite m'inscrire à la formation sur la maîtrise de la paie.",
    type: "contact",
    date: "2024-12-08",
    statut: "traitee", created_at: "2024-12-08T00:00:00Z",
  },
  {
    id: "4",
    nom: "Aya Coulibaly",
    telephone: "+225 05 11 22 33 44",
    email: "aya@example.com",
    objet: "Audit fiscal",
    message: "Besoin d'un audit fiscal pour mon entreprise.",
    service: "Conseil Fiscal",
    type: "consultation",
    date: "2024-12-07",
    statut: "archivee", created_at: "2024-12-07T00:00:00Z",
  },
];

export const mockSettings: CabinetSettings = {
  nom: "Juris Ressources Consulting",
  description:
    "Cabinet d'assistance et accompagnement juridique, comptable, fiscal et en ressources humaines basé à Grand-Bassam, Côte d'Ivoire.",
  telephone1: "+225 27 31 94 88 63",
  telephone2: "+225 07 49 43 61 70",
  email: "info.jrcsarl@gmail.com",
  adresse:
    "Maison Mak, Derrière la pharmacie Mockey-ville, Grand-Bassam, Côte d'Ivoire",
  whatsapp: "https://wa.me/message/T27HENDTW4LZJ1",
  facebook: "https://www.facebook.com/share/19GSpywnZN/",
  tiktok: "https://www.tiktok.com/@juris.ressources",
  linkedin: "",
  horaires: "Lundi – Vendredi : 08h00 – 17h30",
  seoTitle:
    "Juris Ressources Consulting | Cabinet Juridique, Fiscal, Comptable & RH",
  seoDescription:
    "Cabinet d'assistance et accompagnement juridique, comptable, fiscal et en ressources humaines basé à Grand-Bassam, Côte d'Ivoire.",
};

export const mockStats = {
  articlesPublies: mockArticles.filter((a) => a.statut === "publie").length,
  articlesBrouillon: mockArticles.filter((a) => a.statut === "brouillon")
    .length,
  formations: mockFormations.length,
  services: mockServices.length,
  partenaires: 0,
  demandesNouvelles: mockDemandes.filter((d) => d.statut === "nouvelle").length,
  demandesTotal: mockDemandes.length,
};
