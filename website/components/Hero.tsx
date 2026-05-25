"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Award, Users, Star, CheckCircle } from "lucide-react";

const badges = [
  { icon: Award, text: "NDEP Certified Diabetes Educator" },
  { icon: Award, text: "Certified Weight Management Specialist" },
  { icon: Award, text: "Certified Sports Nutritionist" },
];

const highlights = [
  "Personalised diet plans – no one-size-fits-all",
  "Evidence-based, sustainable approach",
  "100% online – consult from anywhere",
  "Specialised in Diabetes & PMOS reversal",
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{
        background: "linear-gradient(135deg, #F0EBF8 0%, #EBF5F0 60%, #F5F0FA 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-10 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #5C3A9E, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #7AB648, transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold w-fit"
              style={{ background: "rgba(92,58,158,0.1)", color: "#5C3A9E" }}
            >
              <Star size={14} fill="#5C3A9E" />
              A Healthy Living Begins with a Plan
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] text-gray-900">
              Heal Your Body.{" "}
              <span className="shimmer-text">Transform Your Life.</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Clinically proven, personalised nutrition plans to reverse Diabetes, manage PMOS,
              and achieve sustainable weight loss — guided by{" "}
              <strong className="text-[#5C3A9E]">Dt. Ritika Bahl</strong>, one of India&apos;s
              most trusted dietitians with 5000+ transformations globally.
            </p>

            {/* Highlights */}
            <ul className="flex flex-col gap-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <CheckCircle size={18} className="text-[#2D6B4F] flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#contact"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white text-base transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #5C3A9E, #3D2070)",
                  boxShadow: "0 6px 25px rgba(92,58,158,0.4)",
                }}
              >
                Book Free Consultation
                <ArrowRight size={18} />
              </a>
              <a
                href="#packages"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-[#5C3A9E] text-base border-2 border-[#5C3A9E] transition-all duration-300 hover:bg-[#5C3A9E] hover:text-white"
              >
                View Packages
              </a>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 pt-4 border-t border-purple-100">
              {[
                { value: "5000+", label: "Lives Transformed" },
                { value: "8+", label: "Years Experience" },
                { value: "15+", label: "Countries Served" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-black text-[#5C3A9E]">{stat.value}</span>
                  <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right – Profile Photo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-[2rem] blur-xl opacity-30"
                style={{ background: "linear-gradient(135deg, #5C3A9E, #7AB648)" }}
              />
              {/* Photo card */}
              <div
                className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white"
                style={{ width: 360, height: 480 }}
              >
                <Image
                  src="/images/ritika-profile.png"
                  alt="Dt. Ritika Bahl – Dietitian & Nutritionist"
                  fill
                  className="object-cover object-top"
                  priority
                />
                {/* Overlay gradient at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-32"
                  style={{
                    background: "linear-gradient(to top, rgba(92,58,158,0.85), transparent)",
                  }}
                />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="font-bold text-xl">Dt. Ritika Bahl</p>
                  <p className="text-sm opacity-90">DDHN · Diabetes Educator · Sports Nutritionist</p>
                </div>
              </div>

              {/* Floating credential badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-purple-100"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #5C3A9E20, #5C3A9E40)" }}
                >
                  <Award size={20} className="text-[#5C3A9E]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">NDEP Certified</p>
                  <p className="text-xs text-gray-500">Diabetes Educator</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -right-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-green-100"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #2D6B4F20, #7AB64840)" }}
                >
                  <Users size={20} className="text-[#2D6B4F]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">5000+ Clients</p>
                  <p className="text-xs text-gray-500">Transformed Globally</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 80L60 69.3C120 58.7 240 37.3 360 32C480 26.7 600 37.3 720 42.7C840 48 960 48 1080 42.7C1200 37.3 1320 26.7 1380 21.3L1440 16V80H0Z"
            fill="#FDFCF7"
          />
        </svg>
      </div>
    </section>
  );
}
