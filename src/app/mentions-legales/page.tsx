import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | Juris Ressources Consulting",
  description: "Mentions légales du site Juris Ressources Consulting.",
};

export default function MentionsLegales() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary mb-8">Mentions Légales</h1>
      
      <div className="space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Éditeur du site</h2>
          <p>
            Le site <strong>Juris Ressources Consulting (JRC)</strong> est édité par la société JRC SARL.<br />
            Siège social : Maison Mak, Grand-Bassam, Derrière la pharmacie Mockey-ville, Côte d'Ivoire.<br />
            Téléphone : +225 27 31 94 88 63 / +225 05 76 70 22 10<br />
            Email : info.jrcsarl@gmail.com
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">2. Hébergement</h2>
          <p>
            Ce site est hébergé par Vercel Inc.<br />
            440 N Barranca Ave #4133<br />
            Covina, CA 91723<br />
            États-Unis
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">3. Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation ivoirienne et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </p>
        </section>
      </div>
    </div>
  );
}
