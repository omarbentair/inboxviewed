# InboxViewed Website

InboxViewed is a premium email marketing and retention studio for ecommerce brands that have outgrown generic templates. This repository contains the current static website for [inboxviewed.com](https://inboxviewed.com).

Tagline: **Delivered means nothing. Viewed means something.**

## Technology

The site deliberately uses a simple static stack:

- HTML
- CSS
- Vanilla JavaScript
- Local image and SVG assets

There is no framework, Node.js requirement, package manager, build command, or generated dependency directory.

## Project structure

```text
inboxviewed/
├── README.md
└── frontend/
    ├── index.html
    ├── style.css
    ├── script.js
    └── assets/
        ├── brand/
        │   └── originals/
        ├── founders/
        ├── hero/
        ├── posts/
        │   ├── current-post-2/
        │   └── current-post-3/
        ├── social/
        ├── team-photo-color.jpg
        ├── team-photo-mono.jpg
        ├── team-photo-original.png
        └── team-photo-omar-riad.png
```

The assets included in the current baseline were organized and approved by the user. Do not restore removed legacy asset folders or replace these files unless explicitly requested.

## Run locally

The fastest preview is to open `index.html` directly in a browser.

For behavior closest to production, run a simple local server from the project folder. For example, if Python is installed:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

No Node.js installation is needed.

## Deployment

The project can be deployed as a static site through GitHub and Vercel:

1. Put `index.html`, `style.css`, `script.js`, `README.md`, and `assets/` at the repository root.
2. Push the repository to GitHub.
3. Import the repository into Vercel.
4. Use the default static deployment settings. No build command or output directory is required.
5. Connect `inboxviewed.com` through the Vercel domain settings and the Namecheap DNS records.

## Page flow

The approved live page order is:

1. Hero
2. Services
3. Interactive Audit
4. Team
5. About InboxViewed
6. Contact

Selected Work and Clients & Reviews are intentionally absent until real, approved material is available. Do not add fabricated projects, client logos, testimonials, or results.

## Brand system

- Primary red: `#900000`
- Supporting bright red: `#b30000`
- Main background: near-black
- Display type: League Spartan
- Body type: Inter
- Metadata type: JetBrains Mono
- Tone: premium, dark, precise, challenging but helpful

The inbox and email-client language should remain recognizable without making the site feel like a literal or confusing email application.

## Current features

- Full-screen branded SVG cutout intro
- Scroll lock through the intro and Hero reveal
- Sticky responsive header and mobile navigation
- Custom X-mark cursor and ambient cursor glow on supported pointer devices
- Full-bleed desktop Hero video with a compact bottom-left copy block, an intentionally empty center, and three independent title-only capability cards anchored at the bottom of the far-right column
- Three interactive Hero logo cubes using the official Figma and Klaviyo marks plus the existing HTML icon
- Optimized desktop-only 20-second Hero background video with a poster fallback, muted autoplay, looping playback, and no audio payload
- Video-timed clearance keeps the left Hero copy clear from `5s-8s` and `12s-15s` of every loop, while the existing right-card timing protects the opposite close-ups
- Responsive Hero service-rail containment with no phone panel or page-wide overflow masking
- Interactive Services interface with five selectable services
- Mac-style Services reader on desktop and mobile, with decorative reactive traffic-light controls
- Rounded Services outer shell with sharp internal panes
- Interactive Audit built around the supplied full-length 1375 x 4813 retail email and independently scrollable on desktop and mobile
- Nine synchronized accordion findings: six image-anchored markers and three marker-free general observations, each with its own relevant email scroll destination
- Two-way Audit navigation: image markers open the matching finding, while findings pan the email to the relevant region; approved issues `02`, `03`, `07`, and `08` retain focus zoom, while `05` and footer issue `09` use pan-only framing. Manual email scrolling clears any zoom before continuing.
- Stable equal-height desktop Audit panes, a compact fixed findings panel dynamically sized once to the longest expanded issue with no independent scrollbar or expansion jump, and a restored reduced-motion-safe red scan line travelling down the email frame
- Audit panning is clamped to the real email image bounds: targets center when space permits, while the footer stops naturally at the lowest valid image position without artificial blank scroll space.
- Atomic Audit reveal, animated `42/100` score, one reference-matched Minecraft-style pixel heart beside the score with a subtle reduced-motion-safe beat, rounded outer shell, sharp internal panes, and no outer white halo
- Interactive desktop founder photograph with hotspot-driven profile cards
- Dedicated rounded founder cards on mobile, with the large Team photograph removed at phone widths
- Mobile-only sticky desktop recommendation attached beneath the header, with a compact desktop-status chip and a restrained red fade into the page
- About InboxViewed section
- Mac-style compose contact form using FormSubmit AJAX
- Rounded WhatsApp, Instagram, and LinkedIn contact cards with independent inset borders that remain intact around every corner
- Responsive desktop, tablet, and mobile rules
- `prefers-reduced-motion` support

The experimental `Unread -> Opened` section labels remain reverted. The Audit scan-line animation has been restored at the user's request.

## Contact form

The contact form posts through FormSubmit to:

```text
contact@inboxviewed.com
```

Before launch or after changing the deployment domain:

1. Submit one test inquiry from the deployed site.
2. Open the FormSubmit activation email sent to `contact@inboxviewed.com`.
3. Confirm the destination.
4. Submit a second test and verify that the message arrives correctly.

The form includes a honeypot field and displays its submission status without sending the visitor away from the website.

## Editing rules

- Treat `index.html`, `style.css`, `script.js`, and the approved `assets/` folder as one coordinated system.
- Preserve existing selectors, naming, animations, content, accessibility attributes, and working interactions unless a request directly changes them.
- Make only requested changes and reuse existing code.
- Keep major outer content shells rounded while preserving sharper internal inbox panes and controls.
- Keep the supplied desktop Hero video full-bleed. Preserve the compact lower-left copy boundary, empty center, and three title-only translucent cards at the lower far right; do not restore descriptions or a shared enclosing rail.
- Preserve the left-copy clearance windows at exactly `5s-8s` and `12s-15s` on every video loop, plus the independent right-card clearance timing. Mobile must remain static and must not load the video.
- Preserve the atomic Hero and Audit loading behavior so no empty white surface or empty shell appears before its content.
- Preserve the Services tab behavior and the distinction between reveal state and active service state.
- Preserve the Audit's nine-finding order, six marker mappings, full-email scroll destinations, two-way synchronization, per-issue focus framing, native-resolution-safe image width, real-image scroll limits, fixed non-scrolling findings panel, stable pane heights, and zoom cancellation on manual scrolling.
- Preserve the desktop Team hotspot controller and the separate mobile founder cards.
- Respect `prefers-reduced-motion` for every new effect.
- Do not add React, GSAP, or a build system for a small visual change.
- Test desktop, tablet, and mobile after responsive CSS changes.

## Current baseline

Previous authoritative uploaded baseline SHA-256:

```text
1c219bfe917fdb30d0ac9fe29ae0eded24444a0f630617969fb45457bcc278ae
```

This build keeps the approved desktop Hero background video and poster, plus the exact `5s-8s` and `12s-15s` left-copy clearance intervals on every loop. It keeps the header light/flicker system removed, preserves the approved Team photograph and founder mapping, and retains the supplied high-resolution bad-email example with nine complete findings, six image markers, synchronized scrolling, focus zoom, and desktop/mobile internal email scrolling. On mobile only, a compact desktop-view recommendation follows directly beneath the sticky header.

This README is the current continuation reference for the uploaded repository baseline.
