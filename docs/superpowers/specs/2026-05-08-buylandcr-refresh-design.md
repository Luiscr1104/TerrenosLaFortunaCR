# BuyLandCR — Homepage Refresh Design Spec
**Date:** 2026-05-08  
**Approach:** Strategic Refresh (Option B) — fix broken + add 4 high-impact sections  
**Stack:** Astro + TailwindCSS v4 + React islands

---

## Context & Problem

BuyLandCR is a new boutique real estate business (no clients yet) selling land and homes near La Fortuna, Costa Rica. The site exists but looks unprofessional and untrustworthy compared to competitors. Primary audience: **foreign retirees from US, Canada, and Europe** (ages 50–70) making a high-trust, high-ticket purchase decision remotely.

Core insight: a retirement buyer's primary question is **"Can I trust these people?"** — not "Is this a good investment?" The current site fails on trust.

---

## Design Direction

**Professional Reliable (Hybrid):** Deep forest green + gold + clean white. Like a boutique real estate agency between Sotheby's and a high-end eco-resort. Not a startup, not a flashy investment platform — a serious, trustworthy local team.

### Unified Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `--forest-deep` | `#0d2218` | Hero bg, section headers, navbar |
| `--forest-mid` | `#1a4a2e` | Primary green, badges, tags |
| `--gold-primary` | `#D4AF37` | CTAs, accents, highlights |
| `--gold-light` | `#F5E08A` | Gold tints, subtle accents |
| `--off-white` | `#F7F6F2` | Section backgrounds |
| `--text-dark` | `#1B1B1B` | Body text |

**Bug fix required:** `accentGold` is currently defined as `#16a34a` (green) in `OurTeam.astro` and `ContactForm.astro`. Must be corrected to `#D4AF37` throughout.

---

## New Homepage Structure

| # | Section | Status | Change |
|---|---------|--------|--------|
| 1 | Hero | Existing | Copy rewrite — retirement lifestyle focus |
| 2 | Featured Properties | Existing | No changes |
| 2b | ShowcaseSplit (luxury estate) | Existing | No changes — keep in current position |
| 2c | HeroScrollDemo | Existing | No changes — keep in current position |
| 3 | Our Team | Existing component, **missing from page** | Add to index.astro after HeroScrollDemo + redesign |
| 4 | Social Trust / Guarantees | **New** | Full new section |
| 5 | Why Buy With Us | Existing | Color token fix only |
| 6 | How It Works (4 steps) | **New** — replaces current Process band | Full new component |
| 7 | Contact Form | Existing | Color token fix only (no position change) |
| 8 | Parallax Gallery + Blog + Footer | Existing | No changes |

---

## Section Specifications

### ① Hero — Copy Rewrite

**Current problem:** Copy is investment-focused ("Dollarized Assets", "Wealth Preservation", "Turnkey Investment") — wrong tone for a retirement buyer who wants lifestyle, safety, and peace.

**New headline:**
```
Live Your Best Chapter
In Costa Rica's Paradise
```

**New subheadline:**
```
Titled land and luxury homes near Arenal Volcano — for those ready to retire in nature, safety, and year-round sunshine.
```

**Primary CTA:** `🏡 See Available Properties →` (links to /properties)  
**Secondary CTA:** `💬 Free Consultation via WhatsApp`

**Trust pills (keep, refine):**
- ✅ 100% Foreign Ownership
- ✅ Fee Simple Title
- ✅ Remote Closing Available
- ✅ Bilingual Legal Support

No other changes to Hero structure (video background, layout, animations).

---

### ③ Our Team — Add to Homepage + Redesign

**Current bug:** Component is imported in `index.astro` but never rendered in the JSX. Add `<OurTeam />` after `<FeaturedProperties />`.

**Design updates:**
- Section pill: "Your Local Experts"
- Headline: `Meet the Team Behind BuyLandCR`
- Subheadline: `Two locals from La Fortuna who know every road, every view, and every legal step. When you buy with us, you deal with the owners — directly.`
- Team cards: add credential tags (🇨🇷 La Fortuna Native, Bilingual, Drone Certified, etc.)
- Footer bar: `📍 Based in La Fortuna · Available Mon–Sun, 8am–8pm · Direct owners, no middlemen`
- Fix `accentGold` variable to use `#D4AF37` not `#16a34a`

---

### ④ Social Trust Section — New Component

**File:** `src/components/TrustGuarantees.astro`  
**Position:** After OurTeam, before WhyBuyWithUs  
**Background:** `#0d2218` (dark forest)

**Purpose:** Replace testimonials (none available yet) with 6 structural trust guarantees. Design to be easily swappable for a testimonials section later — keep the same slot in the page structure.

**6 Trust Cards:**
1. ⚖️ **100% Legal & Title-Clean** — Every property verified with a Costa Rican notary. Clean Fee Simple title, no liens, no surprises.
2. 🌐 **Close From Anywhere** — Full remote-closing process: digital documents, international wire, bilingual notary. No flights required.
3. 📹 **Live Video Tours** — José walks the property with you on a live video call before you commit to anything.
4. 🏦 **Independent Escrow** — Funds held by a licensed Costa Rican escrow company — not us. Released only when title transfers.
5. 👤 **You Deal With the Owners** — No junior agents, no brokers. Luis and José handle your purchase personally from first message to deed signing.
6. 📋 **Full Due Diligence Package** — Registry report, survey, zoning, utilities — we prepare the complete file before you sign anything.

**Countries bar (bottom):** 🇺🇸 United States · 🇨🇦 Canada · 🇩🇪 Germany · 🇨🇭 Switzerland · 🇬🇧 United Kingdom · 🇳🇱 Netherlands

**Future:** When testimonials are collected, this section can be replaced or complemented with a `Testimonials.astro` component in the same page slot.

---

### ⑥ How It Works — New Component (Replaces Process.astro)

**File:** `src/components/HowItWorks.astro`  
**Replaces:** Current `Process.astro` (which is just a CTA band, not a process section)  
**Background:** `#F7F6F2` (off-white)

**4 Steps:**

| Step | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | 💬 | Free Consultation | We learn about your goals, timeline, and budget. You ask us anything. No pressure, no sales pitch. |
| 2 | 📹 | Virtual Property Tour | José walks the land with you via live video call. Drone footage, 360° views, every detail you need. |
| 3 | ⚖️ | Legal & Due Diligence | Our notary verifies title, boundaries, and zoning. Your funds go to escrow — protected until everything checks out. |
| 4 | 🎉 | Remote Closing | Sign documents digitally or via apostille. Title transfers to your name. You're a landowner in Costa Rica. |

**Timeline note:** "Typical timeline: 30–60 days from first contact to title transfer. Fully manageable remotely."

---

## Bug Fixes (Required)

| File | Bug | Fix |
|------|-----|-----|
| `src/components/OurTeam.astro` | `accentGold = "#16a34a"` (green) | Change to `#D4AF37` |
| `src/components/ContactForm.astro` | `accentGold = "#16a34a"` (green) | Change to `#D4AF37` |
| `src/pages/index.astro` | `<OurTeam />` imported but never rendered | Add `<OurTeam />` to page JSX |
| `src/components/FeaturedProperties.astro` | Stat: "50+ exclusive properties available" — false (only 5 exist) | Remove or change to "Handpicked exclusive properties" |
| `src/pages/index.astro` | `stats` const defined but never used | Remove unused const |
| `src/pages/index.astro` | `HeroSplit` imported but never used | Remove unused import |

---

## Files to Create / Modify

| Action | File |
|--------|------|
| **Create** | `src/components/TrustGuarantees.astro` |
| **Create** | `src/components/HowItWorks.astro` |
| **Modify** | `src/pages/index.astro` — add OurTeam, add new sections, remove unused imports |
| **Modify** | `src/components/Hero.astro` — copy rewrite |
| **Modify** | `src/components/OurTeam.astro` — fix color + redesign |
| **Modify** | `src/components/ContactForm.astro` — fix color token |
| **Modify** | `src/components/FeaturedProperties.astro` — fix false stat |
| **Remove from index** | `src/components/Process.astro` — remove `<Process />` from index.astro; keep the file but it will be unused (the video CTA content is superseded by HowItWorks) |

---

## Out of Scope

- Full design system refactor (CSS variables for all tokens) — targeted fixes only
- Testimonials section — deferred until real testimonials are collected
- Property page redesign
- Blog redesign
- Mobile-specific layout changes (existing mobile layout works)
- Any backend / API changes
