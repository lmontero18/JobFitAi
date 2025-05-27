import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jobfit AI | Smart Resume & Job Match Analyzer",
  description:
    "Boost your chances of landing your dream job with Jobfit AI. Instantly analyze your resume, match it against job descriptions, and get actionable feedback powered by AI.",
  keywords: [
    "AI resume analyzer",
    "job match AI",
    "resume job comparison",
    "resume feedback tool",
    "AI job matcher",
    "optimize resume",
    "job application AI",
    "nextjs career platform",
    "smart resume checker",
    "ATS optimization",
  ],
  openGraph: {
    title: "Jobfit AI | Smart Resume & Job Match Analyzer",
    description:
      "Instantly analyze your resume and compare it with any job description using AI. Get feedback, boost compatibility, and land more interviews.",
    url: "https://yourdomain.com", // Reemplazar con el dominio real
    siteName: "Jobfit AI",
    images: [
      {
        url: "https://yourdomain.com/og-image.png", // Reemplazar con tu imagen OpenGraph
        width: 1200,
        height: 630,
        alt: "Jobfit AI preview image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobfit AI | Smart Resume & Job Match Analyzer",
    description:
      "AI-powered platform that compares your resume with job descriptions and gives you compatibility feedback.",
    images: ["https://yourdomain.com/og-image.png"], // Reemplazar con URL real
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
