"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, Heart, Globe } from "lucide-react";

const credentials = [
  {
    icon: Award,
    title: "NDEP-Certified Diabetes Educator",
    description: "Nationally recognised certification in diabetes nutrition and patient education.",
  },
  {
    icon: BookOpen,
    title: "DDHN – Diploma in Dietetics",
    description: "Comprehensive clinical training in human nutrition and therapeutic diets.",
  },
  {
    icon: Heart,
    title: "Certified Bariatric Nutritionist",
    description: "Specialised in post-surgical and medical weight management programs.",
  },
  {
    icon: Globe,
    title: "Certified Sports Nutritionist",
    description: "Performance nutrition for athletes, fitness enthusiasts, and active individuals.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="py-24 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ background: "#EDE7F6", color: "#5C3A9E" }}
            >
              About Dt. Ritika Bahl
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
              Your Health Is a{" "}
              <span style={{ color: "#5C3A9E" }}>Journey,</span>{" "}
              Not a Destination
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Dt. Ritika Bahl is the founder of{" "}
              <strong className="text-[#5C3A9E]">Hale N Hearty Diet Clinic</strong> and one of India&apos;s
              most respected dietitians. With over 8 years of clinical experience and a passion for
              root-cause nutrition, she has helped over{" "}
              <strong>5,000 clients across 15+ countries</strong> achieve lasting health
              transformations.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Her approach is simple yet powerful: she combines evidence-based science with deep
              empathy to design plans that are realistic, enjoyable, and built for long-term
              success — no crash diets, no starvation, no gimmicks.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Specialising in <strong>Type 2 Diabetes reversal</strong>, <strong>PCOS management</strong>,
              therapeutic diets for thyroid, pregnancy, lactation, and sports performance, she
              treats every client as an individual with unique needs.
            </p>

            <div className="flex flex-wrap gap-3">
              {["Diabetes Reversal", "PCOS", "Weight Management", "Thyroid", "Pregnancy", "Sports Nutrition", "Bariatric"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold"
                    style={{ background: "#E8F5E9", color: "#2D6B4F" }}
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </motion.div>

          {/* Right – Credentials */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {credentials.map((cred, i) => (
              <motion.div
                key={cred.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="rounded-2xl p-6 border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, #EDE7F6, #E8F5E9)" }}
                >
                  <cred.icon size={22} className="text-[#5C3A9E]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm leading-tight">{cred.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{cred.description}</p>
              </motion.div>
            ))}

            {/* Philosophy card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="sm:col-span-2 rounded-2xl p-6 text-white"
              style={{ background: "linear-gradient(135deg, #5C3A9E, #2D6B4F)" }}
            >
              <p className="text-lg font-bold mb-2">&ldquo;Healthy living begins with a plan.&rdquo;</p>
              <p className="text-sm opacity-90 leading-relaxed">
                Every meal is an opportunity to nourish your body. With the right guidance,
                sustainable health is within reach for everyone.
              </p>
              <p className="text-sm font-semibold mt-3 opacity-80">— Dt. Ritika Bahl</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
