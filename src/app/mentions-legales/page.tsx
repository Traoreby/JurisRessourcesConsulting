import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | Juris Ressources Consulting – Grand-Bassam",
  description: "Mentions légales et informations juridiques du site Juris Ressources Consulting (JRC SARL), cabinet situé à Grand-Bassam, Côte d'Ivoire.",
  keywords: "mentions légales Juris Ressources Consulting, JRC SARL, cabinet juridique Grand-Bassam, informations légales Côte d'Ivoire",
};

export default function MentionsLegales() {
  return (
    <div className="py-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">Mentions Légales</h1>
          <p className="text-slate-600 font-medium">Informations légales et réglementaires concernant le site Juris Ressources Consulting.</p>
        </div>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-premium border border-slate-100 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-10 text-slate-700 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b border-slate-100 pb-2">Éditeur du site</h2>
              <div className="space-y-2">
                <p>Le site <strong>Juris Ressources Consulting (JRC)</strong> est édité par la société <strong>JRC SARL</strong>.</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                  <li><strong>Forme juridique :</strong> SARLU</li>
                  <li><strong>Capital social :</strong> <span className="bg-amber-100 text-amber-800 px-1 rounded">[Capital Social à compléter par le cabinet]</span></li>
                  <li><strong>Siège social :</strong> Maison Mak, Derrière la pharmacie Mockey-ville, Grand-Bassam, Côte d'Ivoire</li>
                  <li><strong>RCCM :</strong> <span className="bg-amber-100 text-amber-800 px-1 rounded">[Numéro RCCM à compléter]</span></li>
                  <li><strong>Numéro de Compte Contribuable (NCC) :</strong> <span className="bg-amber-100 text-amber-800 px-1 rounded">[Numéro NCC à compléter]</span></li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b border-slate-100 pb-2">Directeur de la publication</h2>
              <p>
                <strong>Directeur de la publication :</strong> <span className="bg-amber-100 text-amber-800 px-1 rounded">[Nom du dirigeant à compléter]</span>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b border-slate-100 pb-2">Coordonnées de contact</h2>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <strong>Téléphones :</strong>{" "}
                  <a href="tel:+2252731948863" className="text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded px-1" aria-label="Appeler le +225 27 31 94 88 63">
                    +225 27 31 94 88 63
                  </a>
                  {" / "}
                  <a href="tel:+2250749436170" className="text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded px-1" aria-label="Appeler le +225 07 49 43 61 70">
                    +225 07 49 43 61 70
                  </a>
                </li>
                <li>
                  <strong>Email :</strong>{" "}
                  <a href="mailto:info.jrcsarl@gmail.com" className="text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded px-1" aria-label="Envoyer un email à info.jrcsarl@gmail.com">
                    info.jrcsarl@gmail.com
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b border-slate-100 pb-2">Hébergement</h2>
              <p className="text-slate-600">
                Ce site est hébergé par <strong>Vercel Inc.</strong><br />
                440 N Barranca Ave #4133<br />
                Covina, CA 91723<br />
                États-Unis
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b border-slate-100 pb-2">Propriété intellectuelle</h2>
              <p className="text-slate-600">
                L'ensemble de ce site relève de la législation ivoirienne et internationale sur le droit d'auteur et la propriété intellectuelle. 
                Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques. 
                Toute reproduction partielle ou totale sans l'autorisation expresse de JRC SARL est strictement interdite.
              </p>
            </section>
            
          </div>
        </div>
      </div>
    </div>
  );
}
