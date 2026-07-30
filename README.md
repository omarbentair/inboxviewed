# InboxViewed Website

This repository contains the clean, static Modular Agency Canvas version of the InboxViewed website.

## Project structure

```text
InboxViewed/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── brand/
    ├── hero/
    ├── posts/
    │   ├── current-post-2/
    │   └── current-post-3/
    ├── social/
    ├── team-photo-original.png
    ├── team-photo-color.jpg
    └── team-photo-mono.jpg
```

There is no framework, package manager, build command, or generated dependency folder. Open `index.html` directly for a quick preview, or use a small local server for the most accurate browser behavior.

## Brand identity

InboxViewed is a premium email marketing and retention studio for ecommerce brands that have outgrown generic templates.

- Tagline: **Delivered means nothing. Viewed means something.**
- Positioning: confrontational but helpful, premium rather than corporate, and technical without feeling cold.
- Core services: Premium Figma Design, Hand-Coded HTML, Klaviyo Management, Retention Audits, and Email AI Flows.
- Founders: Riad TAJEDDINE, CEO, and Omar BENTAIR, CTO.
- Core website concept: a modern agency website that uses inbox and email-client details as its visual language without becoming a confusing fake email application.

### Visual system

- Background: `#050505`
- Surface: `#0a0a0a`
- Primary red: `#900000`
- Supporting bright red: `#b30000`
- Main text: `#f2f0ec`
- Muted text: `#918d88`
- Display type: League Spartan
- Body type: Inter
- Metadata type: JetBrains Mono

Never shift the brand red toward orange. The intended atmosphere is dark, premium, ominous, restrained, and precise.

## Current functionality

- SVG cutout boot intro and branded header light
- Custom X-mark cursor and ambient cursor glow
- Responsive desktop, tablet, and mobile navigation
- Modular hero using the current InboxViewed phone-notification artwork
- Coordinated Hero reveal that begins only after the header light reaches full brightness
- Scroll lock through the complete intro, light startup, and Hero reveal sequence
- Manual scroll restoration so refreshes restart from the top
- Interactive Services inbox with a milestone-timed typed heading, red glare hover,
  proximity-responsive 3D number cubes, opened-message states, keyboard navigation,
  and clear deliverable summaries
- Detailed interactive audit annotations
- Interactive full-color founder photograph that fades to monochrome around the selected founder
- Dedicated About InboxViewed section before the conversion request
- Compose-inspired contact form that sends inquiries directly to `contact@inboxviewed.com`
- Direct WhatsApp Business, Instagram, and LinkedIn cards using local platform icons
- Reduced-motion support

## Audit marker positioning

The four annotations are attached to the email elements they describe instead of
using percentages relative to the entire mockup:

- `.audit-actions .pin-1` is attached to the top-right of the CTA group.
- `.audit-offer-line .pin-2` is attached to the left of the promotional sentence.
- `.audit-contrast-target .pin-3` is attached beside the low-contrast heading.
- `.audit-footer .pin-4` sits directly beside the footer text.

Fine positioning values are kept together in the corresponding selectors in
`style.css`. Preserve these element anchors so the annotations remain aligned
when the audit card changes width.

## Editing rules

- Keep `index.html`, `style.css`, and `script.js` selectors and references consistent.
- Reuse files inside `assets/` instead of duplicating them.
- Do not invent client logos, reviews, or performance results. The deferred proof section returns only when verified material is available.
- Preserve the interactive audit and team photograph as signature features.
- Keep animations restrained and respect `prefers-reduced-motion`.
- Test desktop first, then verify tablet and mobile layouts.

## Team interaction

The Team section uses `assets/team-photo-original.png` directly at its native
resolution. Do not convert that source to JPEG or generate a second processed
asset for the monochrome state. CSS applies grayscale to a duplicate rendering
of the same PNG so the default and interaction states retain identical detail.

The first-view sequence is:

1. The heading and supporting text enter together.
2. The full-width color photograph enters after both texts finish.
3. The centered `Hover or focus a founder` prompt enters in its own row below
   the photograph.

The photograph starts in full color. Hovering, focusing, or selecting a founder
fades the rest of the photograph into monochrome, keeps the selected founder in
color, and opens that founder's profile card. Only one founder may be active at
a time. Preserve the shared state controller, interaction bridges, keyboard
focus support, and touch selection behavior.

Current founder content:

- Riad TAJEDDINE - Chief Executive Officer
  - `riad@inboxviewed.com`
  - LinkedIn: `https://www.linkedin.com/in/riad-tajeddine/`
  - Instagram: `https://www.instagram.com/enigma.cuts/`
- Omar BENTAIR - Chief Technology Officer
  - `omar@inboxviewed.com`
  - LinkedIn: `https://www.linkedin.com/in/omar-bentair/`

## About and Contact

The About section sits directly between Team and Contact. It introduces
InboxViewed's value, ecommerce focus, integrated design/code/strategy model,
and core service system before asking the visitor to submit an inquiry.

Contact keeps the inbox-inspired compose interface and collects the visitor's
name, business email, brand/company, subject, and message. It submits through
FormSubmit's AJAX endpoint to `contact@inboxviewed.com`, so the visitor remains
on the website and does not need a configured email application.

Before production:

1. Publish or preview the site on its final domain.
2. Make one test submission.
3. Open the activation email delivered to `contact@inboxviewed.com`.
4. Confirm the FormSubmit destination.
5. Send a second test and verify that the inquiry arrives with the visitor's
   business email available for a direct reply.

The first-view sequence is:

1. About heading enters.
2. About copy enters.
3. Contact heading and supporting copy enter together.
4. Compose window enters.
5. Direct-contact cards enter.

Reduced-motion mode shows all of these elements immediately.

## Hero reveal timing

The Hero entrance is synchronized from `script.js` by the `revealHero()` function. It runs when the header light's `boot` animation ends, with a 3.1-second safety fallback. Scrolling remains locked until every Hero reveal animation has finished, with a separate 2.5-second unlock fallback to prevent a browser animation-event failure from trapping the page.

Individual reveal delays are set directly on the Hero elements in `index.html` through `--hero-delay`. The sequence is:

1. Email metadata and heading from the left
2. Supporting copy and audit actions from below
3. Featured phone artwork from the right
4. Capability cards from bottom-right to top-right

The imported Instagram posts are stored separately in `assets/posts/current-post-2/` and `assets/posts/current-post-3/`.

## Services reveal and cube interaction

The Services reveal is controlled by three classes added in `script.js`:

1. `in-view` starts the one-time typing animation.
2. `first-line-complete` records the pause after “One studio.” without revealing the right-side copy.
3. `typing-complete` reveals the right-side statement, five service rows, and opened-message pane together.

The pause between the two heading lines is `780ms`, and typing remains at `58ms` per character. The final text is never deleted.

Only the five numbered cubes respond to pointer proximity. Inside a service row, that row's cube reacts exclusively. Outside the rows, no more than two neighboring cubes can react when the pointer sits between them. The response weakens with distance and returns to the neutral angle when the pointer leaves the Services area. Reduced-motion and coarse-pointer devices keep the cubes in their neutral position.

## Deferred Selected Work section

Selected Work is intentionally absent until InboxViewed has real examples and each client has confirmed that the work may be displayed. Services currently flows directly into the Interactive Audit section. Do not add invented projects or placeholder client work.

When approved examples exist, rebuild Selected Work as a collection of large, titled image decks:

- One client or example equals one deck.
- A deck may contain one card or several overlapping cards, depending on the available work.
- Cards must be large enough for the email design to remain readable and detailed.
- Multiple decks should be arranged at uneven vertical and horizontal positions, alternating toward the left and right while remaining visually balanced as a complete section.
- Each deck needs only a short title at first, likely the client name or a project-specific phrase. Final titles will be decided when the examples are ready.
- For multi-card decks, use the supplied BounceCards behavior as inspiration: staggered elastic entrance, slightly rotated and offset resting positions, a hovered card straightening, and its siblings moving aside.
- Adapt the behavior to the existing plain HTML, CSS, and JavaScript stack. Do not add React or GSAP solely for this section unless the project architecture changes first.
- Provide a calm reduced-motion fallback and a usable touch layout.

## Deferred Clients & Reviews section

Clients & Reviews is intentionally absent until InboxViewed has real client
logos and verified feedback that may be published. Interactive Audit currently
flows directly into Team. Do not restore placeholder logos or testimonial copy.

When verified material exists, restore the section with this approved direction:

- Eyebrow: `Clients & reviews`
- Heading: `Proof that moves with the work.`
- Supporting copy should be short and direct, in the spirit of:
  `They trusted us. We delivered.`
- Use one rail for client logos and one rail for verified reviews.
- The rails move in opposite directions.
- On the section's first viewport entry, both rails begin visually empty.
- The client rail feeds in from one side while the review rail feeds in from
  the opposite side.
- Each rail must fill the visible width before its continuous loop begins.
- The handoff from the one-time fill animation to the infinite loop must be
  seamless, with no jump, reset, blank frame, or duplicated entrance.
- After filling, both rails continue looping in their respective directions and
  may pause on hover for readable inspection.
- Reduced-motion mode shows the populated rails immediately without an entrance
  or continuous movement.

Required content for each client:

- Approved logo asset
- Client or company name
- Permission confirmation

Required content for each review:

- Exact approved testimonial
- Client name
- Role and company
- Service provided
- Permission confirmation

## Interactive Audit

The Audit section now introduces the sample campaign with:

- `See where the email loses them.`
- `Explore the four conversion leaks hiding inside this generic campaign.`

Its first-view sequence is intentionally ordered:

1. Audit heading and supporting copy
2. A short hold
3. Interactive sample email
4. A second short hold
5. Retention-health label and score counting from `0` to `42/100`
6. Each numbered marker entering together with its matching collapsed finding
7. The remaining marker/finding pairs entering successively
8. Audit request call to action

The four markers remain synchronized with the four findings. No finding is
expanded by default; selecting either a marker or a finding activates and
expands its matching pair. Their positions correspond to the actual problem
areas:

- Competing CTAs: beside the three equal action buttons
- Wall of text: beside the long promotional sentence
- Weak contrast: beside the headline and copy over the dark email artwork
- No next step: beside the email footer

The sequence runs once when the section first enters the viewport. Reduced-motion mode shows the complete section and final score immediately.

## GitHub and deployment

The repository root should be the folder containing `index.html`.

Recommended first setup:

```bash
git init
git add .
git commit -m "Add InboxViewed static website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

For Vercel:

1. Import the GitHub repository.
2. Choose **Other** as the framework preset.
3. Leave the build command empty.
4. Use `.` as the output directory if Vercel requests one.
5. Connect `inboxviewed.com` after the first successful deployment.

Because the site is fully static, it can also be hosted on GitHub Pages, Netlify, Cloudflare Pages, or any standard web server.

## Mobile round 1

The mobile layout now includes Contact in the header menu, mobile-only Audit
marker placement, permanent side-by-side founder cards beneath the Team image,
and footer overflow/alignment fixes. The desktop Team hover interaction and all
other approved desktop layouts remain unchanged.

The founder cards currently crop `assets/team-photo-original.png`. Dedicated
portraits can later replace the two card image sources while keeping the
existing card markup and styling.

The intro foreground mark and SVG cutout now share the same `14vmax` mobile
footprint, so their silhouettes remain aligned during the fade.
