import { NextResponse } from "next/server";

// Mock data for now — will be replaced with Supabase queries
const MOCK_MEMBERS = [
  { id: "1", name: "Amir Razak", role: "Lead Developer", company: "Solana Labs", skills: ["Rust", "TypeScript", "DeFi"], badges: ["Core Team", "OG"], is_featured: true, is_core_team: true },
  { id: "2", name: "Wei Lin Chen", role: "Design Lead", company: "Tensor", skills: ["UI/UX", "Figma", "Brand"], badges: ["Core Team"], is_featured: true, is_core_team: true },
  { id: "3", name: "Priya Krishnan", role: "Community Lead", company: "Superteam", skills: ["Community", "Events", "Growth"], badges: ["Core Team"], is_featured: true, is_core_team: true },
];

export async function GET() {
  return NextResponse.json({ members: MOCK_MEMBERS });
}
