"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Harnoor Kaur",
    meta: "Google review · 2 years ago",
    rating: 5,
    text:
      "Increasing weight caused me a lot of stress — I wanted to be healthy for myself and my family. Following the diet plan helped detoxify my body and clear years of imbalanced eating. Thank you, Ritika Bahl ma'am, for your guidance — your plan and motivation made this journey so much easier.",
    initials: "HK",
    color: "#5C3A9E",
  },
  {
    name: "Nishtha Puri",
    meta: "Google review · 7 years ago",
    rating: 5,
    text:
      "I would highly recommend Ritika for her superb everyday diet plans, customised to suit your requirements and routine. I've already lost 6 kg and I'm looking forward to losing more under her guidance.",
    initials: "NP",
    color: "#2D6B4F",
  },
  {
    name: "Sonal Sikka",
    meta: "Google review · 6 years ago",
    rating: 5,
    text:
      "I got the best nutrition counselling here — it helped me a lot to lose weight and maintain it. She always gives a personalised plan according to your needs. Highly recommend.",
    initials: "SS",
    color: "#7B1FA2",
  },
  {
    name: "Nitin Khanna",
    meta: "Google review · 2 years ago",
    rating: 5,
    text:
      "Dr. Ritika is extremely professional, and her diet plans are very balanced with a gradual approach to weight loss. Amazing benefits and results.",
    initials: "NK",
    color: "#1565C0",
  },
  {
    name: "Sheena Gupta",
    meta: "Google review · 3 months ago",
    rating: 5,
    text:
      "I had a great experience consulting with Ritika. I especially appreciated how she focused on balanced nutrition instead of quick fixes — she's supportive, patient, and always ready to clarify doubts. The meal suggestions included simple, home-based foods, which made it easy to stay consistent. Highly recommended for sustainable results.",
    initials: "SG",
    color: "#C2185B",
  },
  {
    name: "Himanshi Kataria",
    meta: "Google review · 3 months ago",
    rating: 5,
    text:
      "Dr. Ritika Bahl is the best dietician — if you have any kind of problem like PCOD, thyroid, etc., she'll help you get a healthy, slim body and a healthier lifestyle. I enjoyed the diet because there's something in her plans that you actually enjoy. Everyone should follow her diet to make today's lazy lifestyle healthier.",
    initials: "HK",
    color: "#F57F17",
  },
  {
    name: "Poonam Singh",
    meta: "Google review · 2 years ago",
    rating: 5,
    text:
      "Dr. Ritika helped me not only reshape my body but my strength, soul, and spirit. I wasn't able to walk properly due to nutritional deficiencies after my C-section — she always listens to her patients first and understands their needs. For me, she is my saviour.",
    initials: "PS",
    color: "#00897B",
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
            Verified Google Reviews
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Lives Changed.{" "}
            <span style={{ color: "#5C3A9E" }}>Stories Told.</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Don&apos;t take our word for it — read what real clients say about us on Google.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name + i}
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
                  <p className="text-xs text-gray-500">{t.meta}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
