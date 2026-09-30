# TBS Website Color Standard

Updated: 2026-09-26. This replaces the experimental cobalt/lime website palette at the user's request.

## Source

The website logo `public/images/marketing/logo-color.png` is byte-identical to the supplied `F:/01_TBS_GROUP/tbs-logo.png` (SHA-256 `E470890319770DC0153A00686D76288E54D1688A15E96FC6B9137AF7EA36001E`). The artwork is unchanged.

The source is a raster image with many neighboring color values. `#0083CA` is its most frequent saturated blue pixel; `#3D94D9` is the most frequent blue pixel in the lower GROUP wordmark. These representative sRGB samples define this website's brand colors. They are not a claim about original vector fills, Pantone or CMYK specifications. If an approved vector brand manual is supplied later, reconcile these web tokens against it.

## Color Roles

| Token | Hex | Role |
| --- | --- | --- |
| `--tbs-brand` | `#0083CA` | Sampled TBS blue: brand rules, borders and principal 3D materials. |
| `--tbs-brand-secondary` | `#3D94D9` | Sampled GROUP blue: secondary material and edge highlights. Not small text on white. |
| `--tbs-brand-strong` | `#006FA8` | Accessible action shade: phone buttons, text links, selected journey stage, featured service and small blue labels. |
| `--tbs-brand-hover` | `#005B8C` | Darker hover state for the same actions. No size or layout change. |
| `--tbs-brand-soft` | `#EAF5FC` | Restrained blue tint for supporting contact surfaces and hover feedback. |
| `--tbs-accent` | `#8DCEEF` | Light derived blue for labels and focus rings on dark neutral surfaces; no lime/neon accents. |
| `--tbs-soft` | `#F3F6F7` | Neutral light backgrounds and the 3D canvas. |
| `--tbs-ink` | `#202A30` | Main text on white/light backgrounds. |
| `--tbs-muted` | `#59656D` | Secondary text on white/light backgrounds. |
| `--tbs-line` | `#D9E1E5` | Light-surface separators. Not the sole indicator of control state. |
| `--tbs-dark` | `#182126` | Dark neutral industry/footer bands, not a page-wide navy background. |
| `--tbs-dark-line` | `#3A454B` | Separators within dark bands. |
| `--tbs-dark-muted` | `#BDC8CE` | Supporting text within dark bands. |

## Application

- White and neutral light surfaces remain dominant. Brand blue marks actions and hierarchy; do not tint every section blue.
- The original color logo sits on a solid white header. The supplied white logo is retained on the dark footer. Never recolor either bitmap with CSS filters.
- Primary phone actions use the same blue/white pairing in the hero, page body, footer and mobile dock. Zalo remains the secondary outlined action. No lead form is introduced.
- The principle strip below the hero is light neutral with dark text; the industry and footer bands provide a limited dark counterpoint.
- Selected journey controls use blue, a top rule, an icon, an arrow and `aria-pressed`. Selection does not rely only on color. Small selected-stage numbers are white, not light blue.
- The 3D model uses the sampled blues for containers and brand features. Orange container paint, vegetation and wood remain object colors, not additional UI brand colors.

## Contrast

The sampled primary blue against white is approximately 4.12:1, so it is not used for ordinary small text or white-text button backgrounds. The derived action shade gives approximately 5.47:1 with white and 5.04:1 against the neutral light background. Light accent blue against the dark neutral surface is approximately 9.50:1.

`tests/marketing/palette.spec.ts` checks exact tokens, an unchanged logo URL, opaque header, section surfaces, 15 representative text/background pairs at 4.5:1 or higher, primary action consistency, hover states and keyboard focus. This is targeted coverage, not a complete WCAG audit.

## Maintenance

The CSS source of truth is the `:root` block in `src/app/marketing.css`. Journey CSS consumes these tokens. Three.js material equivalents live in the small `palette` object in `src/components/marketing/JourneyScene.tsx`; canvas background must stay aligned with `--tbs-soft`. Keep logo asset, palette documentation and browser tests aligned whenever brand colors change.
