import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dt. Ritika Bahl | Hale N Hearty Diet Clinic – Diabetes & PCOS Specialist",
  description:
    "Transform your health with Dt. Ritika Bahl – NDEP-Certified Diabetes Educator & Certified Nutrition Specialist. Expert in reversing Diabetes, PCOS management, weight loss & personalised diet plans. 5000+ clients transformed globally.",
  keywords: [
    "dietitian",
    "nutritionist",
    "diabetes reversal",
    "PCOS diet",
    "weight management",
    "Ritika Bahl",
    "Hale N Hearty",
    "diet clinic",
    "personalised diet plan",
  ],
  metadataBase: new URL("https://dietitianritikabahl.com"),
  openGraph: {
    title: "Dt. Ritika Bahl | Hale N Hearty Diet Clinic",
    description:
      "Expert dietitian specialising in Diabetes Reversal, PCOS, and Sustainable Weight Loss. 5000+ clients transformed.",
    url: "https://dietitianritikabahl.com",
    siteName: "Hale N Hearty Diet Clinic",
    images: [{ url: "/images/ritika-profile.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dt. Ritika Bahl | Hale N Hearty Diet Clinic",
    description: "Expert dietitian in Diabetes Reversal, PCOS & Weight Management.",
  },
  icons: { icon: "/images/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
