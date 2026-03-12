# CLAUDE.md — Superteam Malaysia "Terminal // MY"

## WHAT WE'RE BUILDING

Official Superteam Malaysia website for a bounty submission. Cinematic, game-UI-inspired design called "Terminal // MY" — the entire site is framed as a tactical CRT terminal experience.

- **Bounty:** Superteam Malaysia Website Design & Build Challenge
- **Prize:** 3,000 USDG (1st: 1,500 / 2nd: 1,000 / 3rd: 500)
- **Deadline:** March 27, 2026

### Evaluation Criteria
- UI/UX Design Quality: 20%
- Frontend Implementation (Next.js): 25%
- Code Quality & Architecture: 20%
- Feature Completeness: 15%
- Performance & Responsiveness: 10%
- Web3 Identity & Malaysia Relevance: 10%

---

## TECH STACK (ACTUAL INSTALLED)

```
next: 16.1.6 (App Router) — NOTE: spec says 14 but create-next-app installed 16
react: 19.2.3
typescript: ^5
tailwindcss: ^4 (with @tailwindcss/postcss)
@react-three/fiber: ^9.5.0
@react-three/drei: ^10.7.7
three: ^0.183.2
gsap: ^3.14.2 (installed but NOT yet used — framer-motion used instead)
framer-motion: ^12.35.2
@supabase/supabase-js: ^2.99.0
@supabase/ssr: ^0.9.0
clsx + tailwind-merge (cn() utility)
lucide-react (icons)
@tailwindcss/typography (dev)
```

**IMPORTANT**: Tailwind is v4, NOT v3. The `@theme inline` directive in globals.css is Tailwind v4 syntax. There is NO tailwind.config.ts — config is in globals.css.

---

## PROJECT ROOT

`C:\Project\Solana Website\superteam-my\`

---

## COMPLETE FILE INVENTORY (56 TypeScript files)

### App Router Pages
```
src/app/layout.tsx              — Root layout: Outfit + JetBrains Mono + Silkscreen fonts
src/app/page.tsx                — Landing page: EntryTransition → 10 sections composed
src/app/globals.css             — Tailwind v4 @theme, CSS vars, CRT keyframes, effects
src/app/members/page.tsx        — /members: search, filters, MemberGrid with mock data
src/app/admin/layout.tsx        — Admin auth guard + sidebar nav (mock sessionStorage auth)
src/app/admin/page.tsx          — Admin dashboard with stat cards
src/app/admin/members/page.tsx  — CRUD table for members (mock)
src/app/admin/events/page.tsx   — Events placeholder + Luma sync button
src/app/admin/partners/page.tsx — Partner list with reorder UI
src/app/admin/content/page.tsx  — JSON editor for site content sections
```

### API Routes
```
src/app/api/members/route.ts    — GET mock members (TODO: Supabase)
src/app/api/events/route.ts     — GET empty events (TODO: Luma proxy)
src/app/api/revalidate/route.ts — POST ISR revalidation with secret token
```

### 3D Entry Experience
```
src/components/entry/Room3D.tsx           — 3D scene with IBM PC GLB model, camera zoom, click-to-enter; ScreenTerminal has id="crt-screen-content"; Leva panel hidden
src/components/entry/EntryTransition.tsx  — Lazy-loads Room3D on desktop, 2D fallback on mobile (<768px); passes siteRef to CinematicReveal
src/components/entry/CinematicReveal.tsx  — Slit-wipe transition: green slit sweeps CRT screen, then CRT expands to fill viewport; pixel clip-path via rAF, no React state during animation
```

### Hero Section
```
src/components/hero/HeroSection.tsx   — Boot sequence animation → Shift5-style split layout
src/components/hero/LanguageSwap.tsx  — Rotating text: MEMBINA → 建设 → கட்டு → BUILD
src/components/hero/SystemStatus.tsx  — Numbered status list with green dots + binary stream
```

### Landing Page Sections (all "use client")
```
src/components/sections/MissionSection.tsx     — id="mission": 6 skill-tree nodes + SVG connections
src/components/sections/StatsSection.tsx       — id="stats": animated counters + circular hub display
src/components/sections/MembersSpotlight.tsx   — id="members": portrait sidebar + CRT detail panel, auto-cycles
src/components/sections/PartnersSection.tsx    — id="partners": CRT monitor grid (8 partners, 4 colors)
src/components/sections/WallOfLove.tsx         — id="wall-of-love": tweet cards inside CRTFrame
src/components/sections/FAQSection.tsx         — id="faq": category sidebar + Accordion
src/components/sections/JoinCTA.tsx            — id="join": massive gradient text + email subscribe
src/components/sections/EventsSection.tsx      — id="events": placeholder "coming soon"
```

### Layout Components
```
src/components/layout/Navbar.tsx    — Fixed top nav, transparent→blur on scroll, mobile menu
src/components/layout/Footer.tsx    — 4-column footer, terminal sign-off
src/components/layout/LeftRail.tsx  — Fixed left dots navigator, active section tracking
src/components/layout/CRTFrame.tsx  — Reusable CRT bezel wrapper (4 colors, dots, scanlines, crosshairs)
```

### Effects Components
```
src/components/effects/ScanlineOverlay.tsx — Repeating scanline + vignette overlays
src/components/effects/GlitchText.tsx      — Text with glitch animation clones
src/components/effects/BinaryStream.tsx    — Randomizing 8-bit binary strings
src/components/effects/Crosshair.tsx       — "+" marker at panel corners
src/components/effects/GridOverlay.tsx     — Dot grid pattern background
src/components/effects/TopographyBG.tsx    — SVG contour lines + batik diamond pattern
```

### UI Components
```
src/components/ui/Button.tsx       — primary/outline/ghost variants, sm/md/lg
src/components/ui/Badge.tsx        — green/purple/gold/dim variants
src/components/ui/SkillTag.tsx     — Clickable filter tags
src/components/ui/Counter.tsx      — Animated number counter (scroll-triggered)
src/components/ui/Accordion.tsx    — Expandable FAQ items with framer-motion
src/components/ui/SectionLabel.tsx — "// 0X. SECTION_NAME" monospace header
src/components/ui/Tooltip.tsx      — Simple hover tooltip
```

### Member Components
```
src/components/members/MemberCard.tsx    — Card with avatar initials, skills, hover badges
src/components/members/MemberGrid.tsx    — Animated grid with framer-motion layout
src/components/members/MemberSearch.tsx  — Terminal-style search input: > search_operator:
src/components/members/MemberFilters.tsx — Filter chips: All, Core Team, Rust, etc.
```

### Hooks
```
src/hooks/useScrollProgress.ts  — 0-1 scroll progress
src/hooks/useInView.ts          — IntersectionObserver, fires once
src/hooks/useMediaQuery.ts      — Reactive media query match
src/hooks/useActiveSection.ts   — Tracks which section is in viewport
```

### Lib / Utilities
```
src/lib/utils.ts              — cn() = clsx + tailwind-merge
src/lib/supabase/client.ts    — Browser Supabase client (createBrowserClient)
src/lib/supabase/server.ts    — Server Supabase client (RSC, cookies)
src/lib/supabase/admin.ts     — Service role client
src/lib/luma.ts               — Luma API fetch helper (requires LUMA_API_KEY)
```

### Types
```
src/types/member.ts   — Member + Achievement interfaces
src/types/event.ts    — Event interface
src/types/partner.ts  — Partner interface
src/types/content.ts  — SiteContent, HeroContent, StatsContent, FAQItem
```

### Database
```
supabase/migrations/001_members.sql      — members table
supabase/migrations/002_events.sql       — events table
supabase/migrations/003_partners.sql     — partners table
supabase/migrations/004_content.sql      — site_content + profiles tables + seed data
supabase/migrations/005_rls_policies.sql — RLS: public read, admin all, editor insert/update
supabase/seed.sql                        — Sample members + partners data
```

### Public Assets
```
public/models/ibm_pc.glb — 17MB IBM PC 3D model (1 node "model", 1 mesh)
```

---

## DESIGN SYSTEM

### Colors (Tailwind v4 — used as `text-sol-green`, `bg-bg-terminal`, etc.)
- sol-green: #00FFA3 (primary accent)
- sol-purple: #9945FF
- sol-blue: #14F195
- bg-terminal: #0A0A0F (darkest bg)
- bg-panel: #111118
- bg-elevated: #1A1A24
- border-dim: #2A2A3A
- border-active: rgba(0,255,163,0.4)
- text-primary: #E8E8ED
- text-secondary: #8888A0
- gold-accent: #FFB800 (Malaysian cultural element)

### Fonts (loaded via next/font/google in layout.tsx)
- `font-display` = Outfit (weights: 400, 500, 700, 900)
- `font-mono` = JetBrains Mono (weights: 400, 500)
- `font-pixel` = Silkscreen (weight: 400)

### CSS Utility Classes (globals.css)
- `.text-glow` / `.text-glow-purple` — text-shadow glow
- `.box-glow` / `.box-glow-purple` — box-shadow glow
- `.crt-scanlines::before` — repeating scanline gradient
- `.crt-vignette::after` — radial vignette
- `.crt-flicker` — subtle opacity flicker animation
- `.pulse-glow` — pulsing box-shadow
- `.cursor-blink` — blinking cursor
- `.noise-overlay::before` — SVG turbulence noise
- `.chromatic-aberration` — SVG filter for GTA switch effect
- `@keyframes fadeOut` — used by 3D room white flash transition

---

## DECISIONS MADE

1. **Next.js 16 instead of 14**: `create-next-app@latest` installed 16. The bounty says 14 but the actual version doesn't affect judging significantly. If needed, pin with `create-next-app@14`.

2. **Tailwind v4**: Installed by create-next-app. Uses `@theme inline` in globals.css instead of tailwind.config.ts. Color tokens defined there.

3. **framer-motion over GSAP for most animations**: GSAP is installed but framer-motion was used for section reveals, accordion, language swap, and member transitions. GSAP should be added for ScrollTrigger-based scroll animations (spec item 13 in build order).

4. **Mock data everywhere**: All sections use hardcoded arrays. Supabase clients are set up but NO queries are wired. The admin dashboard uses sessionStorage for auth (not real Supabase Auth).

5. **IBM PC GLB model**: User provided `public/models/ibm_pc.glb` (17MB, single node "model"). Loaded with `useGLTF` from drei. The previous procedural laptop/CRT was replaced.

6. **3D entry is desktop-only**: `EntryTransition.tsx` checks `window.innerWidth < 768` — mobile gets a 2D fallback with Solana logo + "INITIALIZE TERMINAL" button.

7. **No external asset loading in 3D**: Removed `<Environment preset="night" />` and `<Text font="...">` from Room3D because they tried loading external HDR/font files that hung the loading forever.

8. **Framer-motion variants `ease` typing**: When using `ease: "easeOut"` inside a `variants` object, it must be `ease: "easeOut" as const` to satisfy TypeScript. Fixed in PartnersSection and WallOfLove.

9. **CinematicReveal transition (COMPLETE)**: Slit-wipe approach implemented. Green slit sweeps left→right within the CRT monitor screen using pixel-based `clip-path: polygon()` animated via rAF. CRT bounds measured from `id="crt-screen-content"` on ScreenTerminal via `getBoundingClientRect`. After wipe, CRT area expands to fill viewport covering the 3D room. 3D room stays fully visible around the CRT during the entire wipe. Layout stack: outer wrapper is `position: relative; z-index: 200` (transparent) so 3D canvas shows through outside clip-path; background `#0A0A0F` lives on the inner div. All animation via direct DOM manipulation + rAF — no React state mutations during animation. React 18 Strict Mode handled via local `cancelled` flag. Leva dev panel hidden. Debug labels removed.

---

## CURRENT KNOWN BUGS / ISSUES

1. **3D click-to-enter may need tuning**: The invisible `ClickZone` box in Room3D is positioned at `[0, 0.6, 0.8]` with size `[2.5, 2, 2]`. If the IBM PC model has a different scale/position than expected, the click zone may not align. User reported click wasn't working with the previous procedural model — fixed by adding a large invisible box. May still need position adjustments depending on the GLB model's origin point and scale.

2. **3D light positions may not match GLB screen**: The spotLight at `[0, 0.8, 0.6]` and pointLight at `[0, 0.7, 0.8]` are guesses for where the CRT screen is on the ibm_pc.glb model. If the model's screen faces a different direction or is at a different position, these need adjusting.

3. **GLB model is 17MB**: This is large for initial page load. Should consider:
   - Compressing with `gltf-pipeline` or `gltfpack`
   - Adding a proper loading indicator with percentage
   - Using Draco compression

4. **GSAP not actually used**: Installed but no import. The spec calls for GSAP ScrollTrigger for scroll-driven animations (build order step 13). Currently only framer-motion `whileInView` is used.

5. **No real Supabase connection**: All data is mock. `.env.local` doesn't exist yet. Admin auth is fake (sessionStorage).

6. **No Luma integration**: Events section is placeholder. `src/lib/luma.ts` has the fetch helper but it's never called.

7. **No actual partner/member images**: All avatars use colored initial placeholders. Partner logos show text names.

8. **PowerShell execution policy**: User's Windows blocks `npm` in PowerShell. Workaround: `cmd /c "npm run dev"` or `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.

9. **MembersSpotlight section number label**: Shows "03" but should be "04" (Mission=02, Stats=03, Members=04).

10. **ScreenOverlay component in Room3D**: There's an unused `ScreenOverlay` function left over from the previous version. It was removed in the GLB rewrite but may have been referenced. (Verified: it was removed.)

---

## ENVIRONMENT VARIABLES NEEDED

Create `.env.local` (see `.env.local.example`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LUMA_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVALIDATION_SECRET=  (for /api/revalidate)
```

---

## HOW TO RUN

```bash
cd "C:\Project\Solana Website\superteam-my"
# If PowerShell blocks npm:
cmd /c "npm run dev"
# Or in bash:
npm run dev
```

Dev server runs on http://localhost:3000. Build with `npx next build`.

---

## NEXT STEPS (from original spec build order)

### Completed (steps 1-12, 14-15 + CinematicReveal):
- [x] 1. Scaffold — Next.js + Tailwind + TypeScript + fonts + color vars + base layout
- [x] 2. UI Components — CRTFrame, ScanlineOverlay, SectionLabel, Badge, SkillTag, Crosshair, BinaryStream
- [x] 3. Hero Section — Shift5 layout, System Status, LanguageSwap
- [x] 4. Mission Section — Skill tree nodes with connection lines
- [x] 5. Stats Section — Sidebar stats + circular display
- [x] 6. Members Section — Portrait sidebar + detail panel + GTA switch
- [x] 7. Partners Section — CRT monitor stack grid
- [x] 8. Wall of Love — CRT-framed tweet grid
- [x] 9. FAQ Section — Category sidebar + accordion
- [x] 10. Join CTA — Valorant dramatic typography
- [x] 11. Footer
- [x] 12. Left Rail Navigator
- [x] 14. 3D Room Entry — R3F scene with IBM PC GLB model + CinematicReveal slit-wipe transition (COMPLETE)
- [x] 15. Members Page — /members directory with search + filters

### Still TODO:
- [ ] 13. GSAP Scroll Animations — ScrollTrigger for all scroll-triggered effects (currently framer-motion whileInView)
- [ ] 16. Supabase Integration — Connect DB, fetch real data, replace all mock data
- [ ] 17. Admin Dashboard — Wire up real Supabase Auth + CRUD operations
- [ ] 18. Luma Integration — Events API proxy + display
- [ ] 19. Polish — Responsive testing, performance optimization, SEO, OG images
- [ ] 20. Deploy — Vercel, final README, Figma export
- [ ] GLB optimization — Compress ibm_pc.glb from 17MB
- [ ] 3D light tuning — Align screen glow with actual GLB screen position
- [ ] Add real member avatars + partner logos
- [ ] Figma file creation (required deliverable)
- [ ] Tweet submission tagging @SuperteamMY

---

## ARCHITECTURE NOTES

### Page Flow
1. User visits `/` → `EntryTransition` mounts
2. Desktop: lazy-loads `Room3D` (3D scene with IBM PC model in dark room)
3. User clicks PC → camera zooms into screen → `onEnter()` callback fires
4. `CinematicReveal` begins: green slit sweeps left→right across the CRT screen (measured via `getBoundingClientRect` on `id="crt-screen-content"`). 3D room remains fully visible around the CRT during the wipe.
5. After slit wipe: CRT area expands (clip-path grows) to fill entire viewport, covering the 3D room.
6. `onComplete` fires → `page.tsx` sets `entered=true` → all sections render, Navbar + LeftRail appear
7. Hero section plays boot sequence animation (typing lines), then reveals content

**Layout stack during transition:**
- `siteRef` outer wrapper: `position: relative; z-index: 200; background: transparent` — 3D canvas shows through outside the clip-path region
- Inner div: `background: #0A0A0F` — only visible inside the clip-path region
- All animation: rAF + direct DOM style mutations (no React state changes during animation)
- React 18 Strict Mode: handled via local `cancelled` flag (not mountedRef)

### Component Pattern
- All components are `"use client"` (needed for hooks, framer-motion, interactivity)
- `cn()` from `@/lib/utils` used everywhere for class merging
- Color tokens: `text-sol-green`, `bg-bg-terminal`, `border-border-dim`, etc.
- Font utilities: `font-display`, `font-mono`, `font-pixel`
- Section IDs match LeftRail navigation: hero, mission, stats, members, partners, wall-of-love, faq, join

### 3D Scene (Room3D.tsx)
- Uses `@react-three/fiber` Canvas with ACES filmic tone mapping
- IBM PC model loaded via `useGLTF("/models/ibm_pc.glb")` + `.preload()`
- Scene cloned with `.clone(true)` to enable shadow settings
- Green phosphor screen glow: spotLight + pointLight at estimated screen position
- Fake volumetric light: additive-blended transparent cone mesh
- Dust particles: BufferGeometry with manual position attribute
- Camera: idle gentle sway → on click: cubic ease-out zoom + FOV narrowing
- Click detection: invisible box mesh with onPointerOver/Out for cursor + hover state
- ScreenTerminal DOM element has `id="crt-screen-content"` so `CinematicReveal` can measure its bounds via `getBoundingClientRect`
- Transition: `onEnter()` callback fires → `CinematicReveal` runs slit-wipe then viewport-fill (old green-flash div approach replaced)

### Data Flow (current — all mock)
- Sections have hardcoded arrays (MOCK_MEMBERS, MOCK_PARTNERS, MOCK_TWEETS, FAQ_DATA)
- API routes return static JSON
- Admin pages display static data with non-functional edit/delete buttons
- When Supabase is connected: use `createClient()` from `@/lib/supabase/server.ts` in RSC, `@/lib/supabase/client.ts` in client components
