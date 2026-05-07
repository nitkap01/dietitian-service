"use client";

import { motion } from "framer-motion";
import { Apple, Wheat, Fish, Droplets, AlertCircle, CheckCircle2, Flame, Leaf } from "lucide-react";

const principles = [
  {
    icon: Apple,
    color: "#C62828",
    bg: "#FFEBEE",
    title: "Fill Half Your Plate with Vegetables & Fruits",
    description:
      "Prioritise colour and variety. Leafy greens, cruciferous vegetables, berries, and citrus fruits are packed with antioxidants, fibre, and micronutrients that reduce chronic disease risk.",
    tags: ["Harvard Plate Guide"],
  },
  {
    icon: Wheat,
    color: "#6D4C41",
    bg: "#EFEBE9",
    title: "Choose Whole Grains Over Refined",
    description:
      "Replace white rice, white bread, and refined pasta with quinoa, oats, barley, brown rice, and whole wheat. Whole grains have a lower glycaemic impact and support gut health.",
    tags: ["Blood Sugar Control", "Gut Health"],
  },
  {
    icon: Fish,
    color: "#1565C0",
    bg: "#E3F2FD",
    title: "Diversify Your Protein Sources",
    description:
      "Include fish, legumes, lentils, beans, tofu, and nuts as primary protein sources. Limit red meat and avoid processed meats (bacon, sausages) which raise disease risk.",
    tags: ["Heart Health", "Diabetes Prevention"],
  },
  {
    icon: Droplets,
    color: "#0277BD",
    bg: "#E1F5FE",
    title: "Healthy Fats — Quality Over Quantity",
    description:
      "Use olive oil, avocado, nuts, and seeds as your primary fat sources. Omega-3 rich foods (salmon, walnuts, flaxseeds) actively fight inflammation linked to diabetes and PCOS.",
    tags: ["Anti-Inflammatory", "Heart Health"],
  },
  {
    icon: Flame,
    color: "#EF6C00",
    bg: "#FFF3E0",
    title: "Limit Added Sugar & Sugary Drinks",
    description:
      "Liquid calories from sodas, juices, and sweetened beverages spike blood glucose and are a leading driver of insulin resistance. Swap for water, unsweetened tea, or infused water.",
    tags: ["Diabetes Risk", "Weight Management"],
  },
  {
    icon: Leaf,
    color: "#2E7D32",
    bg: "#E8F5E9",
    title: "Anti-Inflammatory Eating",
    description:
      "An anti-inflammatory diet cuts the risk of Type 2 Diabetes in half. Key spices include turmeric, ginger, and cinnamon. Dark chocolate (70%+) and green tea also help.",
    tags: ["PCOS", "Diabetes Reversal"],
  },
];

const doList = [
  "Drink 8–10 glasses of water daily",
  "Eat 4–5 small meals instead of 3 large ones",
  "Include protein in every meal",
  "Choose cooking methods: baking, steaming, grilling",
  "Eat mindfully — no screens during meals",
  "Aim for 25–35g of fibre daily",
];

const avoidList = [
  "Ultra-processed and packaged foods",
  "Refined carbs: white rice, maida, white bread",
  "Sugary beverages and fruit juices",
  "Trans fats and hydrogenated oils",
  "Excess sodium (table salt, pickles)",
  "Late-night heavy meals",
];

export default function NutritionTips() {
  return (
    <section
      id="nutrition"
      className="py-24"
      style={{ background: "linear-gradient(180deg, #FDFCF7 0%, #F2EFE3 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "#E8F5E9", color: "#2D6B4F" }}
          >
            Evidence-Based Nutrition
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Science-Backed{" "}
            <span style={{ color: "#2D6B4F" }}>Nutrition Principles</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Rooted in the latest research from institutions like Harvard T.H. Chan School of Public
            Health — these are the foundations of every plan Dt. Ritika creates.
          </p>
        </motion.div>

        <div className="flex justify-center mb-12">
          <p className="text-xs text-gray-400 italic">
            Principles aligned with Harvard Nutrition Source &amp; WHO dietary guidelines
          </p>
        </div>

        {/* 6 Principle Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: p.bg }}
              >
                <p.icon size={22} style={{ color: p.color }} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm leading-snug">{p.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: p.bg, color: p.color }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Do / Avoid Split */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 border border-green-100 shadow-sm"
          >
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <CheckCircle2 size={24} className="text-[#2D6B4F]" />
              Eat More Of
            </h3>
            <ul className="flex flex-col gap-3">
              {doList.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <span
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: "#E8F5E9" }}
                  >
                    <CheckCircle2 size={12} className="text-[#2D6B4F]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 border border-red-100 shadow-sm"
          >
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <AlertCircle size={24} className="text-[#C62828]" />
              Limit or Avoid
            </h3>
            <ul className="flex flex-col gap-3">
              {avoidList.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <span
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: "#FFEBEE" }}
                  >
                    <AlertCircle size={12} className="text-[#C62828]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
