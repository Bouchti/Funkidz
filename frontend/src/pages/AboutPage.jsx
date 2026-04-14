import React from 'react';
import { Sparkles, Users, ShieldCheck } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-16 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
            <span className="bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] bg-clip-text text-transparent">
              A propos de Funkidz
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Nous accompagnons les familles, ecoles et entreprises avec des animations enfants
            sur mesure, creatives et securisees.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <Sparkles className="mb-3 h-8 w-8 text-[var(--fun-pink)]" />
            <h2 className="mb-2 text-xl font-bold">Experience festive</h2>
            <p className="text-gray-600">
              Des concepts d animations adaptes a chaque age, avec une preparation en amont
              pour garantir un evenement fluide.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <Users className="mb-3 h-8 w-8 text-[var(--fun-purple)]" />
            <h2 className="mb-2 text-xl font-bold">Equipe qualifiee</h2>
            <p className="text-gray-600">
              Nos animateurs sont formes a la gestion de groupe, a la pedagogie ludique
              et aux exigences des evenements enfants.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <ShieldCheck className="mb-3 h-8 w-8 text-[var(--fun-blue)]" />
            <h2 className="mb-2 text-xl font-bold">Cadre securise</h2>
            <p className="text-gray-600">
              Nous priorisons la securite, la ponctualite et la qualite de service pour
              offrir une experience rassurante aux parents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
