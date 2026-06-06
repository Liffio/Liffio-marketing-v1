"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function HelpContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("help-name") as HTMLInputElement).value,
      email: (form.elements.namedItem("help-email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("help-subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("help-message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "help-contact" }),
      });
      if (res.ok || res.status === 409) {
        setEmail(data.email);
        setState("success");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
        <p className="text-sm text-gray-600">
          We&apos;ll reply within 24 hours to <strong>{email}</strong>. Check your spam folder if you don&apos;t hear back.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <h2
        className="text-2xl font-bold text-gray-900 mb-2"
        style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
      >
        Still need help?
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Send us a message and we&apos;ll get back to you within 24 hours.
      </p>

      {state === "error" && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Something went wrong. Please try again or email us at support@liffio.com.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="help-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id="help-name"
              name="help-name"
              type="text"
              required
              disabled={state === "loading"}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4259f0] focus:border-transparent disabled:opacity-60"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="help-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="help-email"
              name="help-email"
              type="email"
              required
              disabled={state === "loading"}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4259f0] focus:border-transparent disabled:opacity-60"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="help-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            id="help-subject"
            name="help-subject"
            type="text"
            required
            disabled={state === "loading"}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4259f0] focus:border-transparent disabled:opacity-60"
            placeholder="What do you need help with?"
          />
        </div>
        <div>
          <label htmlFor="help-message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            id="help-message"
            name="help-message"
            rows={4}
            required
            disabled={state === "loading"}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4259f0] focus:border-transparent resize-none disabled:opacity-60"
            placeholder="Describe your issue in detail..."
          />
        </div>
        <button
          type="submit"
          id="help-submit"
          disabled={state === "loading"}
          className="w-full rounded-xl px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-md [background:linear-gradient(135deg,#7c5af3,#4259f0)] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {state === "loading" ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending…
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}
