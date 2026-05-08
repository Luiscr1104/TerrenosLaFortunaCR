# BuyLandCR Homepage Refresh — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the BuyLandCR homepage to look professional and trustworthy for foreign retirees — fixing 6 bugs, adding 2 new sections, and rewriting copy to match the retirement audience.

**Architecture:** Targeted modifications to existing Astro components + 2 new `.astro` components (`TrustGuarantees`, `HowItWorks`). No new routes, no backend changes, no design system refactor. Each task is a self-contained change that can be verified independently in the dev server.

**Tech Stack:** Astro 5, TailwindCSS v4 (utility-first, no config file — just `@import "tailwindcss"` in global.css), pnpm. Dev: `pnpm dev`. Build: `pnpm build`.

---

## File Map

| Action | File | What changes |
|--------|------|-------------|
| Modify | `src/pages/index.astro` | Remove dead imports, add new section components, remove `<Process />` |
| Modify | `src/components/Hero.astro` | Rewrite h1, subheadline, CTA labels, trust pill text |
| Modify | `src/components/OurTeam.astro` | Fix `accentGold` color (#16a34a→#D4AF37), new copy, add credential tags |
| Modify | `src/components/ContactForm.astro` | Fix `accentGold` color (#16a34a→#D4AF37) |
| Modify | `src/components/FeaturedProperties.astro` | Remove false "50+ exclusive properties" stat |
| Create | `src/components/TrustGuarantees.astro` | New dark-bg section with 6 guarantee cards + countries bar |
| Create | `src/components/HowItWorks.astro` | New 4-step buying process section |

---

## Task 1: Clean up dead code in index.astro

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Remove unused import and const**

In `src/pages/index.astro`, remove the `HeroSplit` import and the unused `stats` const. The frontmatter block should go from this:

```astro
---
import Hero from "../components/Hero.astro";
import Layout from "../layouts/Layout.astro";
import WhyBuyWithUs from "../components/WhyBuyWithUs.astro";
import FeaturedProperties from "../components/FeaturedProperties.astro";

import HeroSplit from "../components/HeroSplit.astro";
import ShowcaseSplit from "../components/ShowcaseSplit.astro";
import ContactForm from "../components/ContactForm.astro";
import OurTeam from "../components/OurTeam.astro";
import FeaturedBlogs from "../components/FeaturedBlogs.astro";
import { HeroScrollDemo } from "../components/HeroArenalScroll.jsx";
import { ParallaxScrollSecondDemo } from "../components/Galery.tsx";
import Process from "../components/Process.astro";

const stats = [
	{ value: "11,800 m²", label: "Private Land" },
	{ value: "4 Beds • 3 Baths", label: "Modern Design" },
	{ value: "Pool & Jacuzzi", label: "Outdoor Luxury" },
];

// Welcome to Astro! Wondering what to do next? Check out the Astro documentation at https://docs.astro.build
// Don't want to use any of this? Delete everything in this file, the `assets`, `components`, and `layouts` directories, and start fresh.
---
```

To this:

```astro
---
import Hero from "../components/Hero.astro";
import Layout from "../layouts/Layout.astro";
import WhyBuyWithUs from "../components/WhyBuyWithUs.astro";
import FeaturedProperties from "../components/FeaturedProperties.astro";
import ShowcaseSplit from "../components/ShowcaseSplit.astro";
import ContactForm from "../components/ContactForm.astro";
import OurTeam from "../components/OurTeam.astro";
import FeaturedBlogs from "../components/FeaturedBlogs.astro";
import { HeroScrollDemo } from "../components/HeroArenalScroll.jsx";
import { ParallaxScrollSecondDemo } from "../components/Galery.tsx";
import Process from "../components/Process.astro";
---
```

- [ ] **Step 2: Verify build is clean**

```bash
pnpm build 2>&1 | tail -20
```

Expected: `✓ Completed in` with no TypeScript errors about unused variables.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "chore: remove unused HeroSplit import and stats const from index.astro"
```

---

## Task 2: Fix false stat in FeaturedProperties.astro

**Files:**
- Modify: `src/components/FeaturedProperties.astro`

- [ ] **Step 1: Replace the false stat text**

In `src/components/FeaturedProperties.astro`, find and replace the paragraph below the "View All Properties" button:

Find:
```astro
<p class="mt-4 text-sm text-neutral-500">
  50+ exclusive properties available • New listings every week
</p>
```

Replace with:
```astro
<p class="mt-4 text-sm text-neutral-500">
  Handpicked exclusive properties • Personally inspected and verified
</p>
```

- [ ] **Step 2: Start dev server and verify**

```bash
pnpm dev
```

Open `http://localhost:4321` and scroll to the Featured Properties section. Confirm the stat text below the "View All Properties" button now reads "Handpicked exclusive properties • Personally inspected and verified".

- [ ] **Step 3: Commit**

```bash
git add src/components/FeaturedProperties.astro
git commit -m "fix: remove false '50+ properties' stat in FeaturedProperties"
```

---

## Task 3: Fix accentGold color bug in ContactForm.astro

**Files:**
- Modify: `src/components/ContactForm.astro`

- [ ] **Step 1: Fix the accentGold default value**

In `src/components/ContactForm.astro`, the default props block currently uses green as "gold". Fix both color defaults:

Find:
```astro
const {
  image = "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/984f3b88-418c-42e0-8a13-ca8f69ce6900/public",
  accentGold = "#16a34a",
  accentGreen = "#16a34a",
} = Astro.props;
```

Replace with:
```astro
const {
  image = "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/984f3b88-418c-42e0-8a13-ca8f69ce6900/public",
  accentGold = "#D4AF37",
  accentGreen = "#1a4a2e",
} = Astro.props;
```

- [ ] **Step 2: Verify in dev server**

Open `http://localhost:4321` and scroll to the contact form. Verify:
- The "Request Consultation" button is now **gold** (`#D4AF37`) instead of green
- The "WhatsApp Now" button remains green (`#1a4a2e`)
- Form focus rings show gold color when clicking into input fields

- [ ] **Step 3: Commit**

```bash
git add src/components/ContactForm.astro
git commit -m "fix: correct accentGold color from green #16a34a to gold #D4AF37 in ContactForm"
```

---

## Task 4: Rewrite Hero.astro copy for retirement audience

**Files:**
- Modify: `src/components/Hero.astro`

- [ ] **Step 1: Update the h1 headline**

Find:
```astro
      <h1
        class="mb-4 sm:mb-6 font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight px-4"
        style="text-shadow: 0 4px 12px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,1);"
      >
        Own Premium Real Estate in
        <span
          class="block text-accent-gold mt-1 sm:mt-2"
          style="text-shadow: 0 4px 16px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,1), 0 0 30px rgba(212,175,55,0.2);"
        >
          La Fortuna, Costa Rica
        </span>
      </h1>
```

Replace with:
```astro
      <h1
        class="mb-4 sm:mb-6 font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight px-4"
        style="text-shadow: 0 4px 12px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,1);"
      >
        Live Your Best Chapter
        <span
          class="block text-accent-gold mt-1 sm:mt-2"
          style="text-shadow: 0 4px 16px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,1), 0 0 30px rgba(212,175,55,0.2);"
        >
          In Costa Rica's Paradise
        </span>
      </h1>
```

- [ ] **Step 2: Update the subheadline**

Find:
```astro
      <p
        class="mb-6 sm:mb-10 text-base sm:text-xl md:text-2xl lg:text-3xl text-white font-normal max-w-4xl mx-auto leading-relaxed px-4"
        style="text-shadow: 0 3px 10px rgba(0,0,0,0.9), 0 1px 5px rgba(0,0,0,1);"
      >
        Secure your legacy near <strong class="font-bold text-white"
          >Arenal Volcano</strong
        > •
        <strong class="font-bold text-white">Dollarized Assets</strong> with high
        appreciation • <strong class="font-bold text-white"
          >Turnkey Investment</strong
        > for global buyers
      </p>
```

Replace with:
```astro
      <p
        class="mb-6 sm:mb-10 text-base sm:text-xl md:text-2xl lg:text-3xl text-white font-normal max-w-4xl mx-auto leading-relaxed px-4"
        style="text-shadow: 0 3px 10px rgba(0,0,0,0.9), 0 1px 5px rgba(0,0,0,1);"
      >
        Titled land and luxury homes near <strong class="font-bold text-white"
          >Arenal Volcano</strong
        > — for those ready to retire in <strong class="font-bold text-white"
          >nature, safety</strong
        >, and <strong class="font-bold text-white">year-round sunshine</strong>
      </p>
```

- [ ] **Step 3: Update the primary CTA button label**

Find:
```astro
          View Investment Portfolio
```

Replace with:
```astro
          🏡 See Available Properties
```

- [ ] **Step 4: Update the WhatsApp CTA label**

Find:
```astro
          WhatsApp: Investor Concierge
```

Replace with:
```astro
          💬 Free Consultation via WhatsApp
```

- [ ] **Step 5: Update the last trust pill (Wealth Preservation → Bilingual Legal Support)**

Find:
```astro
          <span>Wealth Preservation</span>
```

Replace with:
```astro
          <span>Bilingual Legal Support</span>
```

- [ ] **Step 6: Verify in dev server**

Open `http://localhost:4321`. Verify in the hero:
- Headline reads "Live Your Best Chapter / In Costa Rica's Paradise"
- Subheadline mentions "retire in nature, safety, and year-round sunshine"
- Gold CTA reads "🏡 See Available Properties"
- Green CTA reads "💬 Free Consultation via WhatsApp"
- Bottom-right trust pill reads "Bilingual Legal Support"

- [ ] **Step 7: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: rewrite Hero copy for retirement audience (retirement lifestyle focus)"
```

---

## Task 5: Redesign OurTeam.astro

**Files:**
- Modify: `src/components/OurTeam.astro`

- [ ] **Step 1: Replace the full component**

Replace the entire contents of `src/components/OurTeam.astro` with:

```astro
---
const team = [
  {
    name: "Luis Roberto Zúñiga Sánchez",
    role: "Co-Owner · Full-Stack Developer",
    bio: "Born and raised in La Fortuna. Built this platform from scratch to give international buyers a transparent, secure experience. Your digital and operational point of contact.",
    image: "/luis.webp",
    tags: ["🇨🇷 La Fortuna Native", "Tech & Operations", "Bilingual"],
  },
  {
    name: "José Ignacio González Zúñiga",
    role: "Co-Owner · Sales & Drone Cinematography",
    bio: "Certified drone operator and bilingual sales advisor. He'll walk the land with you — virtually or in person — and guide you through every step of a transparent, compliant purchase.",
    image: "/onell.webp",
    tags: ["🇨🇷 La Fortuna Native", "Drone Certified", "English / Spanish"],
  },
];
---

<section id="team" class="relative py-24 bg-white overflow-hidden">
  <div class="text-center mb-16 md:mb-20">
    <div
      class="inline-flex items-center gap-2 bg-[#1a4a2e]/10 text-[#1a4a2e] font-semibold text-sm px-5 py-2 rounded-full border border-[#1a4a2e]/20 mb-4 shadow-sm tracking-wide"
    >
      <span class="inline-block h-2.5 w-2.5 rounded-full bg-[#1a4a2e]"></span>
      Your Local Experts
    </div>

    <h2
      class="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-[#0d2218] mb-5 tracking-tight leading-tight"
    >
      Meet the Team Behind
      <span class="text-[#1a4a2e] font-black"> BuyLandCR</span>
    </h2>

    <p class="text-neutral-700 text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-medium">
      Two locals from La Fortuna who know every road, every view, and every legal step.
      When you buy with us, you deal with the owners — directly.
    </p>
  </div>

  <div class="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
    {team.map((member) => (
      <article
        class="group relative rounded-3xl border border-[#1a4a2e]/20 bg-white
               shadow-[0_10px_35px_-15px_rgba(0,0,0,0.2)]
               hover:shadow-[0_18px_45px_-10px_rgba(212,175,55,0.25)]
               transition-all duration-500"
      >
        <div class="aspect-[4/3] overflow-hidden rounded-t-3xl">
          <img
            src={member.image}
            alt={`${member.name} — ${member.role}`}
            class="h-full w-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div class="p-8 text-center">
          <h3 class="text-2xl md:text-3xl font-display font-extrabold text-[#0d2218] mb-1">
            {member.name}
          </h3>
          <p class="text-sm font-bold text-[#1a4a2e] uppercase tracking-wide mb-4">
            {member.role}
          </p>
          <p class="text-neutral-600 text-sm md:text-base leading-relaxed mb-5">
            {member.bio}
          </p>
          <div class="flex flex-wrap justify-center gap-2">
            {member.tags.map((tag) => (
              <span class="bg-[#f0f7f0] text-[#1a4a2e] px-3 py-1 rounded-full text-xs font-semibold">
                {tag}
              </span>
            ))}
          </div>
          <div class="mt-6 w-24 h-[2px] mx-auto bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full"></div>
        </div>
      </article>
    ))}
  </div>

  <div class="mt-10 text-center px-6">
    <p class="inline-flex items-center gap-2 text-sm font-semibold text-[#0d2218]/80 bg-[#1a4a2e]/10 border border-[#1a4a2e]/30 px-5 py-2.5 rounded-full">
      📍 Based in La Fortuna · Available Mon–Sun, 8am–8pm · Direct owners, no middlemen
    </p>
  </div>

  <div class="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(60%_40%_at_80%_0%,#D4AF37,transparent)]"></div>
</section>
```

- [ ] **Step 2: Verify in dev server**

`OurTeam` is still not wired into `index.astro` yet (that's Task 7). To test it in isolation, temporarily add `<OurTeam />` anywhere in `index.astro`, check visually, then remove before committing. Verify:
- Section pill reads "Your Local Experts" in green
- Photos load correctly (Luis and José)
- Credential tags appear below each bio
- Footer bar reads "📍 Based in La Fortuna · Available Mon–Sun, 8am–8pm · Direct owners, no middlemen"
- Hover on cards shows a faint gold shadow
- No green-colored gold elements (all gold accents use `#D4AF37`)

- [ ] **Step 3: Commit**

```bash
git add src/components/OurTeam.astro
git commit -m "feat: redesign OurTeam — fix gold color, add credential tags, retirement-focused copy"
```

---

## Task 6: Create TrustGuarantees.astro

**Files:**
- Create: `src/components/TrustGuarantees.astro`

- [ ] **Step 1: Create the component**

Create `src/components/TrustGuarantees.astro` with the following content:

```astro
---
const guarantees = [
  {
    icon: "⚖️",
    title: "100% Legal & Title-Clean",
    description:
      "Every property listed is verified with a Costa Rican notary. Clean Fee Simple title, no liens, no surprises.",
  },
  {
    icon: "🌐",
    title: "Close From Anywhere",
    description:
      "Full remote-closing process: digital documents, international wire, bilingual notary. No flights required.",
  },
  {
    icon: "📹",
    title: "Live Video Tours",
    description:
      "Before you commit to anything, José walks the property with you on a live video call. See every corner, ask anything.",
  },
  {
    icon: "🏦",
    title: "Independent Escrow",
    description:
      "Your funds are held by a licensed Costa Rican escrow company — not us. Released only when title transfers to your name.",
  },
  {
    icon: "👤",
    title: "You Deal With the Owners",
    description:
      "No junior agents, no brokers. Luis and José handle your purchase personally from first message to deed signing.",
  },
  {
    icon: "📋",
    title: "Full Due Diligence Package",
    description:
      "Registry report, survey, zoning, utilities — we prepare the complete due diligence file before you sign anything.",
  },
];

const countries = [
  { flag: "🇺🇸", name: "United States" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇨🇭", name: "Switzerland" },
  { flag: "🇬🇧", name: "United Kingdom" },
  { flag: "🇳🇱", name: "Netherlands" },
];
---

<section class="relative py-20 md:py-28 bg-[#0d2218] overflow-hidden">
  <div
    class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none"
  ></div>

  <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
    <div class="text-center mb-14">
      <div
        class="inline-flex items-center gap-2 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-2 rounded-full text-sm font-semibold mb-4"
      >
        <span class="inline-block h-2 w-2 rounded-full bg-[#D4AF37]"></span>
        Why Buyers Trust Us
      </div>
      <h2
        class="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight"
      >
        Buying Land Abroad
        <span class="text-[#D4AF37]"> Shouldn't Be a Leap of Faith</span>
      </h2>
      <p class="text-white/60 text-lg max-w-2xl mx-auto">
        Every step of the process is designed to protect you — legally,
        financially, and personally.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
      {
        guarantees.map((item) => (
          <div class="bg-white/[0.05] border border-[#D4AF37]/15 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-[#D4AF37]/30 transition-all duration-300">
            <div class="text-3xl mb-3">{item.icon}</div>
            <h3 class="text-[#D4AF37] font-bold text-base mb-2">{item.title}</h3>
            <p class="text-white/65 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))
      }
    </div>

    <div
      class="bg-white/[0.04] border border-[#D4AF37]/10 rounded-xl px-6 py-4 flex flex-wrap items-center justify-between gap-4"
    >
      <span class="text-white/40 text-xs font-semibold uppercase tracking-widest"
        >Serving buyers from</span
      >
      {
        countries.map((c) => (
          <span class="text-white text-sm font-semibold">
            {c.flag} {c.name}
          </span>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 2: Temporarily wire into index.astro to preview**

Add to `src/pages/index.astro` frontmatter temporarily:
```astro
import TrustGuarantees from "../components/TrustGuarantees.astro";
```

And add `<TrustGuarantees />` anywhere in the body. Open `http://localhost:4321` and verify:
- Dark forest green background (`#0d2218`)
- 6 cards in a 3-column grid (2-col on tablet, 1-col on mobile)
- Each card has icon, gold title, white/60 description
- Countries bar at the bottom shows 6 flags
- Hover on cards lightens the background slightly

- [ ] **Step 3: Remove temporary wiring from index.astro**

Undo the temporary import and `<TrustGuarantees />` — final wiring happens in Task 7.

- [ ] **Step 4: Commit**

```bash
git add src/components/TrustGuarantees.astro
git commit -m "feat: create TrustGuarantees component — 6 guarantee cards + countries bar"
```

---

## Task 7: Create HowItWorks.astro

**Files:**
- Create: `src/components/HowItWorks.astro`

- [ ] **Step 1: Create the component**

Create `src/components/HowItWorks.astro` with the following content:

```astro
---
const steps = [
  {
    num: 1,
    icon: "💬",
    title: "Free Consultation",
    description:
      "We learn about your goals, timeline, and budget. You ask us anything. No pressure, no sales pitch.",
  },
  {
    num: 2,
    icon: "📹",
    title: "Virtual Property Tour",
    description:
      "José walks the land with you via live video call. Drone footage, 360° views, every detail you need.",
  },
  {
    num: 3,
    icon: "⚖️",
    title: "Legal & Due Diligence",
    description:
      "Our notary verifies title, boundaries, and zoning. Your funds go to escrow — protected until everything checks out.",
  },
  {
    num: 4,
    icon: "🎉",
    title: "Remote Closing",
    description:
      "Sign documents digitally or via apostille. Title transfers to your name. You're a landowner in Costa Rica.",
  },
];
---

<section class="relative py-20 md:py-28 bg-[#F7F6F2] overflow-hidden">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
    <div class="text-center mb-14">
      <div
        class="inline-flex items-center gap-2 bg-[#1a4a2e]/10 text-[#1a4a2e] border border-[#1a4a2e]/20 px-4 py-2 rounded-full text-sm font-semibold mb-4"
      >
        <span class="inline-block h-2 w-2 rounded-full bg-[#1a4a2e]"></span>
        Simple Process
      </div>
      <h2
        class="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#0d2218] mb-4 tracking-tight"
      >
        How to Buy Land in
        <span class="text-[#1a4a2e]"> Costa Rica</span> — From Anywhere
      </h2>
      <p class="text-neutral-600 text-lg max-w-2xl mx-auto">
        Four straightforward steps. No flights needed, no guesswork. We handle
        the complexity so you focus on the excitement.
      </p>
    </div>

    <div class="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <!-- Connector line visible on lg+ only -->
      <div
        class="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#D4AF37] via-[#1a4a2e] to-[#D4AF37] z-0"
      ></div>

      {
        steps.map((step) => (
          <div class="relative z-10 bg-white rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.07)] border border-[#1a4a2e]/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300">
            <div class="w-12 h-12 bg-[#0d2218] text-[#D4AF37] font-black text-lg rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#D4AF37]">
              {step.num}
            </div>
            <div class="text-2xl mb-2">{step.icon}</div>
            <h3 class="font-bold text-[#0d2218] text-sm mb-2">{step.title}</h3>
            <p class="text-neutral-500 text-xs leading-relaxed">
              {step.description}
            </p>
          </div>
        ))
      }
    </div>

    <div
      class="bg-white border border-[#D4AF37]/30 rounded-xl p-4 flex items-start gap-3 max-w-2xl mx-auto"
    >
      <span class="text-xl flex-shrink-0">⏱️</span>
      <p class="text-sm text-neutral-600">
        <strong class="text-[#0d2218]">Typical timeline: 30–60 days</strong> from
        first contact to title transfer. Fully manageable remotely — most buyers
        never travel until after closing.
      </p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Temporarily wire into index.astro to preview**

Add to `src/pages/index.astro` frontmatter temporarily:
```astro
import HowItWorks from "../components/HowItWorks.astro";
```

Add `<HowItWorks />` anywhere in the body. Open `http://localhost:4321` and verify:
- Off-white background (`#F7F6F2`)
- 4 step cards in a row on desktop, 2×2 grid on tablet, stacked on mobile
- Numbered circles are dark forest with gold border and gold number
- Horizontal gold-to-green connector line visible between circles on desktop
- Timeline note at bottom in a white bordered card

- [ ] **Step 3: Remove temporary wiring from index.astro**

- [ ] **Step 4: Commit**

```bash
git add src/components/HowItWorks.astro
git commit -m "feat: create HowItWorks component — 4-step buying process for remote buyers"
```

---

## Task 8: Wire all sections into index.astro

**Files:**
- Modify: `src/pages/index.astro`

This is the final assembly task. All components are built and verified — now update the page to use them in the correct order.

- [ ] **Step 1: Update the frontmatter imports**

Replace the current frontmatter block in `src/pages/index.astro` with:

```astro
---
import Hero from "../components/Hero.astro";
import Layout from "../layouts/Layout.astro";
import WhyBuyWithUs from "../components/WhyBuyWithUs.astro";
import FeaturedProperties from "../components/FeaturedProperties.astro";
import ShowcaseSplit from "../components/ShowcaseSplit.astro";
import ContactForm from "../components/ContactForm.astro";
import OurTeam from "../components/OurTeam.astro";
import TrustGuarantees from "../components/TrustGuarantees.astro";
import HowItWorks from "../components/HowItWorks.astro";
import FeaturedBlogs from "../components/FeaturedBlogs.astro";
import { HeroScrollDemo } from "../components/HeroArenalScroll.jsx";
import { ParallaxScrollSecondDemo } from "../components/Galery.tsx";
---
```

Note: `Process` import is removed (component file is kept but no longer used).

- [ ] **Step 2: Replace the page body**

Replace the entire `<Layout>` block with:

```astro
<Layout preloadImage="https://i.ytimg.com/vi/DxbLZ_RPCuo/maxresdefault.jpg">
  <!-- 1. HOOK: Hero Section -->
  <Hero />

  <!-- 2. PRODUCT: Immediate Value -->
  <FeaturedProperties />

  <!-- 2b. UPSELL: Flagship Property -->
  <ShowcaseSplit
    offers={[
      {
        title: "The Ultimate Wealth Preservation Asset: Luxury Turnkey Estate",
        subtitle:
          "An architectural masterpiece engineered for high-yield returns. This 4-bedroom sanctuary isn't just a home; it's a performing asset. Featuring panoramic volcano views, resort-style amenities, and established rental potential, it offers the perfect hedge against inflation while delivering immediate lifestyle dividends. Located just 16 minutes from La Fortuna.",
        promoTitle: "💎 Premium Portfolio",
        promoHighlight: "High ROI Potential",
        ctaLabel: "View Investment Details",
        ctaHref: "/properties/villa-arenal-luxury-4br",
        image:
          "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/f41525fe-ec6d-4132-0f8f-df340eb94200/public",
        locationChip: "Arenal, Costa Rica",
        stats: [
          { value: "4 / 3", label: "Beds / Baths" },
          { value: "3,000 m²", label: "Estate Size" },
          { value: "$715k", label: "Turnkey Price" },
        ],
        accent: "#16a34a",
      },
    ]}
  />

  <!-- 2c. VISUAL TRANSITION -->
  <HeroScrollDemo client:visible />

  <!-- 3. TRUST: Meet the Team (moved up — retirement buyers need this early) -->
  <OurTeam />

  <!-- 4. SOCIAL PROOF: Guarantees (replaces testimonials until collected) -->
  <TrustGuarantees />

  <!-- 5. AUTHORITY: Why Us? -->
  <WhyBuyWithUs />

  <!-- 6. PROCESS: How It Works (replaces Process.astro CTA band) -->
  <div class="mb-20">
    <HowItWorks />
  </div>

  <!-- 7. ACTION: Contact Form -->
  <div class="mb-32">
    <ContactForm />
  </div>

  <!-- 8. LIFESTYLE: Visual Gallery -->
  <div class="mb-32">
    <ParallaxScrollSecondDemo client:visible />
  </div>

  <!-- 9. SEO & EDUCATION -->
  <FeaturedBlogs />
</Layout>
```

- [ ] **Step 3: Run build to verify no errors**

```bash
pnpm build 2>&1 | tail -30
```

Expected: clean build, no TypeScript errors, no missing import warnings.

- [ ] **Step 4: Full page review in dev server**

```bash
pnpm dev
```

Open `http://localhost:4321` and scroll the full page top to bottom. Verify the order is:
1. ✅ Hero — new copy ("Live Your Best Chapter")
2. ✅ Featured Properties — no "50+" stat
3. ✅ ShowcaseSplit — luxury estate (unchanged)
4. ✅ HeroScrollDemo — scroll animation (unchanged)
5. ✅ **OurTeam** — now visible with redesign (was missing before)
6. ✅ **TrustGuarantees** — dark section with 6 guarantee cards
7. ✅ WhyBuyWithUs — color fix applied (gold CTAs should be gold not green)
8. ✅ **HowItWorks** — 4-step process (replaces CTA band)
9. ✅ ContactForm — gold submit button (not green)
10. ✅ ParallaxScrollSecondDemo — unchanged
11. ✅ FeaturedBlogs — unchanged

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: wire OurTeam, TrustGuarantees, HowItWorks into homepage — remove Process section"
```

---

## Done

At this point all 8 tasks are complete. The site now:
- Shows Luis and José prominently to retirement buyers (trust)
- Explains exactly how to buy remotely in 4 steps (removes mystery)
- Lists 6 concrete legal/process guarantees (replaces missing testimonials)
- Uses consistent gold (`#D4AF37`) and forest green (`#1a4a2e`) throughout
- Has copy that speaks to retiring abroad rather than investor ROI
- Has no false stats, no dead imports, no broken color variables
