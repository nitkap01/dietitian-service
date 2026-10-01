"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Specialisations", href: "#specialisations" },
  { label: "Nutrition", href: "#nutrition" },
  { label: "Packages", href: "#packages" },
  { label: "Transformations", href: "#transformations" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-purple-100"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <div className="relative h-14 w-44">
              <Image
                src="/images/logo.png"
                alt="Hale N Hearty Diet Clinic — Dt. Ritika Bahl"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-0.5 2xl:gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 2xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#5C3A9E] rounded-full hover:bg-purple-50 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden xl:flex items-center gap-3">
            <a
              href="tel:+919999383722"
              aria-label="Call +91 99993 83722"
              className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#5C3A9E] hover:text-[#3D2070] transition-colors"
            >
              <Phone size={16} />
              {/* full number on wide screens; icon only on laptops so the menu stays on one line */}
              <span className="hidden 2xl:inline">+91 99993 83722</span>
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #5C3A9E, #3D2070)" }}
            >
              Book Free Consultation
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="xl:hidden p-2 rounded-lg text-gray-700 hover:bg-purple-50 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="xl:hidden bg-white border-t border-purple-100 pb-4">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#5C3A9E] hover:bg-purple-50 rounded-lg transition-all"
                >
                  {link.label}
                </a>
              ))}
              <div className="px-4 pt-3 flex flex-col gap-2">
                <a
                  href="tel:+919999383722"
                  className="flex items-center gap-2 text-sm font-semibold text-[#5C3A9E]"
                >
                  <Phone size={16} />
                  +91 99993 83722
                </a>
                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="px-5 py-3 rounded-full text-sm font-semibold text-white text-center"
                  style={{ background: "linear-gradient(135deg, #5C3A9E, #3D2070)" }}
                >
                  Book Free Consultation
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
