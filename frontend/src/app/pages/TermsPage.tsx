import React from 'react';

export function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-5xl font-bold mb-8">
          <span className="bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] bg-clip-text text-transparent">
            Terms of Service
          </span>
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">Last updated: January 20, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using FunKids Animation services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Booking and Payment</h2>
            <p className="text-gray-700 mb-4">
              - All bookings require a 50% deposit to secure your date<br/>
              - Full payment is due 7 days before the event<br/>
              - Accepted payment methods include bank transfer, credit cards, and Bancontact<br/>
              - All prices are in EUR and include 21% VAT
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Cancellation Policy</h2>
            <p className="text-gray-700 mb-4">
              - Free cancellation up to 48 hours before the event<br/>
              - 50% refund for cancellations 24-48 hours before the event<br/>
              - No refund for cancellations within 24 hours of the event<br/>
              - Rescheduling is free up to 7 days before the event
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Service Delivery</h2>
            <p className="text-gray-700 mb-4">
              We guarantee professional service delivery. However, we reserve the right to substitute entertainers if necessary due to illness or unforeseen circumstances.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Liability</h2>
            <p className="text-gray-700 mb-4">
              FunKids Animation carries full liability insurance. We are not responsible for injuries occurring outside the direct supervision of our entertainers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Contact Information</h2>
            <p className="text-gray-700">
              For questions about these Terms of Service, please contact us at hello@funkids.be
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
