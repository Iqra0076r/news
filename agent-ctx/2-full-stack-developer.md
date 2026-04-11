---
Task ID: 2
Agent: full-stack-developer
Task: Create 4 professional legal/info page components for SaveitBro News website

Work Log:
- Read `/home/z/my-project/worklog.md` for full project context
- Analyzed existing codebase: types (AppView already includes "about", "contact", "privacy", "terms"), store, page.tsx, footer.tsx, navbar.tsx, cookie-consent.tsx
- Created `/src/components/legal/` directory

**Files Created:**

1. **`/src/components/legal/about-page.tsx`** — About Us page
   - Hero section with gradient background, site name, tagline
   - Mission statement
   - What We Do section (13 categories listed in a grid)
   - Commitment to Accuracy & Editorial Integrity (5 bullet points)
   - How We Source Content (4-step numbered process)
   - Our Team section (Engineering, Product & Design, Content Curation cards)
   - "Contact Us" CTA at bottom

2. **`/src/components/legal/contact-page.tsx`** — Contact Us page
   - Hero section with gradient background
   - 3 info cards: Email (contact@saveitbro.com), Business Hours, Office (New Delhi, India)
   - Professional contact form (name, email, subject, message) with client-side validation and success animation
   - Social media links (Twitter, Facebook, Instagram, LinkedIn)
   - Other Ways to Reach Us section (specific department emails)

3. **`/src/components/legal/privacy-page.tsx`** — Comprehensive Privacy Policy (Media.net critical)
   - 14 sections covering all standard requirements
   - Key sections: Information We Collect, How We Use Information, Cookies & Tracking, Third-Party Services, Interest-Based Advertising, User Choices & Opt-Out, Data Retention, Children's Privacy, Data Security, International Transfers, GDPR & CCPA Compliance, Changes to Policy, Contact
   - Media.net specifically mentioned in advertising, cookies, targeting, and opt-out sections
   - Opt-out links: Media.net privacy page, Google Ads Settings, NAI, DAA
   - GDPR rights listed (7 rights for EU users)
   - CCPA rights listed (5 rights for California users)
   - Data controller information in amber callout box

4. **`/src/components/legal/terms-page.tsx`** — Comprehensive Terms of Service
   - 15 sections covering all standard requirements
   - Sections: Acceptance of Terms, Description of Service, User Conduct, Intellectual Property, Disclaimer of Warranties, Limitation of Liability, Advertising, Links to Third-Party Content, Privacy, Indemnification, Changes to Terms, Governing Law, Severability, Entire Agreement, Contact
   - Media.net and Google AdSense mentioned in Advertising section
   - Cross-linking to Privacy Policy and About page via setView()

**Files Updated:**

5. **`/src/app/page.tsx`** — Added imports and view routing for all 4 new pages
   - Imported AboutPage, ContactPage, PrivacyPage, TermsPage
   - Added 4 new view blocks with motion.div wrappers, max-w-4xl layout

6. **`/src/components/layout/footer.tsx`** — Wired up footer links
   - Changed `<a href="#">` to `<button onClick={() => setView("...")}>` for About, Contact, Privacy Policy, Terms of Service
   - Added `setView` destructuring from useAppStore

**Styling Consistency:**
- All pages use "use client" directive
- Back button using ArrowLeft icon + `useAppStore().setView("home")`
- Consistent layout: `mx-auto max-w-4xl px-4 sm:px-6 py-6`
- Card backgrounds with `rounded-xl border border-border/50 bg-card p-6`
- Body text: `text-sm text-muted-foreground leading-relaxed`
- Red accent icons matching the site's crimson theme
- Section dividers using `<Separator />`
- Hero sections with gradient backgrounds (red-600 to red-900)

**Verification:**
- `bun run lint` — 0 errors
- Dev server compiled successfully
- All views ("about", "contact", "privacy", "terms") properly integrated into the SPA router

Stage Summary:
- 4 professional legal/info pages created for Media.net publisher compliance
- Privacy Policy is comprehensive with GDPR/CCPA compliance, Media.net advertising disclosures, and opt-out instructions
- Terms of Service covers all standard legal sections including advertising disclaimers
- All pages accessible via footer links and internally cross-linked
- Clean lint, dev server compiling, all views wired up and functional
