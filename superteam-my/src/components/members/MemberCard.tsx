"use client";

import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import type { Member } from "@/types/member";
import { ExternalLink } from "lucide-react";

interface MemberCardProps {
  member: Member;
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string) {
  const colors = [
    "from-sol-purple to-sol-green",
    "from-sol-green to-sol-blue",
    "from-sol-purple to-pink-500",
    "from-gold-accent to-orange-500",
    "from-sol-blue to-cyan-400",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function MemberCard({ member, className }: MemberCardProps) {
  return (
    <div
      className={cn(
        "group relative border border-border-dim bg-bg-panel/50 p-5 transition-all duration-300 hover:border-border-active hover:bg-bg-elevated/50 hover:shadow-[0_0_20px_rgba(0,255,163,0.08)]",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={cn(
            "h-12 w-12 shrink-0 rounded-sm bg-gradient-to-br flex items-center justify-center font-mono text-xs font-bold text-white",
            getAvatarColor(member.name)
          )}
        >
          {member.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.avatar_url}
              alt={member.name}
              className="h-full w-full rounded-sm object-cover"
            />
          ) : (
            getInitials(member.name)
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-sm font-bold text-text-primary truncate">
              {member.name}
            </h3>
            {member.twitter_url && (
              <a
                href={member.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-sol-green transition-colors"
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          {member.role && (
            <p className="font-mono text-[0.6rem] text-text-secondary">
              {member.role}
              {member.company && (
                <span className="text-sol-green/50"> @ {member.company}</span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Skills */}
      {member.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {member.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.05em] bg-bg-elevated text-text-secondary border border-border-dim"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Badges — reveal on hover */}
      {member.badges.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {member.badges.map((badge) => (
            <Badge key={badge} variant={badge === "Core Team" ? "gold" : "green"}>
              {badge}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
