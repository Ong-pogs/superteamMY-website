import type { Metadata } from "next";
import { JetBrains_Mono, Silkscreen } from "next/font/google";
import localFont from "next/font/local";
import SmoothScroll from "@/components/layout/SmoothScroll";
import "./globals.css";

const ethnocentric = localFont({
  src: "../../public/fonts/Ethnocentric-Regular.otf",
  variable: "--font-display",
  display: "swap",
  weight: "400",
});

const auxMono = localFont({
  src: "../../public/fonts/AuxMono.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-3d",
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
        className={`${ethnocentric.className} ${ethnocentric.variable} ${auxMono.variable} ${jetbrainsMono.variable} ${silkscreen.variable} antialiased`}
      >
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
