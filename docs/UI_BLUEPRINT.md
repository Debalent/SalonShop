# SalonShop UI Design Blueprint
> Venture-grade design system reference for contributors and designers.

---

## 1. Design Philosophy

**Guiding Principles**
- **Dark-first premium** — `surface-950` (#020510) base makes colors pop and signals seriousness
- **Trust at every touchpoint** — social proof, real numbers, and motion that feels alive, not gimmicky
- **Mobile-native** — every layout starts at 320px and scales up, no desktop-first hacks
- **Conversion-obsessed** — hierarchy guides eyes from headline → value proof → CTA in ≤ 5 seconds

---

## 2. Color System

### Brand Blues (Primary)
| Token       | Hex       | Usage                          |
|-------------|-----------|-------------------------------|
| `brand-300` | `#6a8ff5` | Hover states, soft accents     |
| `brand-400` | `#3d6af0` | Icon fills, secondary CTAs     |
| `brand-500` | `#1a50e0` | Primary CTAs, active states    |
| `brand-600` | `#1540c0` | CTA hover / pressed states     |
| `brand-700` | `#1030a0` | Deep shadows on brand elements |

```css
/* tailwind.config.ts */
brand: {
  300: '#6a8ff5',
  400: '#3d6af0',
  500: '#1a50e0',
  600: '#1540c0',
  700: '#1030a0',
}
```

### Surfaces
| Token          | Hex        | Usage                          |
|----------------|------------|-------------------------------|
| `surface-950`  | `#020510`  | Page / app background          |
| `surface-900`  | `#080e20`  | Card base                      |
| `surface-800`  | `#0e1730`  | Elevated cards / inputs        |
| `surface-700`  | `#162040`  | Hover on elevated              |

### Semantic
| Token        | Value     | Usage                            |
|--------------|-----------|----------------------------------|
| `text-white` | `#ffffff` | Display headings (100%)          |
| `white/60`   | 60% white | Body copy                        |
| `white/40`   | 40% white | Captions, metadata               |
| `white/[0.06]` | 6% white | Borders, dividers               |
| `teal-400`   | `#2dd4bf` | Accent / success / glow effects  |
| `rose-400`   | `#fb7185` | Error / destructive actions      |

### Gradients
```css
/* Headline gradient */
.gradient-text {
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Brand gradient (CTAs, hero BG) */
background: linear-gradient(135deg, #1a50e0, #6a8ff5);

/* Mesh hero background */
background:
  radial-gradient(ellipse 80% 60% at 50% -10%, rgba(26,80,224,0.35) 0%, transparent 70%),
  radial-gradient(ellipse 60% 40% at 80% 60%,  rgba(45,212,191,0.08) 0%, transparent 60%),
  #020510;
```

---

## 3. Typography System

### Font Stack
```css
--font-plus-jakarta: 'Plus Jakarta Sans', sans-serif;  /* Display / Headings */
--font-inter: 'Inter', sans-serif;                     /* Body / UI          */
```

### Type Scale
| Step  | Size        | Weight    | Line-height | Use                        |
|-------|-------------|-----------|-------------|----------------------------|
| `5xl` | 3rem        | 900 Black | 1.1         | Section heroes             |
| `6xl` | 3.75rem     | 900 Black | 1.05        | Hero H1 (mobile)           |
| `7xl` | 4.5rem+     | 900 Black | 1.0         | Hero H1 (desktop)          |
| `3xl` | 1.875rem    | 700 Bold  | 1.25        | Sub-section headings       |
| `xl`  | 1.25rem     | 600 Semi  | 1.5         | Card titles, feature names |
| `base`| 1rem        | 400       | 1.625       | Body copy                  |
| `sm`  | 0.875rem    | 400/500   | 1.5         | Captions, metadata         |
| `xs`  | 0.75rem     | 400       | 1.5         | Labels, badges             |

### Usage Rules
- **All headings use `font-display`** (`font-plus-jakarta`)
- **All body uses `font-sans`** (`font-inter`)
- `font-black` (`900`) only for hero/stats numbers
- `tracking-tight` on headings ≥ `text-3xl`
- Use `gradient-text` only on the primary keyword in a hero headline (max 1–2 words)

---

## 4. Spacing System

### Page Rhythm
```css
/* Section padding — prefer section-spacing utility */
.section-spacing { @apply py-20 md:py-28 lg:py-32; }

/* Page container — prefer page-container utility */
.page-container  { @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8; }
```

### Component Spacing Grid (8px base)
| Token  | px   | Common Use                    |
|--------|------|-------------------------------|
| `p-1`  | 4px  | Icon padding                  |
| `p-2`  | 8px  | Tight badge padding           |
| `p-4`  | 16px | Card inner padding (mobile)   |
| `p-6`  | 24px | Card inner padding (desktop)  |
| `gap-4`| 16px | Tight grid gaps               |
| `gap-6`| 24px | Default grid gap              |
| `gap-8`| 32px | Feature/testimonial grid      |
| `gap-12`| 48px | Stat grid spacing            |
| `mb-4` | 16px | After heading before subhead  |
| `mb-6` | 24px | After subhead before content  |
| `mb-16`| 64px | Section header before grid    |

---

## 5. Component Inventory

### Glass Card
```css
.glass-card {
  @apply rounded-2xl border border-white/[0.08] bg-white/[0.04]
         backdrop-blur-xl;
}
```
**Use for**: feature cards, stat containers, testimonial blocks

### Elevated Card
```css
.card {
  @apply rounded-2xl border border-white/[0.06] bg-surface-900;
}
```
**Use for**: dashboard panels, pricing tiers, booking cards

### Primary Button
```css
.btn-primary {
  @apply inline-flex items-center gap-2 px-6 py-3 rounded-xl
         bg-brand-500 hover:bg-brand-600 active:bg-brand-700
         text-white font-semibold text-sm
         transition-all duration-200
         shadow-[0_0_20px_rgba(26,80,224,0.4)]
         hover:shadow-[0_0_28px_rgba(26,80,224,0.6)]
         hover:-translate-y-0.5;
}
```

### Secondary Button
```css
.btn-secondary {
  @apply inline-flex items-center gap-2 px-6 py-3 rounded-xl
         border border-white/[0.12] bg-white/[0.04]
         text-white font-semibold text-sm
         hover:bg-white/[0.08] hover:border-white/20
         transition-all duration-200;
}
```

### Input Field
```css
.input-field {
  @apply w-full px-4 py-3 rounded-xl
         bg-white/[0.06] border border-white/[0.08]
         text-white placeholder:text-white/30
         focus:outline-none focus:border-brand-500/60 focus:bg-white/[0.08]
         transition-all duration-200;
}
```

### Eyebrow Pill
```html
<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
            border border-brand-500/30 bg-brand-500/10 mb-6">
  <span class="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
  <span class="text-xs font-semibold text-brand-300 uppercase tracking-wider">
    Label text
  </span>
</div>
```

### Glow Effect
```css
.shadow-glow-teal {
  box-shadow: 0 0 40px rgba(45, 212, 191, 0.15);
}
```
Apply sparingly — hero image, featured plan card, active booking step

---

## 6. Layout Blueprints

### Marketing Page Layout
```
┌─────────────────────────────────────────┐
│ Navbar (sticky, 64px, blur-on-scroll)   │
├─────────────────────────────────────────┤
│ HeroSection                             │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │ Copy (55%)   │  │ Live Preview    │ │
│  │ H1 + sub +   │  │ Card (45%)      │ │
│  │ CTAs         │  │ animated demo   │ │
│  └──────────────┘  └─────────────────┘ │
├─────────────────────────────────────────┤
│ StatsSection (border-y, 4 cols)         │
├─────────────────────────────────────────┤
│ FeaturesSection (3-col grid, 9 cards)   │
├─────────────────────────────────────────┤
│ HowItWorksSection (3 steps, alternating)│
├─────────────────────────────────────────┤
│ TestimonialsSection (masonry 2-col)     │
├─────────────────────────────────────────┤
│ PricingSection (3-tier, toggle)         │
├─────────────────────────────────────────┤
│ CtaSection (email capture card)         │
├─────────────────────────────────────────┤
│ Footer (6-col, border-t)                │
└─────────────────────────────────────────┘
```

### Dashboard Layout
```
┌───────────┬────────────────────────────────┐
│  Sidebar  │  Topbar (search + avatar)      │
│  (240px)  ├────────────────────────────────┤
│           │  Page content                  │
│  Nav      │   ┌──────┬──────┬──────┬────┐ │
│  links    │   │ KPI  │ KPI  │ KPI  │KPI │ │
│           │   └──────┴──────┴──────┴────┘ │
│  ─────    │                                │
│  User     │   ┌────────────┬─────────────┐ │
│  section  │   │ Main chart │ Side panel  │ │
│           │   │            │             │ │
│           │   └────────────┴─────────────┘ │
└───────────┴────────────────────────────────┘
Mobile: sidebar collapses to bottom tab bar (5 tabs)
```

### Booking Flow Layout
```
Progress bar (sticky top)
┌─────────────────────────────────────────┐
│  Step N of 4: [Label]                  │
│  ─────────────────────────────          │
│  [Step content — centered, max-w-lg]   │
│                                         │
│  [Back]             [Continue →]        │
└─────────────────────────────────────────┘
```

### Discover / Browse Page
```
Search bar (sticky, full-width)
Category pills (horizontal scroll on mobile)
─────────────────────────────────────────────
Filters sidebar (240px) | Worker card grid
  (hidden on mobile,      (auto-fill, min 280px)
   drawer on mobile)
─────────────────────────────────────────────
Worker Card:
┌─────────────────┐
│ Cover image     │
│ [avatar] [save] │
├─────────────────┤
│ Name  ★ rating  │
│ Specialty tags  │
│ Price + CTA     │
└─────────────────┘
```

---

## 7. Animation Patterns

All animations use **Framer Motion**. Prefer `whileInView` with `viewport={{ once: true }}` for scroll-triggered content.

### Fade Up (default entry)
```tsx
{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }
// Staggered: add transition.delay: i * 0.08
```

### Fade In (simpler)
```tsx
{ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4 } }
```

### Scale In (modals, cards)
```tsx
{ initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.3 } }
```

### Counter / Count-up
Use `useInView` + `setInterval` — see `AnimatedNumber` in `StatsSection.tsx`.  
**Never** put hooks inside `.map()` callbacks or IIFEs.

### Hover Effects
```tsx
// Standard lift
whileHover={{ y: -4, transition: { duration: 0.2 } }}

// Scale + lift (CTAs)
whileHover={{ scale: 1.02, y: -2 }}

// Card highlight
whileHover={{ borderColor: 'rgba(26,80,224,0.4)' }}
```

### Page-level transitions (Next.js app router)
Wrap route contents in:
```tsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
```

---

## 8. Responsive Breakpoints

| Name     | Breakpoint | Target                          |
|----------|------------|---------------------------------|
| (base)   | 0–639px    | Mobile phones                   |
| `sm`     | 640px      | Large phones / small tablets     |
| `md`     | 768px      | Tablets                          |
| `lg`     | 1024px     | Laptops                          |
| `xl`     | 1280px     | Desktops                         |
| `2xl`    | 1536px     | Wide desktops                    |

### Grid Patterns
```tsx
// Stats
"grid-cols-2 lg:grid-cols-4"

// Features
"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

// KPI row
"grid-cols-2 md:grid-cols-4"

// 2-col editorial (hero)
"grid-cols-1 lg:grid-cols-2"

// Dashboard sidebar
"hidden lg:flex w-60 flex-shrink-0"
```

---

## 9. Page-by-Page Component Map

### `/` (Landing)
```
Navbar → HeroSection → StatsSection → FeaturesSection →
HowItWorksSection → TestimonialsSection → PricingSection →
CtaSection → Footer
```

### `/discover`
```
Navbar → CategoryPills → WorkerGrid (WorkerCard[]) → Footer
```

### `/book/[slug]`
```
Navbar → ServiceSelector → DatePicker → TimeSlotPicker →
ContactForm → PaymentForm → ConfirmationScreen
```

### `/dashboard/client`
```
DashboardLayout( Sidebar, Topbar ) → KPIRow → UpcomingBookings →
LoyaltyCard → PastBookings
```

### `/dashboard/pro`
```
DashboardLayout → KPIRow (revenue, bookings, rating, payout) →
RevenueChart → BookingsTable → PayoutStatus
```

### `/onboarding`
```
Step 1: RoleSelector
Step 2: ProfileForm (name, bio, avatar, location)
Step 3: ServicesForm (add service + price + duration)
Step 4: AvailabilityCalendar (weekly hours)
Step 5: StripeConnect (payouts setup)
```

---

## 10. Accessibility Requirements

- All interactive elements must have visible focus rings: `focus-visible:ring-2 focus-visible:ring-brand-400`
- Color contrast: text on `surface-950` must be ≥ 4.5:1 (WCAG AA)
- Icon-only buttons require `aria-label`
- Animated elements must respect `prefers-reduced-motion`:
  ```tsx
  const prefersReduced = useReducedMotion() // framer-motion hook
  transition={{ duration: prefersReduced ? 0 : 0.4 }}
  ```
- Form inputs: always pair with `<label>` or `aria-label`
- Images: always provide `alt` text; decorative images use `alt=""`
- Modal dialogs: trap focus, `role="dialog"`, `aria-modal="true"`
- Skip nav link: `<a href="#main">Skip to content</a>` in Navbar

---

## 11. Icon System

Use **Lucide React** exclusively (`lucide-react`). Standard sizes:
- Navigation icons: `w-5 h-5`
- Feature card icons: `w-6 h-6` inside a `p-2.5 rounded-xl bg-brand-500/10` container
- Inline text icons: `w-4 h-4`
- Hero / large decorative: `w-8 h-8` or `w-10 h-10`

Icon container pattern:
```tsx
<div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20
                flex items-center justify-center mb-4">
  <Icon className="w-5 h-5 text-brand-400" />
</div>
```

---

## 12. Data Patterns

### Loading States
```tsx
// Skeleton shimmer
<div className="animate-pulse rounded-xl bg-white/[0.06] h-8 w-32" />

// Spinner
<div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
```

### Empty States
```tsx
<div className="text-center py-16 text-white/30">
  <IconName className="w-10 h-10 mx-auto mb-3 opacity-30" />
  <p className="font-semibold text-white/50">No [items] yet</p>
  <p className="text-sm mt-1">Message about how to add.</p>
</div>
```

### Error States
```tsx
<div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-rose-300 text-sm">
  Error message
</div>
```

### Success States
```tsx
<div className="rounded-xl border border-teal-500/20 bg-teal-500/10 px-4 py-3 text-teal-300 text-sm">
  Success message
</div>
```

---

## 13. Performance Rules

1. **Images**: Always `next/image` with `sizes` prop tuned to layout breakpoints
2. **Framer Motion**: Import only used components — `import { motion } from 'framer-motion'` (tree-shaken)
3. **Client components**: Mark `'use client'` only where needed (interactivity/hooks); keep layout/content server components
4. **Fonts**: Both fonts loaded via `next/font/google` in `layout.tsx` — don't import via CSS `@import`
5. **Bundle splitting**: Large pages (discover, dashboard) use `dynamic()` for heavy chart/map components
6. **Animations**: Use CSS transitions for hover states, Framer Motion for scroll-triggered and complex sequences

---

## 14. File Organization

```
src/
  app/                      # Next.js App Router pages
    (marketing)/            # Route group — no shared layout
    (dashboard)/            # Route group — DashboardLayout
    api/                    # API route handlers (server)
  components/
    layout/                 # Navbar, Footer, DashboardLayout, Sidebar
    sections/               # Landing page sections (HeroSection, etc.)
    ui/                     # Reusable primitives (Button, Input, Modal, etc.)
    booking/                # Booking flow components
    dashboard/              # Dashboard-specific widgets
  hooks/                    # Custom React hooks
  lib/                      # Server-side utilities (db, auth, stripe, etc.)
  types/                    # TypeScript type definitions
  utils/                    # Pure utility functions (shared with client)
```

---

*Last updated: Phase 7 — Venture Upgrade*  
*Maintained by: Engineering + Design*
