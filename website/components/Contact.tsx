"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, ExternalLink, Send, CheckCircle } from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    label: "Call / WhatsApp",
    value: "+91 99993 83722",
    href: "tel:+919999383722",
    color: "#25D366",
    bg: "#E8F5E9",
  },
  {
    icon: Mail,
    label: "Email",
    value: "bahlritika123@gmail.com",
    href: "mailto:bahlritika123@gmail.com",
    color: "#5C3A9E",
    bg: "#EDE7F6",
  },
  {
    icon: ExternalLink,
    label: "Instagram",
    value: "@dt.ritikabahl",
    href: "https://www.instagram.com/dt.ritikabahl",
    color: "#E1306C",
    bg: "#FCE4EC",
  },
];

const conditions = [
  "Diabetes / Pre-Diabetes",
  "PCOS / Hormonal Issues",
  "Weight Loss",
  "Thyroid",
  "Pregnancy / Lactation",
  "Sports Nutrition",
  "Bariatric",
  "Other",
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    condition: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would POST to an API route or form service
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #EDE7F6 0%, #E8F5E9 100%)" }}
    >
      {/* Blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "#5C3A9E" }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "#7AB648" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "rgba(255,255,255,0.8)", color: "#5C3A9E" }}
          >
            Get In Touch
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Start Your{" "}
            <span style={{ color: "#5C3A9E" }}>Free Consultation</span>
          </h2>
          <p className="text-gray-700 text-lg max-w-xl mx-auto">
            Take the first step towards a healthier you. Fill in the form and Dt. Ritika will be
            in touch within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left – Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              {contactMethods.map((method) => (
                <a
                  key={method.label}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-white hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: method.bg }}
                  >
                    <method.icon size={22} style={{ color: method.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">{method.label}</p>
                    <p className="text-base font-bold text-gray-900">{method.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Availability note */}
            <div className="bg-white rounded-2xl p-6 border border-white shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Consultation Availability</h3>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span className="font-semibold">9:00 AM – 7:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold">10:00 AM – 5:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold text-gray-400">Closed</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 italic">
                * International time zones accommodated on request
              </p>
            </div>
          </motion.div>

          {/* Right – Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-white"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <CheckCircle size={60} className="text-[#2D6B4F]" />
                <h3 className="text-2xl font-black text-gray-900">Message Sent!</h3>
                <p className="text-gray-600">
                  Thank you for reaching out. Dt. Ritika will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm text-[#5C3A9E] underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="text-xl font-black text-gray-900">Book Your Free Consultation</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                      Your Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Priya Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5C3A9E] focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                      Phone / WhatsApp *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5C3A9E] focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5C3A9E] focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Primary Health Concern *
                  </label>
                  <select
                    required
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5C3A9E] focus:ring-2 focus:ring-purple-100 transition-all bg-white"
                  >
                    <option value="">Select your primary goal...</option>
                    {conditions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Tell us more (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share any relevant medical history, recent test results, or specific goals..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5C3A9E] focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-base transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg, #5C3A9E, #3D2070)",
                    boxShadow: "0 6px 25px rgba(92,58,158,0.4)",
                  }}
                >
                  <Send size={18} />
                  Book My Free Consultation
                </button>

                <p className="text-xs text-gray-400 text-center">
                  🔒 Your information is private and will never be shared.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
