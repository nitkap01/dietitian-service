"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How is your approach different from generic diet plans?",
    a: "Every plan I create is 100% personalised. I review your health reports, medical history, food preferences, cultural background, lifestyle, and specific health goals before designing your plan. There are no templates — your plan is uniquely yours.",
  },
  {
    q: "Can diabetes really be reversed through diet?",
    a: "Yes — research from Harvard and other institutions shows that up to 90% of Type 2 Diabetes cases can be prevented or reversed through targeted lifestyle and dietary changes. Through a low-glycaemic, anti-inflammatory, whole-food approach, many of my clients have come off medication entirely. Results depend on the duration of diabetes and individual factors, which we assess in the consultation.",
  },
  {
    q: "How does an online consultation work?",
    a: "It's just as effective as in-person. We connect via phone or video call. You share your health reports, I conduct a detailed assessment, and your personalised plan is delivered digitally within 48 hours. Ongoing support is via WhatsApp throughout your program.",
  },
  {
    q: "Will I have to give up all the foods I love?",
    a: "Absolutely not! Sustainable nutrition is about adding the right foods, not deprivation. I work around your cultural food preferences and favourite dishes to create a plan you'll actually enjoy. The goal is a lifestyle you can maintain for life.",
  },
  {
    q: "How long before I start seeing results?",
    a: "Most clients notice improved energy and reduced bloating within the first 1–2 weeks. Significant weight changes typically begin by week 3–4. For conditions like diabetes or PCOS, measurable health marker improvements (blood sugar, hormone levels) are usually seen within 6–8 weeks of consistent adherence.",
  },
  {
    q: "Do you offer support between consultations?",
    a: "Yes! WhatsApp support is available Monday to Saturday throughout your program. I'm accessible for quick queries, motivation, and plan adjustments. You're never alone in your journey.",
  },
  {
    q: "Are the packages available internationally?",
    a: "Yes — all consultations are conducted online and I work with clients across India, UAE, UK, USA, Canada, Singapore, and 15+ countries. Payments can be made via bank transfer, UPI, or international payment methods.",
  },
  {
    q: "Do I need to share my medical reports?",
    a: "It's highly recommended. Blood reports (lipid profile, HbA1c, thyroid panel, hormonal reports for PCOS, etc.) give me crucial insights to design the most effective and safe plan for you. If you don't have recent reports, I can guide you on which tests to get done.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      className="py-24"
      style={{ background: "linear-gradient(180deg, #FDFCF7 0%, #F2EFE3 100%)" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "#EDE7F6", color: "#5C3A9E" }}
          >
            FAQ
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Frequently Asked{" "}
            <span style={{ color: "#5C3A9E" }}>Questions</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to know before starting your health journey with us.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-bold text-gray-900 text-sm leading-snug">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className="flex-shrink-0 text-[#5C3A9E] transition-transform duration-300"
                  style={{ transform: open === i ? "rotate(180deg)" : "rotate(0)" }}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
