import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy · Dt. Ritika Bahl – Hale N Hearty Diet Clinic",
  description: "How Hale N Hearty Diet Clinic collects, uses and protects your information, including WhatsApp, Instagram and Facebook messages.",
};

const UPDATED = "9 October 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <Navbar />
      <article className="mx-auto max-w-3xl px-5 pt-32 pb-20 text-[#1A1A2E] leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-bold text-[#3D2070]">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {UPDATED}</p>

        <p className="mt-6">
          This policy explains how <strong>Ritika Bahl</strong>, trading as <strong>Hale N Hearty Diet Clinic</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;),
          G-147 GF, Pushkar Enclave G-Block, Paschim Vihar, Delhi 110063, India, handles your personal information when you visit
          dietitianritikabahl.com, contact us, or become a client — including when you message us on WhatsApp, Instagram or Facebook.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-[#5C3A9E]">What we collect</h2>
        <ul className="mt-3 list-disc pl-6 space-y-1">
          <li>Contact details: name, phone number, email, and your WhatsApp, Instagram or Facebook profile name and ID when you message us.</li>
          <li>Messages, photos and documents you send us (for example weight updates, meal photos, lab reports, payment screenshots).</li>
          <li>Health and lifestyle information you choose to share for your diet plan: age, height, weight and measurements, goals, food preferences, allergies, medical conditions, medicines and lab results.</li>
          <li>Package, appointment and payment records (amount, date, transaction reference). We do not store card or bank login details.</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-[#5C3A9E]">How we use it</h2>
        <ul className="mt-3 list-disc pl-6 space-y-1">
          <li>To prepare and send your personalised diet plans and progress reports.</li>
          <li>To send reminders you have agreed to: weekly check-ins, plan updates, consultation reminders, renewal reminders, and greetings.</li>
          <li>To reply to your messages and keep a record of your programme.</li>
          <li>To confirm payments and manage your package.</li>
        </ul>
        <p className="mt-3">We use your health information only to provide our dietitian services to you. We do not sell your information or use it for advertising.</p>

        <h2 className="mt-10 text-xl font-semibold text-[#5C3A9E]">Services we use</h2>
        <ul className="mt-3 list-disc pl-6 space-y-1">
          <li><strong>Meta (WhatsApp, Instagram, Facebook)</strong> — to send and receive messages. Meta&rsquo;s own privacy policy applies to its apps.</li>
          <li><strong>An AI service provider</strong> (such as OpenAI, Google or Anthropic, on paid business terms that do not use your data to train their models) — to help draft diet plans and read weights or payment details from photos you send. Dt. Ritika reviews every plan before it is sent.</li>
          <li><strong>Google Drive</strong> — to keep a private copy of your diet plans.</li>
          <li>Secure hosting and email providers that store our records and send emails.</li>
        </ul>
        <p className="mt-3">These providers process your information only to deliver their service to us.</p>

        <h2 className="mt-10 text-xl font-semibold text-[#5C3A9E]">How long we keep it</h2>
        <p className="mt-3">We keep your records while you are a client and for up to 3 years after your last package, so we can continue your care if you return, unless you ask us to delete them sooner or the law requires us to keep them longer (for example payment records).</p>

        <h2 className="mt-10 text-xl font-semibold text-[#5C3A9E]">Your choices and rights</h2>
        <ul className="mt-3 list-disc pl-6 space-y-1">
          <li>Stop reminders at any time: reply <strong>STOP</strong> on WhatsApp, or tell us.</li>
          <li>Ask for a copy of your information, ask us to correct it, or ask us to delete it — see <a className="text-[#5C3A9E] underline" href="/data-deletion">how to delete your data</a>.</li>
          <li>You have the rights given by India&rsquo;s Digital Personal Data Protection Act, 2023.</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-[#5C3A9E]">Security</h2>
        <p className="mt-3">Your records are stored on access-controlled systems available only to Dt. Ritika Bahl and her authorised staff. No method of storage or transmission is completely secure, but we take reasonable care to protect your information.</p>

        <h2 className="mt-10 text-xl font-semibold text-[#5C3A9E]">Contact</h2>
        <p className="mt-3">
          Email <a className="text-[#5C3A9E] underline" href="mailto:contact@dietitianritikabahl.com">contact@dietitianritikabahl.com</a> or
          call +91 99993 83722. We will reply within 30 days.
        </p>
      </article>
      <Footer />
    </main>
  );
}
