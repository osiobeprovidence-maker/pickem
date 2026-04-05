import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const sections = [
  {
    title: 'Information We Collect',
    body:
      'We collect the account details, delivery details, profile information, and activity needed to operate Pick&apos;em. This may include your name, email address, username, request history, contact details, and service interactions.',
  },
  {
    title: 'How We Use It',
    body:
      'We use your information to create accounts, match delivery requests, communicate service updates, improve platform reliability, prevent abuse, and support customer care.',
  },
  {
    title: 'Sharing and Access',
    body:
      'We share only the minimum relevant information needed to complete a request, such as pickup, drop-off, and contact details with the assigned runner or business when required for fulfillment.',
  },
  {
    title: 'Security and Verification',
    body:
      'We use reasonable administrative and technical measures to protect the platform and user data. Security controls may include authentication, account verification, moderation, and abuse detection measures.',
  },
  {
    title: 'Retention',
    body:
      'We keep data for as long as needed to operate the service, resolve disputes, comply with legal obligations, and maintain appropriate business records.',
  },
  {
    title: 'Your Choices',
    body:
      'You may update your profile details, request support, and contact us about account or privacy concerns. Some information may need to be retained where required for safety, compliance, or transactional history.',
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <section className="px-5 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-32">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-apple-gray-50 px-4 py-1.5 text-[12px] font-semibold text-apple-gray-300">
            <ShieldCheck className="h-4 w-4" />
            Privacy
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-apple-gray-500 sm:text-5xl md:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-apple-gray-300 sm:text-lg">
            This page explains what information Pick&apos;em collects, why we collect it, and how we use it to power secure campus delivery experiences.
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
        <div className="mx-auto flex max-w-4xl flex-col gap-5 rounded-[2rem] bg-apple-gray-50 p-8 sm:flex-row sm:items-center sm:justify-between sm:rounded-[2.5rem] sm:p-10">
          <div>
            <h2 className="text-2xl font-bold text-apple-gray-500 sm:text-3xl">Questions about privacy?</h2>
            <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-apple-gray-300 sm:text-base">
              Reach out if you need help understanding how your data is used or if you need assistance with your account information.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-apple-gray-500 px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
