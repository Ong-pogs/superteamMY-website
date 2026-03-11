"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export default function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-border-dim bg-bg-panel/50 overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-bg-elevated/50"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 text-sol-green transition-transform duration-200",
                openIndex === i && "rotate-90"
              )}
            />
            <span className="font-mono text-xs text-sol-green/60 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-sm font-medium text-text-primary">
              {item.question}
            </span>
            <span className="ml-auto font-mono text-xs text-text-secondary cursor-blink">
              {openIndex === i ? "▼" : "▶"}
            </span>
          </button>

          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-5 pb-4 pl-12">
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
