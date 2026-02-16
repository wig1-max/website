# Omzato Accounting Website — Complete Rebuild Plan

## Overview
Complete multi-page, production-ready website for Omzato Accounting (Aryan Madaan, ACCA) targeting the Panchkula/Chandigarh Tricity market. 25+ files, fully functional calculators, aggressive WhatsApp conversion system, and comprehensive SEO.

## Key Business Details
- **Owner**: Aryan Madaan (ACCA, B.Business, Applied Accounting)
- **Brand**: Omzato Accounting
- **Phone/WhatsApp**: +917986772124
- **Email**: hello.omzato@gmail.com
- **Address**: SCO 37, Cabin No 16, 1st Floor, Sector 11, Panchkula, Haryana 134112
- **Hours**: Mon-Sat 8:30 AM - 5 PM
- **Domain**: omzato.com
- **Hosting**: Netlify
- **Clients**: 200+ served
- **USP**: ITC recovery, cloud accounting (QuickBooks), dedicated attention (15-20 clients), transparent pricing
- **Contact method**: WhatsApp only (no traditional forms per client request)
- **Tagline**: "Hisaab Seedha, Service Pakka!" (Clean accounts, solid service)

## Design System

### Colors (derived from logo)
- Primary Navy: `#1B2A4A` (trust, authority)
- Accent Green: `#27AE60` (growth, money, action)
- Light Navy: `#2C3E6B`
- Soft Green: `#E8F5E9`
- Dark BG: `#0F1923`
- Light BG: `#F8FAFE`
- Text Dark: `#1A1A2E`
- Text Muted: `#6B7280`
- White: `#FFFFFF`
- Warning/CTA Orange: `#F59E0B`
- Error Red: `#EF4444`
- Border: `#E5E7EB`

### Typography
- Headings: Inter (700, 600) — clean, professional, modern
- Body: Inter (400, 500)
- Accent/Numbers: DM Mono or system monospace for pricing

### Components
- Glass-morphism cards with subtle backdrop-blur
- Gradient CTAs (navy → green)
- Subtle box shadows and hover lifts
- Smooth scroll animations (CSS-only IntersectionObserver, no AOS library — lighter)
- Pulse animation on WhatsApp button

## File Structure

```
/
├── index.html                          # Homepage
├── services.html                       # All services with pricing
├── why-us.html                         # Differentiators & credentials
├── testimonials.html                   # Client testimonials
├── contact.html                        # Contact page (WhatsApp-focused)
├── success.html                        # Form/action confirmation
├── blog.html                           # Blog listing (placeholder — skip content for now)
├── blog-post-template.html             # Blog post template
├── calculators.html                    # Calculator hub
├── hra-calculator.html                 # HRA Calculator
├── income-tax-calculator.html          # Income Tax Calculator
├── home-loan-calculator.html           # Home Loan Calculator
├── emi-calculator.html                 # EMI Calculator
├── fd-calculator.html                  # FD Calculator
├── ppf-calculator.html                 # PPF Calculator
├── retirement-calculator.html          # Retirement Calculator
├── goal-calculator.html                # Goal Planning Calculator
├── fire-calculator.html                # FIRE Calculator
├── blog/
│   ├── itr-filing-guide-panchkula.html
│   ├── gst-registration-panchkula.html
│   └── tax-saving-tips-tricity.html
├── css/
│   └── styles.css                      # Complete design system + all page styles
├── js/
│   ├── scripts.js                      # Navigation, animations, shared utilities
│   ├── calculators.js                  # All calculator logic
│   ├── whatsapp-nudge.js              # WhatsApp popup conversion system
│   └── blog.js                         # Blog filtering, TOC, share
├── sitemap.xml
└── robots.txt
```

## Build Order (Dependency-Aware)

### Phase A: Foundation (CSS + JS core)
1. **css/styles.css** — Complete design system: reset, variables, typography, grid, components (buttons, cards, badges, navigation, footer, forms, modals, animations, responsive breakpoints, print styles)
2. **js/scripts.js** — Mobile nav, sticky header, scroll animations (IntersectionObserver), back-to-top, shared header/footer HTML injection, cookie consent, analytics placeholder
3. **js/whatsapp-nudge.js** — Complete popup system with all 8 trigger types, localStorage tracking, max 2 per session rule, contextual messages

### Phase B: Core Pages
4. **index.html** — Homepage with hero, services overview, trust signals (200+ clients, 5+ years, QuickBooks ProAdvisor), CTA sections, testimonials preview, calculator preview, FAQ section
5. **services.html** — All service categories with detailed pricing (ITR, GST, Company Registration, Audit, Bookkeeping, Advisory), comparison tables, process steps, FAQs
6. **why-us.html** — Differentiators page: ITC recovery, cloud accounting, dedicated attention, transparent pricing, Aryan's credentials, ACCA qualification, international education, QuickBooks ProAdvisor
7. **contact.html** — WhatsApp-focused contact page with Google Maps embed, address, business hours, WhatsApp CTA buttons, quick inquiry categories
8. **testimonials.html** — Generated realistic Indian testimonials (10), organized by service type, with ratings
9. **success.html** — Confirmation page after WhatsApp redirect or action completion

### Phase C: Calculator Hub + Individual Calculators
10. **calculators.html** — Hub page linking to all 9 calculators with descriptions
11. **js/calculators.js** — All calculator logic:
    - HRA: Basic salary, DA, HRA received, rent paid, metro/non-metro
    - Income Tax: Old vs New regime, all slabs for FY 2024-25, deductions
    - Home Loan: EMI, eligibility based on income, bank comparison
    - EMI: Principal, rate, tenure for all loan types
    - FD: Maturity amount, quarterly/monthly compounding, bank rates
    - PPF: Year-wise breakdown, 15-year lock-in, extension
    - Retirement: Corpus needed, inflation-adjusted, SIP required
    - Goal: Target amount, timeline, SIP/lumpsum needed
    - FIRE: Financial independence number, safe withdrawal rate, Indian context
12. **hra-calculator.html** through **fire-calculator.html** (9 pages) — Each with full implementation, educational content, FAQs, schema markup

### Phase D: Blog System
13. **js/blog.js** — Category filtering, TOC generation, share buttons, reading time
14. **blog.html** — Blog listing page with category filters (placeholder content — client said skip for now, but structure ready)
15. **blog-post-template.html** — Template with TOC, share, author bio, related posts, CTAs
16. **blog/itr-filing-guide-panchkula.html** — Sample blog post 1
17. **blog/gst-registration-panchkula.html** — Sample blog post 2
18. **blog/tax-saving-tips-tricity.html** — Sample blog post 3

### Phase E: SEO & Config
19. **sitemap.xml** — All pages with priorities and change frequencies
20. **robots.txt** — Allow all, point to sitemap

## SEO Strategy Per Page

Every page gets:
- Unique `<title>` tag following "Primary KW | Secondary KW | Omzato Accounting Panchkula"
- Meta description < 160 chars with CTA
- Canonical URL
- Open Graph + Twitter Card meta
- Schema.org structured data (LocalBusiness + page-specific)
- BreadcrumbList schema
- Proper H1-H6 hierarchy
- Internal links to related pages
- Alt text on all images

### Target Keywords
| Page | Primary Keywords |
|------|-----------------|
| Homepage | CA in Panchkula, Tax Consultant Panchkula, Chartered Accountant Panchkula |
| Services | GST Filing Panchkula, ITR Filing Panchkula, Company Registration Panchkula |
| Calculators | HRA Calculator India, Income Tax Calculator 2024-25, EMI Calculator Online |
| Why Us | Best CA Firm Panchkula, Accounting Services Tricity |
| Contact | CA Office Panchkula, Tax Office Near Me |

## WhatsApp System Design
- Floating button: Always visible, pulse animation, bottom-right
- Entry popup (5s): "Welcome! FREE consultation — WhatsApp us!"
- Exit intent: "Wait! 20% off first filing"
- Scroll 50%: Contextual slide-in
- 45s timer: Bottom bar with offer
- Calculator result: "Want expert advice?"
- Service page: "Get exact pricing"
- Idle 30s: "Our team is online"
- **Rules**: Max 2 popups/session, localStorage tracking, respect dismiss, beautiful design, contextual pre-filled messages, clear "No thanks" option

## Testimonials (Generated — Realistic Indian)
10 testimonials covering: salaried ITR, GST filing, company registration, bookkeeping, tax planning — with realistic Indian names, business types, and quotes mentioning specific Omzato differentiators.

## Promotional Offers to Display
- First consultation FREE for all services
- "Launch Offer: 30% off Annual GST Package" (within 50% max discount)
- "Startup Special: Free 3 months bookkeeping with Company Registration"
- Seasonal: "ITR Season Special — File before July 31 and save 20%"

## Technical Notes
- Pure HTML/CSS/JS, no frameworks
- Shared header/footer via JS template literals (injected on DOMContentLoaded)
- CSS custom properties for theming
- IntersectionObserver for scroll animations (no external library)
- localStorage for popup state, cookie consent
- Print CSS for calculator results
- Lazy loading on images (`loading="lazy"`)
- Google Analytics GA4 placeholder (user adds their ID)
- Netlify-optimized (no server-side requirements)
