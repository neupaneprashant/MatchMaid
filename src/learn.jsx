import React from "react";

export default function LearnPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-4xl font-bold text-center text-rose-600">Learn How MatchMaid Works</h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto">
        Whether you're hiring or offering services, this page will guide you through using MatchMaid safely and effectively.
      </p>

      {/* How It Works */}
      <section>
        <h2 className="text-2xl font-semibold text-rose-500">📘 How It Works</h2>
        <ul className="list-decimal list-inside mt-3 space-y-2 text-gray-700">
          <li><strong>Browse Profiles:</strong> Discover verified maids in your area.</li>
          <li><strong>Book a Match:</strong> Schedule services based on availability and needs.</li>
          <li><strong>Leave a Review:</strong> Help the community with your feedback.</li>
        </ul>
      </section>

      {/* Finding the Right Match */}
      <section>
        <h2 className="text-2xl font-semibold text-rose-500">🔍 Finding the Right Maid</h2>
        <p className="mt-2 text-gray-700">
          Use filters to sort by rating, location, and skill. Verified badges help identify trusted professionals.
        </p>
      </section>

      {/* Booking & Payment */}
      <section>
        <h2 className="text-2xl font-semibold text-rose-500">📅 Booking & Payment</h2>
        <p className="mt-2 text-gray-700">
          Book directly from the maid's profile using our scheduling system. Communicate clearly about pricing and timing through the in-app chat.
        </p>
      </section>

      {/* Reviews */}
      <section>
        <h2 className="text-2xl font-semibold text-rose-500">🌟 Reviews & Ratings</h2>
        <p className="mt-2 text-gray-700">
          After a task is completed, both parties can rate and review. Reviews help others make informed decisions and keep the platform trustworthy.
        </p>
      </section>

      {/* Tips for a Great Experience */}
      <section>
        <h2 className="text-2xl font-semibold text-rose-500">✨ Tips for a Great Experience</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
          <li>Be clear about your needs and expectations.</li>
          <li>Respect each other’s time and privacy.</li>
          <li>Use in-app communication for security.</li>
        </ul>
      </section>

      {/* First Match Expectations */}
      <section>
        <h2 className="text-2xl font-semibold text-rose-500">🚀 Your First Match: What to Expect</h2>
        <p className="mt-2 text-gray-700">
          You’ll receive a confirmation, a chat window will open, and your task will be added to your bookings. Check our safety tips before your first appointment!
        </p>
      </section>

      {/* Do's and Don'ts */}
      <section>
        <h2 className="text-2xl font-semibold text-rose-500">⚠️ Do's and Don’ts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-gray-700">
          <div>
            <h3 className="font-semibold text-green-600">✔ Do</h3>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Read reviews before booking.</li>
              <li>Communicate clearly.</li>
              <li>Leave a review after every match.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-600">❌ Don’t</h3>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Share your personal contact info too early.</li>
              <li>Book services outside the platform.</li>
              <li>Ignore suspicious behavior — report it!</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section (Optional) */}
      <section>
        <h2 className="text-2xl font-semibold text-rose-500">❓ Frequently Asked Questions</h2>
        <div className="mt-2 space-y-4 text-gray-700">
          <div>
            <strong>Q: Can I cancel a booking?</strong>
            <p>No,bookings cannot be canceled once the payment is processed for now.</p>
          </div>
          <div>
            <strong>Q: Is my payment secure?</strong>
            <p>A: All payments go through our encrypted system and are protected.</p>
          </div>
          <div>
            <strong>Q: What if I have a problem with a match?</strong>
            <p>A: Contact our support team or report the user directly through their profile.You can email pne007@latech.edu for support.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
