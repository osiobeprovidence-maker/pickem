import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-white px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-block rounded-full bg-apple-gray-50 px-4 py-1.5 text-[12px] font-semibold text-apple-gray-300">
          Error 404
        </div>
        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-apple-gray-500 sm:text-5xl md:text-6xl">
          This page could not be found.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-apple-gray-300 sm:text-lg">
          The link may be outdated, incomplete, or the page may still be on its way. You can head back home or continue browsing the main site.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-apple-gray-500 px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            to="/how-it-works"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-apple-gray-200 bg-white px-6 py-3 text-sm font-bold text-apple-gray-500 transition-colors hover:bg-apple-gray-50 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            How It Works
          </Link>
        </div>
      </div>
    </div>
  );
}
