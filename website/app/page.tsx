import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Specialisations from "@/components/Specialisations";
import HowItWorks from "@/components/HowItWorks";
import NutritionTips from "@/components/NutritionTips";
import Packages from "@/components/Packages";
import Transformations from "@/components/Transformations";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <Navbar />
      <Hero />
      <About />
      <Specialisations />
      <HowItWorks />
      <NutritionTips />
      <Packages />
      <Transformations />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
