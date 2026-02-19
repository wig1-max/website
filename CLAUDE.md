# Omzato Accounting Website — Context File

## Overview
Static HTML/CSS/JS website for **Omzato Accounting**, a CA/accounting firm in **Panchkula, Haryana, India** serving the Chandigarh Tricity region (Panchkula, Chandigarh, Mohali).

- **Owner:** Aryan Madaan (ACCA-qualified)
- **Domain:** https://omzato.com
- **WhatsApp:** +917986772124 (primary CTA across entire site)
- **Branch:** `claude/rebuild-accounting-website-india-rv1Br`
- **Repo:** `wig1-max/website`

## Tech Stack
- Pure HTML/CSS/JS — no frameworks, no build tools
- Google Fonts: Inter (400,500,600,700,800)
- No external JS dependencies
- All pages are static `.html` files

## Brand & Design
- **Primary color:** Navy `#1e3a5f`
- **Accent color:** Green `#2ecc71`
- **Font:** Inter
- **Style:** Clean, professional, mobile-first responsive
- Cookie consent banner, back-to-top button, sticky header on all pages

## File Structure (29 files)

```
css/styles.css                — Full design system (~2800 lines)
js/scripts.js                 — Header/footer injection, nav, scroll animations
js/calculators.js             — All 9 calculator formulas
js/whatsapp-nudge.js          — 8-trigger WhatsApp popup (scroll, time, exit-intent, etc.)
js/blog.js                    — Blog filtering, TOC generation, share buttons

index.html                    — Homepage (hero, services, pricing preview, testimonials, FAQ)
services.html                 — 6 service categories with tabbed pricing
why-us.html                   — ACCA positioning, comparison table, differentiators
contact.html                  — WhatsApp-focused contact, embedded map
testimonials.html             — 10 client reviews
success.html                  — Form submission confirmation
calculators.html              — Calculator hub linking all 9 tools

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

## Architecture Patterns

### Header/Footer Injection
- Every page has `<header id="site-header"></header>` and `<footer id="site-footer"></footer>`
- `scripts.js` injects the full header and footer HTML on DOMContentLoaded
- Navigation links, WhatsApp button, and footer content are all managed centrally in `scripts.js`

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
| Service | Price |
|---------|-------|
| ITR-1 Filing | ₹2,500 |
| ITR-2/3 Filing | ₹5,000–8,000 |
| GST Registration | ₹3,000 |
| GST Monthly Filing | ₹1,500/month |
| Company Registration | ₹8,000 |
| Bookkeeping | ₹5,000/month |

## Common Refinement Tasks
- To change pricing: edit `services.html` and `index.html` (pricing preview section)
- To change WhatsApp number: search for `917986772124` across all files
- To add a new blog post: copy `blog-post-template.html` to `blog/new-post.html`, update paths to use `../`
- To add a new calculator: add formula to `calculators.js`, create new HTML page, add to `calculators.html` hub
- To edit header/footer/nav: edit the injection code in `js/scripts.js`
- To change colors/fonts: edit CSS custom properties at top of `css/styles.css`
