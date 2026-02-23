# Omzato Accounting Website — Context File

## Overview
Static HTML/CSS/JS website for **Omzato Accounting**, a CA/accounting firm in **Panchkula, Haryana, India** serving the Chandigarh Tricity region (Panchkula, Chandigarh, Mohali).

- **Owner:** Aryan Madaan (ACCA-qualified)
- **Domain:** https://omzato.com
- **WhatsApp:** +917986772124 (primary CTA across entire site)
- **Repo:** `wig1-max/website`

## Tech Stack
- Pure HTML/CSS/JS — no frameworks, no build tools
- Google Fonts: Inter (400,500,600,700,800) + Playfair Display (600,700,italic) — injected via `scripts.js`
- No external JS dependencies
- All pages are static `.html` files

## Brand & Design
- **Primary palette:** Navy `#1B2A4A` / Charcoal `#1C1C1C` / Charcoal-deep `#0D0D0D`
- **Accent color:** Green `#27AE60` / `#2ECC71`
- **Neutral tones:** Ivory `#F5F0E8` / Platinum `#E8E4DC`
- **Display font:** Playfair Display (serif) — used on hero titles, section headings, logo name, blockquotes
- **Body font:** Inter — used for all body copy, nav, labels
- **Price/number font:** DM Mono (monospace) — used on price amounts, stat numbers, calc results
- **Style:** Premium minimalist, charcoal/ivory palette, mobile-first responsive
- Cookie consent banner, back-to-top button, sticky header on all pages

## Brand Direction (Approved Feb 2026)
The "Elite Operator" persona: international standard (ACCA) brought to Panchkula. Key principles:
- **Serif for trust** (Playfair Display on headings/logo) — signals legacy and authority
- **Mono for outcomes** (DM Mono on prices/numbers) — signals precision and transparency
- **Charcoal/ivory palette** over the original navy — starker, more premium contrast
- **More negative space** on pricing cards — honesty through visual clarity
- **Voice:** Outcome-first, minimalist absolutes ("Flawless GST compliance. ₹40,000 avg ITC recovered.")

## File Structure (40 files)

```
css/styles.css                — Full design system (~2900 lines)
js/scripts.js                 — Header/footer injection, nav, scroll animations, font+favicon injection
js/calculators.js             — All 9 calculator formulas
js/whatsapp-nudge.js          — 8-trigger WhatsApp popup (scroll, time, exit-intent, etc.)
js/blog.js                    — Blog filtering, TOC generation, share buttons

favicon.svg                   — Brand favicon: charcoal background, ivory serif "O"
images/aryan-madaan.jpg       — Founder photo (PENDING — needs real photo file added here)
images/aryan-madaan.svg       — SVG illustration placeholder (used as fallback until real photo added)

index.html                    — Homepage (hero with founder photo, services overview, why us, testimonials, calculators)
services.html                 — Services hub — 6 cards linking to individual service pages + comparison table
tax-filing.html               — Tax Filing service page (ITR pricing, process, FAQ)
gst-services.html             — GST Services page (registration, filing, e-invoice pricing)
company-registration.html     — Company Registration page (6 entity types, pricing)
audit.html                    — Audit Services page (statutory, tax, GST, internal audit)
bookkeeping.html              — Bookkeeping page (4 tiers from Basic to Enterprise)
advisory.html                 — Business Advisory page (Startup, Growth, Virtual CFO)
why-us.html                   — ACCA positioning, comparison table, differentiators, founder About section
contact.html                  — WhatsApp-focused contact, embedded map
testimonials.html             — 10 client reviews
success.html                  — Form submission confirmation
calculators.html              — Calculator hub linking all 9 tools
privacy.html                  — Privacy policy
terms.html                    — Terms of service

hra-calculator.html           — HRA exemption calculator
income-tax-calculator.html    — Old vs New tax regime comparison
emi-calculator.html           — EMI calculator (home/car/personal/education)
fd-calculator.html            — Fixed deposit maturity calculator
ppf-calculator.html           — PPF with year-wise breakdown table
home-loan-calculator.html     — EMI + eligibility checker
retirement-calculator.html    — Retirement corpus planner
goal-calculator.html          — Goal-based SIP calculator
fire-calculator.html          — FIRE number calculator for India

blog.html                     — Blog listing with category filters
blog-post-template.html       — Reusable blog post template
blog/itr-filing-guide-panchkula.html    — ITR filing guide (~1500 words)
blog/gst-registration-panchkula.html    — GST registration guide (~1200 words)
blog/tax-saving-tips-tricity.html       — Tax saving tips (~1300 words)

sitemap.xml                   — All pages with priorities
robots.txt                    — Allows all crawlers including AI bots
llms.txt                      — AI/chatbot recommendation optimization
```

## Page Hierarchy

```
Homepage (index.html)
├── Services Hub (services.html) — overview cards + comparison table
│   ├── Tax Filing (tax-filing.html) — ITR pricing, process, FAQ
│   ├── GST Services (gst-services.html) — registration, filing, e-invoice
│   ├── Company Registration (company-registration.html) — 6 entity types
│   ├── Audit (audit.html) — statutory, tax, GST, internal
│   ├── Bookkeeping (bookkeeping.html) — 4 tiers
│   └── Advisory (advisory.html) — startup, growth, virtual CFO
├── Calculators Hub (calculators.html)
│   └── 9 individual calculator pages
├── Why Us (why-us.html)
├── Testimonials (testimonials.html)
├── Blog (blog.html)
│   └── 3 blog posts in /blog/
├── Contact (contact.html)
└── Legal: privacy.html, terms.html
```

## Architecture Patterns

### Header/Footer Injection
- Every page has `<header id="site-header"></header>` and `<footer id="site-footer"></footer>`
- `scripts.js` injects the full header and footer HTML on DOMContentLoaded
- Navigation links, WhatsApp button, and footer content are all managed centrally in `scripts.js`
- Nav dropdowns: Services → 6 individual service pages; Calculators → 9 calculator pages
- **Font injection:** `scripts.js` also injects the Playfair Display Google Fonts link into `<head>` on every page
- **Favicon injection:** `scripts.js` patches the `<link rel="icon">` to point to `/favicon.svg` on every page — no need to edit individual HTML files for favicon changes

### Blog Posts in /blog/ Subfolder
- Blog post HTML files live in `/blog/` — all asset paths use `../` prefix
- CSS: `../css/styles.css`, JS: `../js/scripts.js`, `../js/blog.js`, `../js/whatsapp-nudge.js`
- Internal links: `../services.html`, `../hra-calculator.html`, etc.

### Calculators
- All calculator logic is in `js/calculators.js`
- Each calculator page includes a form, results display area, and educational content
- Calculators auto-detect which page they're on and initialize accordingly

### WhatsApp Nudge System (8 triggers)
1. Scroll depth (50%)
2. Time on page (45s)
3. Exit intent (mouse leaves viewport)
4. Idle timeout (60s no interaction)
5. Calculator result completion
6. Bottom of page reached
7. Multiple page visits (3+)
8. Return visitor detection
- Max 2 nudges per session, 1-hour cooldown between sessions

### SEO on Every Page
- Schema.org JSON-LD: LocalBusiness, WebSite, BreadcrumbList, FAQPage (where applicable)
- Open Graph + Twitter Card meta tags
- Canonical URLs
- Semantic HTML with proper heading hierarchy

## Key Pricing (as shown on site)
| Service | Price | Page |
|---------|-------|------|
| ITR-1 Filing | ₹2,500 | tax-filing.html |
| ITR-2/3 Filing | ₹5,000–8,000 | tax-filing.html |
| GST Registration | ₹3,000 | gst-services.html |
| GST Monthly Filing | ₹1,500/month | gst-services.html |
| Pvt Ltd Registration | ₹14,999 | company-registration.html |
| Bookkeeping | ₹5,000/month | bookkeeping.html |

## Pending Items
- **Founder photo:** `images/aryan-madaan.jpg` needs to be replaced with Aryan's actual body-shot photo.
  The site currently falls back to `images/aryan-madaan.svg` (SVG illustration placeholder).
  To add the real photo: copy/upload the JPG to `/images/aryan-madaan.jpg` — no code changes needed.

## Common Refinement Tasks
- To change pricing: edit the specific service page (e.g., `tax-filing.html` for ITR prices)
- To change WhatsApp number: search for `917986772124` across all files
- To add a new blog post: copy `blog-post-template.html` to `blog/new-post.html`, update paths to use `../`
- To add a new calculator: add formula to `calculators.js`, create new HTML page, add to `calculators.html` hub, update nav in `scripts.js`
- To edit header/footer/nav: edit the injection code in `js/scripts.js`
- To change colors/fonts: edit CSS custom properties at top of `css/styles.css`
- To add a new service: create a new service page, add to nav in `scripts.js`, add card to `services.html`, update sitemap
- To update favicon: edit `/favicon.svg` — it auto-applies to all pages via `scripts.js`
- To change the display font: update `--font-display` in `css/styles.css` and the Google Fonts URL in `scripts.js`

## Future Refinements (Backlog)
- "Snap to clarity" micro-animation on calculator result reveal (blurred → sharp number)
- Outcome-first CTA language rewrites ("Get It Done. ₹2,500." vs. "File My ITR Now")
- Playfair italic pull-quote styling for testimonials
- `section-charcoal` utility class for dark-background sections
- Apple touch icon for iOS home screen (already partially wired in `scripts.js`)
