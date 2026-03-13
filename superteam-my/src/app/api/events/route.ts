import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    events: [],
    message: "Events module coming soon",
  });
}
