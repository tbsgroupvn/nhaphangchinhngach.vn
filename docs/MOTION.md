# TBS Motion Direction

## First Impression

The homepage uses a finite GSAP sequence rather than an interstitial loading screen. Five panels in the approved TBS blue shades open over the existing container photograph. The photograph settles from a 1.12 scale, the two brand words rise in sequence and the supporting heading follows. The China/Vietnam caption line fills once.

- Desktop entrance: approximately 1.85 seconds.
- Touch/narrow-screen entrance: approximately 1.03 seconds.
- Primary contact targets do not move, fade, become disabled or wait for the entrance.
- The main image, full heading and contact links are server-rendered and visible without JavaScript. There is no CSS-hidden content waiting for animation code.
- The replay icon restarts the same finite timeline. It is omitted without working animation code or with reduced motion, and hidden below 381px to preserve space.

## Page Transitions

Internal marketing navigation uses a persistent, decorative three-layer wipe in the approved accent, TBS blue and accessible darker blue. Container-like dividing lines and a small destination-region signature connect it to the existing visual language. The header and mobile phone/Zalo dock stay above the wipe.

- Typical wipe: about 0.91 seconds desktop and 0.59 seconds on narrow/coarse-pointer devices. The destination title, description and image settle in a short stagger, completing within approximately 1.08 seconds on a ready desktop route.
- The native Web Animations API runs transform/opacity effects without another dependency. GSAP still owns the homepage intro and existing section reveals; the route controller does not animate those same elements.
- Next.js owns navigation, prefetch, history, scroll and focus. Clicks are observed, never prevented, queued or delayed. Back/Forward use the reverse sweep. Query-only updates, same-page anchors, phone/email/Zalo, downloads and modified/new-tab clicks do not start a wipe.
- The overlay is `aria-hidden`, has no focusable content and ignores pointer events. It does not hide the main content from assistive technology, lock scrolling or disable links.
- Fast repeated navigation cancels the preceding animation. A pending route has a 1.2-second curtain deadline; after that the current page becomes visible again, and a late response gets only the light destination entrance.
- Live reduced-motion changes, page hiding and unmount cancel owned animations. No JavaScript or no Web Animations API leaves ordinary links and server-rendered content usable. Direct first loads do not trigger a route wipe.

`PageTransitions.tsx` is mounted once in the root layout so it survives route changes; it activates only from the marketing surface. The CSS layer order is transition 30, mobile dock 35, header 40, with the existing mobile dialog above them.

## In-Page Interaction

On fine-pointer screens at least 1024px wide, the photograph has bounded pointer depth (12px horizontally, 8px vertically) and up to 52px of scroll offset. Pointer leave restores its neutral position. Scroll input remains native; no scrolling is captured, pinned or redirected.

Phone buttons have a restrained single-pass hover highlight. Link/service arrows move a few pixels on hover. These hover effects do not change layout and only run when hover is supported and reduced motion is not requested.

## Safety And Performance

- `prefers-reduced-motion` is observed dynamically. Switching it on cancels the timeline and restores the static photograph and complete text immediately.
- No new animation or 3D dependency was introduced. GSAP was already installed; the hero does not load the Three.js scene early.
- The existing lower-page 3D journey keeps its own pause, visibility, reduced-motion and WebGL-fallback behavior.
- An offscreen/hidden hero finishes the finite intro. Desktop pointer/scroll work is inactive when the hero or page is not visible. Event listeners, observers, scheduled frames and GSAP-owned styles are released on unmount or motion-mode changes.
- No sound, autoplay video, looping flashes, blocking overlay, extra lead form or third-party tracking is introduced.
- If the animation module fails to load, the static server-rendered content remains usable.

## Ownership

- `src/components/marketing/HeroExperience.tsx`: timeline, responsive motion modes, replay and lifecycle.
- `src/components/marketing/HomePage.tsx`: server-rendered visual/content structure.
- `src/components/marketing/PageTransitions.tsx`: persistent route animation lifecycle and event filtering.
- `src/app/layout.tsx`: persistent controller mount, without wrapping or transforming page content.
- `src/app/marketing.css`: layer positioning and hover treatments; brand tokens are unchanged.
- `tests/marketing/hero-motion.spec.ts`: replay/contact availability, changing frames, pointer response/reset, live reduced-motion changes, touch behavior and client-navigation cleanup.
- `tests/marketing/page-transitions.spec.ts`: real navigation, changing frames, keyboard/history, rapid clicks, reduced motion, excluded links, mobile layer order, slow-route recovery and unavailable animation API.

The effect uses existing illustrative TBS imagery. It does not establish real fleet ownership or add claims about operating scale. All previous publication/security gates remain unchanged.
