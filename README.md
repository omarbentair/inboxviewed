# InboxViewed — Website Prototype (Rebrand)

This is the restructured prototype of the InboxViewed site, built around an
"inbox" concept: the page chrome mimics an email client, the brand red (#900000)
is used as an "unread" indicator throughout, and the ❌👁️ mark is used as the
brand symbol (favicon, header, footer, cursor).

## How to preview
Open `frontend/index.html` directly in a browser, or serve the folder locally:

    cd frontend
    python3 -m http.server 8000

Then visit http://localhost:8000

## What's new in this round
- **WhatsApp** added to Contact socials + footer (wa.me/212783824347)
- **Reviews + Clients marquees** — two auto-scrolling strips (right-to-left),
  pause on hover. Currently placeholder content — see "Needs your input" below.
- **Neon boot-flicker bar** — thin strip at the very top that flickers
  irregularly for ~2.6s on page load (like a struggling hangar light), then
  settles into a subtle, uneven steady glow loop.
- **Cursor hotspot fix** — the custom cursor's interactive point is now the
  image's top-left corner (0,0), not its center. Drop your new cursor image
  in at the same path (`assets/brand/cursor-mark.png`) and it'll line up.
- **Interactive team photo** — your uploaded office photo, monochrome by
  default; hovering (or tapping, on touch) Enigma or Graham reveals a color
  "spotlight" around their face plus a name/role/socials card.
- **Services section rebuilt Outlook-style** — left message list, right
  reading pane, click a service to swap the content in, now spanning ~96% of
  the viewport width instead of the old boxed-in layout.
- **Wider layout overall** — reduced side padding, removed hard-coded 800px
  caps on the Work and Team grids so they use more of the screen on desktop.

## Needs your input before launch
- **Reviews marquee**: currently 4 placeholder review cards (repeated to loop)
  — swap in real client quotes/names when ready.
- **Clients marquee**: currently 6 placeholder "Brand One–Six" badges — swap
  in real client names/logos.
- **Team photo cards**: Enigma and Graham's LinkedIn/Instagram links in the
  hover cards are placeholder `#` links — send over the real personal/
  professional profile links to wire these up.
- **Cursor image**: the file path is ready (`assets/brand/cursor-mark.png`),
  just drop your new cursor PNG in with that exact filename.

## Structure
    frontend/
      index.html        — all page markup/sections
      style.css          — design system + layout (CSS variables at the top)
      script.js          — nav toggle, scroll reveals, cursor, sliders, audit
                           teardown interaction, services mail-app, team photo
                           hover, neon bar boot sequence, compose form
      assets/
        brand/           — logo (full + mark), favicon, cursor icon
          originals/     — full-resolution source PNGs (for print/large use)
        hero/            — hero attachment slider images (carried over)
        posts/           — work showcase images (carried over)
        team-photo-color.jpg / team-photo-mono.jpg — interactive team section

## Notes for feedback
- Contact form currently opens the user's email client via a mailto: link
  (service@enigmail.space placeholder) since there's no backend yet.
- Audit teardown section is a fully coded mock email (not a real client
  screenshot) — swap in a real teardown image/example later if you want.
- Fonts: League Spartan (display) + Inter (body) + JetBrains Mono (meta/labels),
  loaded from Google Fonts via <link> tags in index.html.
