import Image from "next/image";
import { Phone, Mail, ExternalLink } from "lucide-react";

const links = {
  Services: [
    { label: "Diabetes Reversal", href: "#specialisations" },
    { label: "PMOS Management", href: "#specialisations" },
    { label: "Weight Management", href: "#specialisations" },
    { label: "Thyroid Nutrition", href: "#specialisations" },
    { label: "Sports Nutrition", href: "#specialisations" },
  ],
  Company: [
    { label: "About Dt. Ritika", href: "#about" },
    { label: "Packages & Pricing", href: "#packages" },
    { label: "Transformations", href: "#transformations" },
    { label: "Nutrition Tips", href: "#nutrition" },
    { label: "Contact Us", href: "#contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="flex items-center">
              <div className="relative h-14 w-44 bg-white/5 rounded-xl p-1">
                <Image
                  src="/images/logo.png"
                  alt="Hale N Hearty Diet Clinic — Dt. Ritika Bahl"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Expert nutrition care by Dt. Ritika Bahl — NDEP Certified Diabetes Educator &amp;
              Specialist in PMOS, Weight Management, and Therapeutic Nutrition. Serving 5000+
              clients across 15+ countries.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="tel:+919999383722" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={14} className="text-purple-400" />
                +91 99993 83722
              </a>
              <a href="mailto:bahlritika123@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={14} className="text-purple-400" />
                bahlritika123@gmail.com
              </a>
              <a
                href="https://www.instagram.com/dt.ritikabahl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <ExternalLink size={14} className="text-pink-400" />
                @dt.ritikabahl
              </a>
            </div>
          </div>

          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h3 className="text-white font-bold text-sm mb-5 tracking-wide">{heading}</h3>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm hover:text-white transition-colors hover:translate-x-1 inline-block duration-200"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Hale N Hearty Diet Clinic – Dt. Ritika Bahl. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            dietitianritikabahl.com
          </p>
        </div>
      </div>
    </footer>
  );
}
