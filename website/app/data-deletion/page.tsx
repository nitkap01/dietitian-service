import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Delete your data · Hale N Hearty Diet Clinic",
  description: "How to ask Hale N Hearty Diet Clinic to delete your information, including WhatsApp, Instagram and Facebook messages.",
};

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <Navbar />
      <article className="mx-auto max-w-3xl px-5 pt-32 pb-20 text-[#1A1A2E] leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-bold text-[#3D2070]">Delete your data</h1>
        <p className="mt-6">You can ask us to delete the information we hold about you, including messages you sent us on WhatsApp, Instagram or Facebook.</p>
        <ol className="mt-6 list-decimal pl-6 space-y-2">
          <li>Send an email to <a className="text-[#5C3A9E] underline" href="mailto:contact@dietitianritikabahl.com?subject=Delete%20my%20data">contact@dietitianritikabahl.com</a> with the subject &ldquo;Delete my data&rdquo;, or send <strong>DELETE MY DATA</strong> to us on WhatsApp.</li>
          <li>Tell us the phone number or profile you used with us, so we can find your records.</li>
          <li>We confirm your request and delete your records within 30 days, and tell you when it is done.</li>
        </ol>
        <p className="mt-6">We may keep payment records where the law requires it. Messages remain in your own WhatsApp, Instagram or Facebook app; you can delete them there.</p>
        <p className="mt-6">See our <a className="text-[#5C3A9E] underline" href="/privacy">Privacy Policy</a> for more.</p>
      </article>
      <Footer />
    </main>
  );
}
