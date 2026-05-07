"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

const packages = [
  {
    name: "Monthly Plan",
    price: "₹6,000",
    duration: "1 Month",
    tag: null,
    description: "Perfect for getting started and experiencing the Hale N Hearty approach.",
    features: [
      "Personalised diet plan",
      "Initial health assessment",
      "4 weekly check-in calls",
      "WhatsApp support (Mon–Sat)",
      "Plan adjustments as needed",
      "Digital meal guides",
      "Recipe suggestions",
    ],
    cta: "Get Started",
    highlighted: false,
    gradient: "from-gray-50 to-white",
    borderColor: "border-gray-200",
  },
  {
    name: "2-Month Plan",
    price: "₹11,000",
    duration: "2 Months",
    tag: "Most Popular",
    description: "The sweet spot for real, measurable transformation with lasting habits.",
    features: [
      "Everything in Monthly",
      "Deeper health assessment",
      "8 weekly check-in calls",
      "Priority WhatsApp support",
      "Lab report interpretation",
      "Grocery & meal planning guide",
      "Supplement recommendations",
      "Mid-plan progress report",
    ],
    cta: "Choose This Plan",
    highlighted: true,
    gradient: "from-[#5C3A9E] to-[#3D2070]",
    borderColor: "border-purple-300",
  },
  {
    name: "3-Month Plan",
    price: "₹15,000",
    duration: "3 Months",
    tag: "Best Value",
    description: "The complete program for deep-rooted conditions like Diabetes and PCOS.",
    features: [
      "Everything in 2-Month",
      "Comprehensive metabolic assessment",
      "12 weekly check-in calls",
      "24/7 emergency WhatsApp support",
      "Blood work analysis & advice",
      "Customised exercise + diet synergy",
      "Cooking & lifestyle workshops",
      "Full progress reports",
      "3-month transformation tracking",
    ],
    cta: "Best Value",
    highlighted: false,
    gradient: "from-gray-50 to-white",
    borderColor: "border-green-200",
  },
];

export default function Packages() {
  return (
    <section
      id="packages"
      className="py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
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
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            No hidden costs. No lock-ins. Choose the plan that fits your goals — and
            experience what personalised nutrition can do for you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, i) => (
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
                className={`p-8 ${pkg.highlighted ? "bg-gradient-to-br " + pkg.gradient : "bg-gradient-to-br " + pkg.gradient}`}
                style={
                  pkg.highlighted
                    ? { background: "linear-gradient(135deg, #5C3A9E, #3D2070)" }
                    : {}
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
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-5xl font-black ${pkg.highlighted ? "text-white" : "text-[#5C3A9E]"}`}
                  >
                    {pkg.price}
                  </span>
                  <span
                    className={`text-sm font-medium ${pkg.highlighted ? "text-purple-200" : "text-gray-500"}`}
                  >
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

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-400 mt-8"
        >
          All plans include a free initial consultation. Custom packages available for corporate &
          group programmes.
        </motion.p>
      </div>
    </section>
  );
}
