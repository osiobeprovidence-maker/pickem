import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const sections = [
  {
    title: 'Using Pick&apos;em',
    body:
      'You may use Pick&apos;em to request deliveries, proxy pickups, shopping assistance, and related campus logistics services. You agree to provide accurate details for every request and to use the platform lawfully.',
  },
  {
    title: 'Accounts and Access',
    body:
      'You are responsible for maintaining the confidentiality of your account, login credentials, and any proxy or pickup codes generated through the platform. Keep your account information current and notify us if you suspect unauthorized access.',
  },
  {
    title: 'Delivery Responsibilities',
    body:
      'Customers, runners, and businesses each share responsibility for clear request details, proper handling of items, and respectful conduct. Fees, fulfillment timing, and availability may vary based on location, traffic, campus rules, or runner capacity.',
  },
  {
    title: 'Restricted Items',
    body:
      'Do not use Pick&apos;em to move prohibited, illegal, dangerous, or restricted items. We may cancel requests, suspend accounts, or report activity that appears unsafe or unlawful.',
  },
  {
    title: 'Payments and Charges',
    body:
      'Where charges apply, you agree to pay the applicable service fee, delivery fee, or platform charge shown in the app. Separate item reimbursement may still be due directly to a runner where the request type requires it.',
  },
  {
    title: 'Service Availability',
    body:
      'We aim to keep the platform available and reliable, but we do not guarantee uninterrupted access. Features, fees, and service coverage may change as the product evolves.',
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <section className="px-5 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-32">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-full bg-apple-gray-50 px-4 py-1.5 text-[12px] font-semibold text-apple-gray-300 sm:inline-block">
            Legal
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-apple-gray-500 sm:text-5xl md:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-apple-gray-300 sm:text-lg">
            These terms explain how Pick&apos;em works, what we expect from users, and how the platform may be used across campus delivery flows.
          </p>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-apple-gray-200">
            Last updated: April 5, 2026
          </p>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-4xl border-t border-apple-gray-100">
          {sections.map((section) => (
            <div key={section.title} className="grid gap-5 border-b border-apple-gray-100 py-8 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-10 sm:py-10">
              <h2 className="text-xl font-bold text-apple-gray-500 sm:text-2xl">{section.title}</h2>
              <p className="text-sm font-medium leading-relaxed text-apple-gray-300 sm:text-base">{section.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 sm:pb-28">
        <div className="mx-auto flex max-w-4xl flex-col gap-5 rounded-[2rem] bg-apple-gray-500 p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:rounded-[2.5rem] sm:p-10">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Need clarification?</h2>
            <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-apple-gray-200 sm:text-base">
              If you have questions about platform usage, support, or compliance, our team can point you to the right answer.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-apple-gray-500 transition-colors hover:bg-apple-gray-50"
          >
            Contact Support
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
