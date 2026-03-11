# Superteam Malaysia — Terminal // MY

The official Superteam Malaysia website — a cinematic, game-UI-inspired Web3 hub for Solana builders in Malaysia.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS v3
- React Three Fiber (3D)
- GSAP + Framer Motion (animations)
- Supabase (PostgreSQL, Auth, Storage)

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/superteam-my.git
cd superteam-my
npm install
cp .env.local.example .env.local
# Fill in your Supabase credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `LUMA_API_KEY` | Luma API key (optional, for events) |
| `NEXT_PUBLIC_SITE_URL` | Site URL (`http://localhost:3000` for dev) |

## Architecture

### Pages
- `/` — Landing page with 10 cinematic sections
- `/members` — Full member directory with search & filters
- `/admin` — Protected admin dashboard (CRUD for members, events, partners, content)

### Landing Page Sections
1. **Entry Experience** — CRT terminal intro with Solana branding
2. **Hero** — Shift5-style split layout with multilingual word swap
3. **Mission** — Skill tree nodes with SVG connection lines
4. **Stats** — Animated counters with orbital hub display
5. **Members** — GTA V-style character switching spotlight
6. **Partners** — CRT monitor grid with hover effects
7. **Wall of Love** — Community tweets in CRT frame
8. **FAQ** — Category sidebar with accordion
9. **Join CTA** — Dramatic Valorant-style typography
10. **Events** — Placeholder (Luma integration pending)

### Database
SQL migrations in `supabase/migrations/` (001-005). Run in order.

### Design System
- Colors: Solana brand (green, purple, blue) + Malaysian gold accent
- Fonts: Outfit (display), JetBrains Mono (terminal), Silkscreen (pixel)
- Effects: CRT scanlines, vignette, glitch text, binary streams

## Deployment

```bash
vercel
```

## License

Built for the Superteam Malaysia Website Design & Build Challenge.
