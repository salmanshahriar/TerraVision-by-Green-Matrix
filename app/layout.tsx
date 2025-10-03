import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/layout/Navbar'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project TerraVision | By Team Green Matrix | NSAC2025",
  description: "Our project is an AI-powered application for monitoring and classifying Land Use and Land Cover (LULC) changes using Sentinel-2 satellite imagery. It tackles urgent global challenges such as unchecked urban growth, deforestation, and land degradation, which threaten biodiversity, food security, and sustainable development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Navbar/>
        {children}
      </body>
    </html>
  );
}
