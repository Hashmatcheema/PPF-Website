# PPF Landing Page — Client-Ready Refinement Brief

**From:** UI/UX  
**For:** Client handoff  
**Date:** Feb 2026

This document lists refinements applied and optional next steps so the landing page is clear, accessible, and presentation-ready.

---

## 1. Header & navigation

**Applied**
- Nav links use a readable base size (1rem) and clear hover state.
- Logo and tagline have sufficient contrast; tagline hides on very small screens to avoid clutter.
- CTAs (Join Us, Volunteer, Donate) are grouped with consistent spacing.
- Mobile: full-screen overlay with all links and CTAs; closes on link click.

**Optional for client**
- If the client has a logo asset, replace the text “PPF” with an image (e.g. `images/logo.svg`) and keep the tagline.
- Consider reducing to two header CTAs (e.g. “Join” + “Donate”) if the bar feels busy; “Volunteer” can live in the hero or contact section.

---

## 2. Hero section

**Applied**
- Hero image with overlay so “Stand in Solidarity” and subtitle stay readable on all screen sizes.
- One primary CTA (Join Us) and two secondary (Volunteer, Donate) so hierarchy is clear and choice paralysis is reduced.
- Buttons have hover and focus states for accessibility.

**Optional for client**
- A/B test hero copy (e.g. “Building a stronger future for those in need”) if the client wants to test messaging.
- Ensure final hero image is high-res (e.g. 1920×1080) and reflects PPF’s mission; replace via `images/hero.jpg` and update `index.html`.

---

## 3. Vision & objectives

**Applied**
- Cards have hover feedback (shadow) so they feel interactive.
- Icons (◆) are simple and on-brand; titles (Solidarity, Relief & Aid, Advocacy) give meaning.

**Optional for client**
- Swap ◆ for custom icons (e.g. SVG) if the brand has an icon set.
- Add short “Learn more” links to future sub-pages if the site grows.

---

## 4. Our impact

**Applied**
- Stats (50+, 20+, 500+) are prominent; labels are clear.
- Impact cards have a clear left-border accent and hover state so the detail blocks don’t feel flat.

**Optional for client**
- Replace placeholder numbers with real metrics before launch.
- If the client has impact visuals (photos, charts), add one per block or above the stats.

---

## 5. FAQ

**Applied**
- Accordion uses native `<details>` for accessibility and no-JS fallback.
- Questions have a hover background so it’s obvious they’re clickable.
- Plus/minus icon indicates expand/collapse.

**Optional for client**
- Add a short CSS transition on the answer (max-height or grid) for a smoother open/close if desired.
- Keep FAQ copy aligned with actual PPF processes (volunteering, donations, regions).

---

## 6. Where we exist

**Applied**
- Section uses a map-style image with an overlay so “Pakistan · Regional Hubs · International Partners” stays readable.
- Message is clearly about geographic presence.

**Optional for client**
- Replace the image with an interactive map (e.g. embed or markers) if the client wants to show exact locations.
- If the client prefers a tagline like “Speak Up and Be Heard,” add it as a subtitle under the section title rather than over the map, so the section stays about *where* PPF exists.

---

## 7. Our team

**Applied**
- Circular photos with shadow; names and roles are clear.
- Placeholder images are replaceable via `images/` (see `images/README.md`).

**Optional for client**
- Add a one-line bio or “Read more” per person (expand on click or link to About/Team page).
- Provide real headshots and titles; ensure alt text is updated for accessibility.

---

## 8. Contact us

**Applied**
- Volunteer and Donate are separate blocks so visitors can choose a path.
- Contact form has visible focus states and clear labels.
- Submit shows brief “Sent!” feedback (backend integration still to be wired).

**Optional for client**
- Connect form to backend or service (e.g. email, CRM, form API); add spam protection (e.g. reCAPTCHA).
- Clarify “Donate now” / “Sign up to volunteer” destinations (e.g. payment page, volunteer form).
- Add a short line under the form: “We’ll respond within 24–48 hours” to set expectations.

---

## 9. Footer

**Applied**
- Footer text and links use larger, readable sizes.
- Nav links and tagline keep the same structure as the main nav for consistency.

**Optional for client**
- Add social links (icons + URLs) if PPF has official channels; ensure icons are at least 24×24px and have accessible labels.
- Add a copyright line (e.g. “© 2026 Pak-Palestine Forum”) if required.

---

## 10. Global (cross-page)

**Applied**
- Focus-visible styles on buttons and links for keyboard users.
- Consistent hover states on interactive elements (nav, buttons, cards, FAQ).
- Skip link for “Skip to main content” for screen readers.
- Semantic HTML and ARIA where needed (e.g. nav labels, chatbot).

**Optional for client**
- Run an accessibility pass (e.g. axe or WAVE) and fix any remaining issues.
- Test on real devices (phones, tablets) and with keyboard-only navigation.
- Ensure all images have meaningful `alt` text when final assets are in place.

---

## Summary

- **Done:** Readability (header, footer, nav), hero hierarchy and overlay, hover/focus states, FAQ and impact clarity, contact structure, and accessibility basics.
- **Client/content:** Replace placeholders (numbers, team photos, hero image), connect form and donation/volunteer flows, add social links and any interactive map if desired.
- **Quality:** Responsive layout is in place; final step is cross-browser and device testing plus backend integration.

This puts the landing page in a client-ready state for review and content/technical handoff.
