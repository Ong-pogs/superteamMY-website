"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const words = [
  { text: "MEMBINA", lang: "Malay" },
  { text: "建设", lang: "Chinese" },
  { text: "கட்டு", lang: "Tamil" },
  { text: "BUILD", lang: "English" },
];

interface LanguageSwapProps {
  className?: string;
}

export default function LanguageSwap({ className }: LanguageSwapProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("relative h-[1.2em] overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index].text}
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: 90, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center"
          style={{ perspective: "400px" }}
        >
          <span className="bg-gradient-to-r from-sol-purple to-sol-green bg-clip-text text-transparent">
            {words[index].text}
          </span>
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
