"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, TrendingUp, Globe } from "lucide-react";

const stats = [
  { icon: Users, value: "5000+", label: "Clients Transformed", color: "#5C3A9E" },
  { icon: Globe, value: "15+", label: "Countries Served", color: "#2D6B4F" },
  { icon: TrendingUp, value: "98%", label: "Client Satisfaction", color: "#7AB648" },
];

const IMG_VERSION = "20260815-4";

const transformationImages = [
  { src: `/images/transformation1.png?v=${IMG_VERSION}`, alt: "Client transformation 1" },
  { src: `/images/transformation2.png?v=${IMG_VERSION}`, alt: "Client transformation 2" },
  { src: `/images/transformation3.png?v=${IMG_VERSION}`, alt: "Client transformation 3" },
  { src: `/images/transformation4.png?v=${IMG_VERSION}`, alt: "Client transformation 4" },
  { src: `/images/transformation5.png?v=${IMG_VERSION}`, alt: "Client transformation 5" },
  { src: `/images/transformation6.png?v=${IMG_VERSION}`, alt: "Client transformation 6" },
  { src: `/images/transformation7.jpg?v=${IMG_VERSION}`, alt: "Client transformation 7" },
  { src: `/images/transformation8.jpg?v=${IMG_VERSION}`, alt: "Client transformation 8" },
  { src: `/images/transformation9.jpg?v=${IMG_VERSION}`, alt: "Client transformation 9" },
];

export default function Transformations() {
  return (
    <section
      id="transformations"
      className="py-24"
      style={{ background: "linear-gradient(180deg, #F2EFE3 0%, #FDFCF7 100%)" }}
    >
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
            Real Results
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Real People.{" "}
            <span style={{ color: "#5C3A9E" }}>Real Transformations.</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            These results speak for themselves. Every before &amp; after represents a life
            changed through the power of personalised nutrition.
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-14">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm"
            >
              <div
                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: `${stat.color}15` }}
              >
                <stat.icon size={22} style={{ color: stat.color }} />
              </div>
              <p className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Transformation grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {transformationImages.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-gray-100 group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                className="object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                style={{ background: "linear-gradient(to top, rgba(92,58,158,0.8), transparent)" }}
              >
                <p className="text-white text-sm font-semibold">
                  Verified Client Transformation
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm mb-6">
            Join thousands who have already transformed their health with Dt. Ritika Bahl
          </p>
          <a
            href="https://www.instagram.com/dt.ritikabahl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)",
              boxShadow: "0 6px 20px rgba(131,58,180,0.35)",
            }}
          >
            See More on Instagram @dt.ritikabahl
          </a>
          <p className="text-gray-400 text-xs mt-6">
            Faces are blurred to protect our clients&apos; privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
