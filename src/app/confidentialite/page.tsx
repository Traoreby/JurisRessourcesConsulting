import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Juris Ressources Consulting – Grand-Bassam",
  description: "Politique de confidentialité et gestion des données personnelles de Juris Ressources Consulting, conformément à la Loi n° 2013-450 de la Côte d'Ivoire.",
  keywords: "politique de confidentialité, données personnelles, Juris Ressources Consulting, JRC SARL, loi 2013-450 Côte d'Ivoire",
};

export default function Confidentialite() {
  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">Politique de Confidentialité</h1>
          <p className="text-slate-600 font-medium">Gestion et protection de vos données personnelles chez Juris Ressources Consulting.</p>
        </div>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-premium border border-slate-100 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-10 text-slate-700 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b border-slate-100 pb-2">1. Cadre Réglementaire</h2>
              <p>
                La présente politique s'inscrit dans le cadre du respect de la législation ivoirienne en vigueur, et notamment de la <strong>Loi n° 2013-450 du 19 juin 2013</strong> relative à la protection des données à caractère personnel. Juris Ressources Consulting s'engage à assurer le meilleur niveau de protection à vos données personnelles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b border-slate-100 pb-2">2. Collecte et Finalité des Données</h2>
              <p>
                Dans le cadre de l'utilisation de notre site, nous collectons certaines données lorsque vous remplissez nos formulaires de <strong>contact</strong> ou de <strong>demande de consultation</strong>.
              </p>
              <p className="mt-2">Les catégories de données collectées sont :</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600 mt-2">
                <li>Nom complet</li>
                <li>Numéro de téléphone</li>
                <li>Adresse email</li>
                <li>Objet de la demande et contenu de votre message</li>
              </ul>
              <p className="mt-4">
                <strong>Finalité :</strong> Ces données sont strictement utilisées pour traiter votre demande, répondre à vos questions et assurer le suivi de votre dossier.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b border-slate-100 pb-2">3. Traitement et Services Tiers</h2>
              <p>
                Vos informations ne sont ni cédées, ni vendues, ni louées à des tiers. Cependant, pour assurer le fonctionnement technique du site, nous nous appuyons sur certains services tiers :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2 mt-4 text-slate-600">
                <li>
                  <strong>Gestion des emails (Resend) :</strong> L'envoi des formulaires de contact est assuré par l'API Resend. Les données de formulaire transitent de manière sécurisée par leurs serveurs uniquement à des fins de routage vers notre boîte de réception.
                </li>
                <li>
                  <strong>Cartographie (Google Maps) :</strong> La page Contact intègre une carte interactive fournie par Google Maps. L'utilisation de cette carte implique que Google peut collecter votre adresse IP et placer des cookies conformément à sa propre politique de confidentialité.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b border-slate-100 pb-2">4. Durée de conservation</h2>
              <p>
                Vos données personnelles issues des formulaires de contact ne sont pas stockées dans une base de données sur notre site. Elles sont conservées dans notre messagerie professionnelle uniquement pour la durée nécessaire au traitement de votre requête et à notre relation commerciale.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b border-slate-100 pb-2">5. Vos Droits</h2>
              <p>
                Conformément à la loi, vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression des données vous concernant.
              </p>
              <p className="mt-4">
                Pour exercer ces droits, vous pouvez nous contacter à tout moment par email à l'adresse :{" "}
                <a href="mailto:info.jrcsarl@gmail.com" className="text-accent hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-accent rounded px-1" aria-label="Envoyer un email à info.jrcsarl@gmail.com pour exercer vos droits">
                  info.jrcsarl@gmail.com
                </a>
              </p>
            </section>
            
          </div>
        </div>
      </div>
    </div>
  );
}
