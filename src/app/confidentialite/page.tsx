import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Juris Ressources Consulting",
  description: "Politique de confidentialité et gestion des données personnelles de Juris Ressources Consulting.",
};

export default function Confidentialite() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary mb-8">Politique de Confidentialité</h1>
      
      <div className="space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Collecte des données</h2>
          <p>
            Dans le cadre de l'utilisation de notre site, Juris Ressources Consulting peut être amené à collecter des données personnelles (via le formulaire de contact ou de demande de consultation). Ces données sont strictement destinées au traitement de votre demande.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">2. Utilisation des données</h2>
          <p>
            Les informations recueillies ne sont utilisées que pour communiquer avec vous et vous fournir les services demandés. Elles ne seront en aucun cas cédées, vendues ou louées à des tiers sans votre consentement explicite.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">3. Droits des utilisateurs</h2>
          <p>
            Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition sur vos données personnelles. Vous pouvez exercer ce droit en nous contactant à l'adresse suivante : <strong>info.jrcsarl@gmail.com</strong>.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">4. Cookies</h2>
          <p>
            Notre site peut utiliser des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visites. Vous pouvez configurer votre navigateur pour refuser ces cookies.
          </p>
        </section>
      </div>
    </div>
  );
}
