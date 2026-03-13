// Luma API helpers
// Docs: https://docs.lu.ma/reference/getting-started

const LUMA_API_BASE = "https://api.lu.ma/public/v2";

interface LumaEvent {
  api_id: string;
  name: string;
  description: string;
  start_at: string;
  end_at: string;
  url: string;
  cover_url: string;
  geo_address_info?: {
    city: string;
    country: string;
    full_address: string;
  };
}

export async function fetchLumaEvents(): Promise<LumaEvent[]> {
  const apiKey = process.env.LUMA_API_KEY;

  if (!apiKey) {
    return [];
  }

  try {
    const res = await fetch(`${LUMA_API_BASE}/calendar/list-events`, {
      headers: {
        "x-luma-api-key": apiKey,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.entries?.map((e: { event: LumaEvent }) => e.event) ?? [];
  } catch {
    return [];
  }
}
