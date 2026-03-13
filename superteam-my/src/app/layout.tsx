import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Silkscreen } from "next/font/google";
import SmoothScroll from "@/components/layout/SmoothScroll";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const silkscreen = Silkscreen({
  variable: "--font-pixel",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Superteam Malaysia — Terminal // MY",
  description:
    "The home for Solana builders in Malaysia. Join the tactical terminal experience.",
  keywords: [
    "Superteam",
    "Malaysia",
    "Solana",
    "Web3",
    "Blockchain",
    "Crypto",
  ],
  openGraph: {
    title: "Superteam Malaysia — Terminal // MY",
    description: "The home for Solana builders in Malaysia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} ${silkscreen.variable} font-display antialiased`}
      >
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
