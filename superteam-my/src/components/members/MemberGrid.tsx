"use client";

import { motion } from "framer-motion";
import MemberCard from "./MemberCard";
import type { Member } from "@/types/member";

interface MemberGridProps {
  members: Member[];
}

export default function MemberGrid({ members }: MemberGridProps) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {members.map((member, i) => (
        <motion.div
          key={member.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <MemberCard member={member} />
        </motion.div>
      ))}
    </motion.div>
  );
}
