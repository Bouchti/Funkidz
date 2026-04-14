import React from 'react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-5xl font-bold mb-8">
          <span className="bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] bg-clip-text text-transparent">
            Privacy Policy (GDPR)
          </span>
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">Last updated: January 20, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              FunKids Animation ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information in compliance with the EU General Data Protection Regulation (GDPR).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide when booking our services:<br/>
              - Name and contact details (email, phone number)<br/>
              - Event details (date, location, number of guests)<br/>
              - Payment information (processed securely through third-party providers)<br/>
              - Communication preferences
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              Your information is used to:<br/>
              - Process and manage your bookings<br/>
              - Communicate about your events<br/>
              - Send booking confirmations and reminders<br/>
              - Improve our services<br/>
              - Comply with legal obligations
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Your Rights Under GDPR</h2>
            <p className="text-gray-700 mb-4">
              You have the right to:<br/>
              - Access your personal data<br/>
              - Rectify inaccurate data<br/>
              - Request deletion of your data<br/>
              - Object to processing of your data<br/>
              - Data portability<br/>
              - Withdraw consent at any time
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, typically for 3 years after your last event for accounting and legal purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
            <p className="text-gray-700 mb-4">
              Our website uses essential cookies to ensure proper functionality. We do not use tracking or marketing cookies without your explicit consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
            <p className="text-gray-700">
              For any questions about this Privacy Policy or to exercise your GDPR rights, please contact us at:<br/>
              Email: privacy@funkids.be<br/>
              Phone: +32 123 456 789<br/>
              Address: Brussels, Belgium
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
