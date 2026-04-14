import React from 'react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-16 pt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
          <span className="bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] bg-clip-text text-transparent">
            Politique RGPD
          </span>
        </h1>
        <p className="mb-10 text-gray-600">
          Comment nous collectons, utilisons et protegez vos donnees personnelles.
        </p>

        <div className="space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <section>
            <h2 className="mb-2 text-2xl font-bold">1. Donnees collecteess</h2>
            <p className="text-gray-700">
              Nous collectons uniquement les donnees necessaires a la gestion des reservations:
              identite, contact, details de l evenement et informations de paiement via prestataire
              securise.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-bold">2. Finalites du traitement</h2>
            <p className="text-gray-700">
              Les donnees sont utilisees pour confirmer les reservations, communiquer avec vous,
              assurer le suivi administratif et respecter nos obligations legales.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-bold">3. Droit a l oubli</h2>
            <p className="text-gray-700">
              Vous pouvez demander la suppression de vos donnees personnelles. Sauf obligation
              legale de conservation, nous procederons a l effacement dans les meilleurs delais.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-bold">4. Cookies</h2>
            <p className="text-gray-700">
              Nous utilisons des cookies techniques indispensables au fonctionnement du site.
              Les cookies non essentiels ne sont actives qu apres votre consentement explicite.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-bold">5. Vos droits</h2>
            <p className="text-gray-700">
              Vous disposez d un droit d acces, de rectification, de limitation, d opposition et
              de portabilite de vos donnees. Contact: privacy@funkidz.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
