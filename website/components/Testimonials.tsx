"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Delhi, India",
    condition: "Diabetes Reversal",
    rating: 5,
    text:
      "My HbA1c dropped from 9.2 to 5.8 in just 3 months! Dt. Ritika's plan was easy to follow and the food was actually delicious. I've come off two medications and feel better than I have in years.",
    initials: "PS",
    color: "#5C3A9E",
  },
  {
    name: "Ananya Mehta",
    location: "Mumbai, India",
    condition: "PCOS Management",
    rating: 5,
    text:
      "After years of struggling with irregular periods and weight gain from PCOS, Dt. Ritika's plan finally worked. My cycle is regular for the first time in 4 years, and I've lost 11 kg sustainably!",
    initials: "AM",
    color: "#C2185B",
  },
  {
    name: "Ranjit Singh",
    location: "Toronto, Canada",
    condition: "Weight Management",
    rating: 5,
    text:
      "I was sceptical about online consultations, but Dt. Ritika is incredibly thorough and responsive. Lost 18 kg over 3 months — and more importantly, I've kept it off for a year now.",
    initials: "RS",
    color: "#2D6B4F",
  },
  {
    name: "Fatima Al-Zahra",
    location: "Dubai, UAE",
    condition: "Thyroid & Weight",
    rating: 5,
    text:
      "With hypothyroidism, I thought losing weight was impossible. Dt. Ritika understood my condition deeply and designed a plan around my thyroid health. Down 14 kg and my TSH levels are perfect!",
    initials: "FA",
    color: "#F57F17",
  },
  {
    name: "Sunita Reddy",
    location: "Hyderabad, India",
    condition: "Pregnancy Nutrition",
    rating: 5,
    text:
      "During my high-risk pregnancy with gestational diabetes, Dt. Ritika was a lifesaver. Her plan kept my blood sugar controlled throughout. I delivered a healthy baby and stayed off insulin entirely.",
    initials: "SR",
    color: "#7B1FA2",
  },
  {
    name: "Arjun Kapoor",
    location: "Bengaluru, India",
    condition: "Sports Nutrition",
    rating: 5,
    text:
      "As a marathon runner, I needed precise fuelling advice. Dt. Ritika's sports nutrition plan improved my race times and recovery. She genuinely understands athletic performance.",
    initials: "AK",
    color: "#1565C0",
  },
];

export default function Testimonials() {
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
            style={{ background: "#FFF8E1", color: "#F57F17" }}
          >
            Client Stories
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Lives Changed.{" "}
            <span style={{ color: "#5C3A9E" }}>Stories Told.</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Don&apos;t take our word for it — hear from the 5000+ clients whose lives have been
            transformed through personalised nutrition.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col gap-5 relative"
            >
              <Quote
                size={36}
                className="absolute top-5 right-6 opacity-10"
                style={{ color: t.color }}
              />

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array(t.rating).fill(null).map((_, j) => (
                  <Star key={j} size={14} fill="#F59E0B" className="text-amber-400" />
                ))}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed flex-1 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
                <span
                  className="ml-auto px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: `${t.color}15`, color: t.color }}
                >
                  {t.condition}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
