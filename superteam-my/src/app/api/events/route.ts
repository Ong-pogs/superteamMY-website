import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Implement Luma API proxy + Supabase fallback
  // const lumaEvents = await fetchLumaEvents();

  return NextResponse.json({
    events: [],
    message: "Events module coming soon",
  });
}
