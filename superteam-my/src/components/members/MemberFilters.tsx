"use client";

import SkillTag from "@/components/ui/SkillTag";

const FILTERS = [
  "All",
  "Core Team",
  "Rust",
  "Frontend",
  "Design",
  "Content",
  "Growth",
  "Product",
  "Community",
];

interface MemberFiltersProps {
  active: string;
  onChange: (filter: string) => void;
}

export default function MemberFilters({ active, onChange }: MemberFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => (
        <SkillTag
          key={filter}
          label={filter}
          active={active === filter}
          onClick={() => onChange(filter)}
        />
      ))}
    </div>
  );
}
