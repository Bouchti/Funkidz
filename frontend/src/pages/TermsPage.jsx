import React from 'react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-16 pt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
          <span className="bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] bg-clip-text text-transparent">
            Termes et Conditions
          </span>
        </h1>
        <p className="mb-10 text-gray-600">
          Contenu type a personnaliser selon vos engagements commerciaux et obligations legales.
        </p>

        <div className="space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <section>
            <h2 className="mb-2 text-2xl font-bold">1. Objet du service</h2>
            <p className="text-gray-700">
              Funkidz propose des prestations d animation pour enfants. Le detail de chaque formule,
              sa duree et son tarif sont disponibles sur la page Services.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-bold">2. Reservation et paiement</h2>
            <p className="text-gray-700">
              Toute reservation est confirmee apres validation des informations et, le cas echeant,
              versement d un acompte. Le solde doit etre regle avant ou le jour de l evenement selon
              les conditions convenues.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-bold">3. Annulation et report</h2>
            <p className="text-gray-700">
              Les demandes d annulation ou de report doivent etre formulees par e-mail. Les modalites
              de remboursement et frais eventuels dependent du delai avant l evenement.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-bold">4. Responsabilites</h2>
            <p className="text-gray-700">
              Le client s engage a assurer un cadre securise pendant la prestation. Funkidz s engage
              a fournir une animation professionnelle, sous reserve des contraintes techniques et
              securitaires du lieu.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-bold">5. Donnees personnelles</h2>
            <p className="text-gray-700">
              Le traitement des donnees personnelles est detaille dans la page RGPD. L utilisation du
              site implique l acceptation de ces conditions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
