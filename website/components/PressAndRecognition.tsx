"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, Newspaper, Maximize2 } from "lucide-react";

const awards = [
  {
    src: "/images/recognition/national-nutrition-award-2023.jpg",
    title: "10th National Nutrition Award 2023",
    caption:
      "Awarded to Dt. Ritika Bahl by the International Health Sciences Association for outstanding contribution to nutrition awareness and education — Nutrition Month Celebration, 30 September 2023, New Delhi.",
    alt: "10th National Nutrition Award 2023 trophy awarded to Dt. Ritika Bahl",
  },
  {
    src: "/images/recognition/pride-bharat-award-2026.jpg",
    title: "Excellence in Clinical Nutrition, Gut Health & Diabetes Care Award 2026",
    caption:
      "Presented to Hale N Hearty Diet Clinic at the Pride Bharat Awards Season 6, powered by Insights Excellence Awards — 6 June 2026, Radisson Blu Hotel, Dwarka, New Delhi.",
    alt: "Pride Bharat Awards 2026 certificate presented to Hale N Hearty Diet Clinic",
  },
];

const press = [
  {
    src: "/images/press/dilli-news7-myths-and-facts-2023-05-19.jpg",
    headline: "Myths and Facts About Food",
    source: "Dilli News7 · 19 May 2023",
    blurb:
      "Dt. Ritika Bahl busts 12 common food myths — bananas, lemon water, brown sugar, skipping meals and more.",
  },
  {
    src: "/images/press/dilli-news7-food-groups-2023-08-23.jpg",
    headline: "Include All Food Groups to Stay Healthy",
    source: "Dilli News7 · 23 August 2023",
    blurb:
      "A practical guide to balanced meals across fruits, pulses, nuts, dairy and whole grains.",
  },
  {
    src: "/images/press/dilli-news7-healthy-eating-2026-06-10.jpg",
    headline: "Healthy Eating Is Transforming Lifestyles and Changing the Picture of Chronic Diseases",
    source: "Dilli News7 · 10 June 2026",
    blurb: "On choosing balance over fad diets, and why sustainable habits beat quick fixes.",
  },
];

export default function PressAndRecognition() {
  return (
    <section
      id="recognition"
      className="py-24"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FDFCF7 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "#FFF8E1", color: "#F57F17" }}
          >
            Recognition &amp; Press
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Awards, Honours &amp;{" "}
            <span style={{ color: "#5C3A9E" }}>Press Features</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Independent recognition of the work — national awards for contribution to
            nutrition education, and columns published in the press.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 justify-center mb-6"
        >
          <Trophy size={18} style={{ color: "#5C3A9E" }} />
          <h3 className="text-xl font-black text-gray-900">Awards &amp; Honours</h3>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {awards.map((award, i) => (
            <motion.div
              key={award.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div
                className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4"
                style={{ background: "linear-gradient(135deg, #EDE7F6, #E8F5E9)" }}
              >
                <Image
                  src={award.src}
                  alt={award.alt}
                  fill
                  sizes="(max-width: 640px) 90vw, 45vw"
                  className="object-contain p-3"
                />
              </div>
              <h4 className="text-sm font-black text-gray-900 mb-2 leading-snug">
                {award.title}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">{award.caption}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 justify-center mb-6"
        >
          <Newspaper size={18} style={{ color: "#5C3A9E" }} />
          <h3 className="text-xl font-black text-gray-900">Featured in the Press</h3>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {press.map((article, i) => (
            <motion.a
              key={article.src}
              href={article.src}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <Image
                  src={article.src}
                  alt={`${article.headline} — Dilli News7, ${article.source.split("· ")[1]}`}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ background: "linear-gradient(to top, rgba(92,58,158,0.8), transparent)" }}
                >
                  <Maximize2 className="text-white" size={22} />
                </div>
              </div>
              <div className="p-5 flex flex-col gap-1.5">
                <p className="text-xs font-semibold" style={{ color: "#5C3A9E" }}>
                  {article.source}
                </p>
                <p className="text-sm font-bold text-gray-900 leading-snug">
                  {article.headline}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">{article.blurb}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
