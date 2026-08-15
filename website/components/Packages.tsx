"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Globe, MapPin, Activity } from "lucide-react";

type Region = "india" | "international";

const packages = [
  {
    name: "Monthly Plan",
    inrPrice: "₹5,000",
    usdPrice: "$70",
    duration: "1 Month",
    tag: null,
    description: "Perfect for getting started and experiencing the Hale N Hearty approach.",
    features: [
      "Personalised diet plan",
      "Initial health assessment",
      "4 weekly check-ins",
      "WhatsApp support (Mon–Sat)",
      "Plan adjustments as needed",
      "Digital meal guides",
      "Recipe suggestions",
    ],
    cta: "Get Started",
    highlighted: false,
    borderColor: "border-gray-200",
  },
  {
    name: "2-Month Plan",
    inrPrice: "₹9,000",
    usdPrice: "$120",
    duration: "2 Months",
    tag: "Most Popular",
    description: "The sweet spot for real, measurable transformation with lasting habits.",
    features: [
      "Everything in Monthly",
      "Deeper health assessment",
      "8 weekly check-ins",
      "Priority WhatsApp support",
      "Lab report interpretation",
      "Grocery & meal planning guide",
      "Supplement recommendations",
      "Mid-plan progress report",
    ],
    cta: "Choose This Plan",
    highlighted: true,
    borderColor: "border-purple-300",
  },
  {
    name: "3-Month Plan",
    inrPrice: "₹13,500",
    usdPrice: "$160",
    duration: "3 Months",
    tag: "Best Value",
    description: "The complete program for deep-rooted conditions like Diabetes and PMOS.",
    features: [
      "Everything in 2-Month",
      "Comprehensive metabolic assessment",
      "12 weekly check-ins",
      "Blood work analysis & advice",
      "Customised exercise + diet synergy",
      "Cooking & lifestyle workshops",
      "Full progress reports",
      "3-month transformation tracking",
    ],
    cta: "Best Value",
    highlighted: false,
    borderColor: "border-green-200",
  },
];

const specialisedPackages = [
  {
    name: "3-Month Specialised Plan",
    inrPrice: "₹18,000",
    duration: "3 Months",
    tag: null,
    description: "A dedicated, condition-focused program for Diabetes and PMOS management.",
    features: [
      "Dedicated Diabetes & PMOS protocol",
      "Comprehensive hormonal + metabolic assessment",
      "12 weekly check-ins",
      "Detailed lab work analysis & tracking",
      "Medication-aware, condition-specific meal plans",
      "Priority WhatsApp support",
      "Monthly progress reports",
    ],
    cta: "Start This Plan",
    highlighted: false,
    borderColor: "border-gray-200",
  },
  {
    name: "6-Month Specialised Plan",
    inrPrice: "₹30,000",
    duration: "6 Months",
    tag: "Comprehensive Care",
    description: "The most thorough path to reversing Diabetes and managing PMOS long-term.",
    features: [
      "Everything in the 3-Month Specialised plan",
      "24 weekly check-ins",
      "Ongoing lab work review every 6–8 weeks",
      "Long-term blood sugar & hormone stabilisation focus",
      "Lifestyle & sustainability coaching",
      "Priority WhatsApp support throughout",
      "Full 6-month transformation tracking",
    ],
    cta: "Start This Plan",
    highlighted: true,
    borderColor: "border-purple-300",
  },
];

export default function Packages() {
  const [region, setRegion] = useState<Region>("india");

  return (
    <section id="packages" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "#EDE7F6", color: "#5C3A9E" }}
          >
            Investment in Your Health
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Transparent{" "}
            <span style={{ color: "#5C3A9E" }}>Pricing Plans</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            No hidden costs. No lock-ins. Choose the plan that fits your goals — and
            experience what personalised nutrition can do for you.
          </p>

          {/* Region toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full border border-gray-200 bg-gray-50 shadow-sm">
            <button
              onClick={() => setRegion("india")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                region === "india"
                  ? "bg-white text-[#5C3A9E] shadow-md border border-purple-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MapPin size={14} />
              India (₹ INR)
            </button>
            <button
              onClick={() => setRegion("international")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                region === "international"
                  ? "bg-white text-[#5C3A9E] shadow-md border border-purple-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Globe size={14} />
              International ($ USD)
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, i) => {
            const displayPrice = region === "india" ? pkg.inrPrice : pkg.usdPrice;

            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative rounded-3xl border-2 ${pkg.borderColor} overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
              >
                {pkg.tag && (
                  <div
                    className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: pkg.highlighted ? "rgba(255,255,255,0.25)" : "#5C3A9E" }}
                  >
                    <Star size={10} fill="currentColor" />
                    {pkg.tag}
                  </div>
                )}

                <div
                  className="p-8"
                  style={
                    pkg.highlighted
                      ? { background: "linear-gradient(135deg, #5C3A9E, #3D2070)" }
                      : { background: "linear-gradient(135deg, #f9f9f9, #ffffff)" }
                  }
                >
                  <h3
                    className={`text-2xl font-black mb-1 ${pkg.highlighted ? "text-white" : "text-gray-900"}`}
                  >
                    {pkg.name}
                  </h3>
                  <p
                    className={`text-sm mb-6 ${pkg.highlighted ? "text-purple-200" : "text-gray-500"}`}
                  >
                    {pkg.description}
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={displayPrice}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-baseline gap-2 flex-wrap"
                    >
                      <span
                        className={`text-5xl font-black ${pkg.highlighted ? "text-white" : "text-[#5C3A9E]"}`}
                      >
                        {displayPrice}
                      </span>
                      <span
                        className={`text-sm font-medium ${pkg.highlighted ? "text-purple-200" : "text-gray-500"}`}
                      >
                        / {pkg.duration}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="p-8 bg-white flex-1 flex flex-col gap-6">
                  <ul className="flex flex-col gap-3">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                        <span
                          className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                          style={{ background: "#E8F5E9" }}
                        >
                          <Check size={11} className="text-[#2D6B4F]" strokeWidth={3} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-4">
                    <a
                      href="#contact"
                      className="block w-full text-center py-3.5 rounded-full font-bold text-base transition-all duration-300 hover:-translate-y-1"
                      style={
                        pkg.highlighted
                          ? {
                              background: "linear-gradient(135deg, #5C3A9E, #3D2070)",
                              color: "white",
                              boxShadow: "0 6px 25px rgba(92,58,158,0.4)",
                            }
                          : {
                              background: "transparent",
                              color: "#5C3A9E",
                              border: "2px solid #5C3A9E",
                            }
                      }
                    >
                      {pkg.cta}
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {region === "india" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4" style={{ background: "#E8F5E9", color: "#2D6B4F" }}>
                <Activity size={14} />
                Specialised Care
              </div>
              <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">
                Specialised Disease Management
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                <span className="font-bold" style={{ color: "#5C3A9E" }}>
                  Diabetes and PMOS
                </span>{" "}
                reversal are long-term commitments — they take at least 3 months to show real
                results. That&apos;s why we&apos;ve created this specialised, catered plan.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
              {specialisedPackages.map((pkg, i) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`relative rounded-3xl border-2 ${pkg.borderColor} overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                >
                  {pkg.tag && (
                    <div
                      className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: pkg.highlighted ? "rgba(255,255,255,0.25)" : "#5C3A9E" }}
                    >
                      <Star size={10} fill="currentColor" />
                      {pkg.tag}
                    </div>
                  )}

                  <div
                    className="p-8"
                    style={
                      pkg.highlighted
                        ? { background: "linear-gradient(135deg, #5C3A9E, #3D2070)" }
                        : { background: "linear-gradient(135deg, #f9f9f9, #ffffff)" }
                    }
                  >
                    <h3 className={`text-2xl font-black mb-1 ${pkg.highlighted ? "text-white" : "text-gray-900"}`}>
                      {pkg.name}
                    </h3>
                    <p className={`text-sm mb-6 ${pkg.highlighted ? "text-purple-200" : "text-gray-500"}`}>
                      {pkg.description}
                    </p>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className={`text-5xl font-black ${pkg.highlighted ? "text-white" : "text-[#5C3A9E]"}`}>
                        {pkg.inrPrice}
                      </span>
                      <span className={`text-sm font-medium ${pkg.highlighted ? "text-purple-200" : "text-gray-500"}`}>
                        / {pkg.duration}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 bg-white flex-1 flex flex-col gap-6">
                    <ul className="flex flex-col gap-3">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                          <span
                            className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                            style={{ background: "#E8F5E9" }}
                          >
                            <Check size={11} className="text-[#2D6B4F]" strokeWidth={3} />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4">
                      <a
                        href="#contact"
                        className="block w-full text-center py-3.5 rounded-full font-bold text-base transition-all duration-300 hover:-translate-y-1"
                        style={
                          pkg.highlighted
                            ? {
                                background: "linear-gradient(135deg, #5C3A9E, #3D2070)",
                                color: "white",
                                boxShadow: "0 6px 25px rgba(92,58,158,0.4)",
                              }
                            : {
                                background: "transparent",
                                color: "#5C3A9E",
                                border: "2px solid #5C3A9E",
                              }
                        }
                      >
                        {pkg.cta}
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 flex flex-col gap-1"
        >
          <p className="text-sm text-gray-400">
            All plans include a free initial consultation. Custom packages available for corporate &amp; group programmes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
