"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Droplets,
  Scale,
  Leaf,
  Baby,
  Zap,
  Dumbbell,
  Scissors,
} from "lucide-react";

const specialisations = [
  {
    icon: Droplets,
    title: "Diabetes Reversal",
    subtitle: "Type 1 & Type 2",
    description:
      "Clinically proven nutrition protocols that target insulin resistance, stabilise blood glucose, and support long-term diabetes reversal through whole-food, low-glycaemic diet strategies.",
    color: "#5C3A9E",
    bg: "#EDE7F6",
    tags: ["Blood Sugar Control", "Insulin Sensitivity", "Low-GI Foods"],
    highlight: "90% of Type 2 Diabetes cases are preventable through diet",
  },
  {
    icon: Activity,
    title: "PMOS Management",
    subtitle: "Polycystic Ovary Syndrome",
    description:
      "Hormone-balancing nutrition plans designed to reduce inflammation, regulate menstrual cycles, manage weight, and improve fertility outcomes in women with PMOS.",
    color: "#C2185B",
    bg: "#FCE4EC",
    tags: ["Hormone Balance", "Anti-Inflammatory", "Cycle Regulation"],
    highlight: "Diet is the most powerful tool to manage PMOS naturally",
  },
  {
    icon: Scale,
    title: "Weight Management",
    subtitle: "Sustainable Fat Loss",
    description:
      "Personalised calorie and macro-balanced plans focused on sustainable, enjoyable weight loss without starvation — preserving muscle mass and long-term metabolic health.",
    color: "#2D6B4F",
    bg: "#E8F5E9",
    tags: ["Fat Loss", "Muscle Preservation", "Metabolism"],
    highlight: "5000+ successful transformations worldwide",
  },
  {
    icon: Zap,
    title: "Thyroid Health",
    subtitle: "Hypothyroid & Hyperthyroid",
    description:
      "Nutritional support for thyroid conditions including Hashimoto&apos;s and Graves&apos; disease — targeting anti-inflammatory foods, iodine balance, and metabolic support.",
    color: "#F57F17",
    bg: "#FFF8E1",
    tags: ["Thyroid Support", "Anti-Inflammatory", "Metabolic Health"],
    highlight: "Diet directly impacts thyroid hormone production",
  },
  {
    icon: Baby,
    title: "Pregnancy & Lactation",
    subtitle: "Pre & Post Natal Nutrition",
    description:
      "Safe, nutrient-dense diet plans for every stage of pregnancy and breastfeeding — ensuring optimal nutrition for mother and baby while managing gestational conditions.",
    color: "#7B1FA2",
    bg: "#F3E5F5",
    tags: ["Prenatal Nutrition", "Gestational Diabetes", "Breastfeeding"],
    highlight: "Nutrition in pregnancy shapes lifelong health",
  },
  {
    icon: Leaf,
    title: "Gut Health",
    subtitle: "Digestive Wellness",
    description:
      "Evidence-based nutrition therapy for gut microbiome restoration, IBS management, bloating, acid reflux, and leaky gut — guided by Harvard-certified gut health expertise.",
    color: "#2D6B4F",
    bg: "#E8F5E9",
    tags: ["Gut Microbiome", "IBS Relief", "Digestive Wellness"],
    highlight: "Harvard Certified Gut Health Expert",
  },
  {
    icon: Dumbbell,
    title: "Sports Nutrition",
    subtitle: "Performance & Recovery",
    description:
      "Science-backed fuelling strategies for athletes and fitness enthusiasts — optimising pre/post-workout nutrition, endurance, recovery, and body composition.",
    color: "#1565C0",
    bg: "#E3F2FD",
    tags: ["Performance", "Recovery", "Body Composition"],
    highlight: "Fuel right, perform better, recover faster",
  },
  {
    icon: Scissors,
    title: "Bariatric Nutrition",
    subtitle: "Pre & Post Surgery",
    description:
      "Specialised dietary support before and after bariatric surgery — ensuring safe weight loss, preventing deficiencies, and maximising long-term surgical outcomes.",
    color: "#00695C",
    bg: "#E0F2F1",
    tags: ["Post-Surgery", "Nutrient Absorption", "Long-term Health"],
    highlight: "Certified Bariatric Nutritionist",
  },
  {
    icon: Leaf,
    title: "Therapeutic Diets",
    subtitle: "Condition-Specific Plans",
    description:
      "Custom nutrition plans for cholesterol management, gut health, kidney disease, fatty liver, and other chronic conditions requiring medically supervised dietary intervention.",
    color: "#558B2F",
    bg: "#F1F8E9",
    tags: ["Cholesterol", "Gut Health", "Liver Health"],
    highlight: "Food as medicine — targeted and effective",
  },
];

export default function Specialisations() {
  return (
    <section
      id="specialisations"
      className="py-24 relative"
      style={{ background: "linear-gradient(180deg, #FDFCF7 0%, #F2EFE3 100%)" }}
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
            Areas of Expertise
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Specialised Care for{" "}
            <span style={{ color: "#5C3A9E" }}>Every Condition</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Whether you&apos;re managing a chronic condition or pursuing peak performance,
            Dt. Ritika brings deep clinical expertise to help you achieve your goals.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialisations.map((spec, i) => (
            <motion.div
              key={spec.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col gap-4 group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: spec.bg }}
              >
                <spec.icon size={22} style={{ color: spec.color }} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{spec.title}</h3>
                <p className="text-xs font-medium" style={{ color: spec.color }}>
                  {spec.subtitle}
                </p>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">{spec.description}</p>
              <div className="pt-2 border-t border-gray-100">
                <p
                  className="text-xs font-semibold italic"
                  style={{ color: spec.color }}
                >
                  &ldquo;{spec.highlight}&rdquo;
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {spec.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: spec.bg, color: spec.color }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
