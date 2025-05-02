import React from "react";

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h1 className="text-4xl font-bold text-center text-rose-600">Safety at MatchMaid</h1>

      <section>
        <h2 className="text-2xl font-semibold text-rose-500">🔒 Our Commitment to Safety</h2>
        <p className="mt-2 text-gray-700">
          At MatchMaid, your safety is our top priority. We've implemented features and protocols to ensure a secure, respectful, and trusted experience for every user.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-rose-500">🛡️ Verified Profiles</h2>
        <p className="mt-2 text-gray-700">
          All service providers must pass our identity verification process. We require verified emails and facebook to sign up.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-rose-500">🌟 Review & Rating System</h2>
        <p className="mt-2 text-gray-700">
          Our rating system helps promote accountability. After each match,users can rate and review the maid.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-rose-500">🔔 Reporting & Blocking</h2>
        <p className="mt-2 text-gray-700">
          Feel uncomfortable or unsafe? You can easily report and block users directly in the app. Our moderation team takes action quickly on all reports.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-rose-500">📜 Community Guidelines</h2>
        <p className="mt-2 text-gray-700">
          We expect all users to behave respectfully and professionally. Violations of our community standards result in suspension or permanent bans.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-rose-500">👥 Safe Communication</h2>
        <p className="mt-2 text-gray-700">
          Always keep your communication within the app. Avoid sharing personal contact details until you’re comfortable.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-rose-500">📍 Safety Tips</h2>
        <ul className="mt-2 list-disc list-inside text-gray-700 space-y-1">
          <li>Let someone know when you're meeting a maid or customer for the first time.</li>
          <li>Use public or well-lit locations for first-time meetings.</li>
          <li>Trust your instincts. End interactions that make you feel uncomfortable.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-rose-500">📧 Contact Our Safety Team</h2>
        <p className="mt-2 text-gray-700">
          Have a concern? Reach out to our dedicated safety support at <a href="mailto:pne007@latech.edu" className="text-rose-600 underline">pne007@latech.edu</a>.
        </p>
      </section>
    </div>
  );
}
