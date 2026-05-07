"use client";

import { motion } from "framer-motion";
import { ClipboardList, MessageSquare, Utensils, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Free Consultation",
    description:
      "Start with a 30-minute free consultation where we understand your health goals, medical history, lifestyle, and food preferences. No judgement — just listening.",
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Detailed Assessment",
    description:
      "Dt. Ritika reviews your health reports, body metrics, and dietary patterns to identify nutritional gaps and root causes of your condition.",
  },
  {
    step: "03",
    icon: Utensils,
    title: "Personalised Diet Plan",
    description:
      "You receive a fully customised, practical diet plan — tailored to your preferences, culture, and schedule. Real food you'll actually enjoy eating.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Ongoing Support & Results",
    description:
      "Weekly check-ins, plan adjustments, and continuous WhatsApp support to keep you on track. We celebrate every milestone with you.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "#E8F5E9", color: "#2D6B4F" }}
          >
            The Process
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Your Path to{" "}
            <span style={{ color: "#2D6B4F" }}>Better Health</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A simple, structured 4-step journey designed to make lasting change feel easy and achievable.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5"
            style={{ background: "linear-gradient(90deg, #5C3A9E, #7AB648)" }}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center gap-4"
              >
                {/* Step number + icon */}
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: "linear-gradient(135deg, #5C3A9E, #2D6B4F)" }}
                  >
                    <step.icon size={28} className="text-white" />
                  </div>
                  <span
                    className="absolute -top-3 -right-3 w-7 h-7 rounded-full text-xs font-black flex items-center justify-center text-white"
                    style={{ background: "#7AB648" }}
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA below */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-14"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-base transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #5C3A9E, #3D2070)",
              boxShadow: "0 6px 25px rgba(92,58,158,0.4)",
            }}
          >
            Start Your Journey Today
          </a>
        </motion.div>
      </div>
    </section>
  );
}
