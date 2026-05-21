# SAP Fiori → Reltio Design System 3.1 Color Migration

This workspace captures the work to keep Reltio's visual identity on top of SAP Fiori
after the acquisition. The deliverable is a **hot-swap map** that re-aliases SAP Fiori
"Horizon" CSS/Less variables to Reltio Design System (RDS) 3.1 colors so existing Fiori
components inherit Reltio's brand without rewriting components.

## Source files

- **RDS 3.1 (LTS)**: [`Reltio Design System 3.1 LTS`](https://www.figma.com/design/tu2YE7Y6bmgkmcdIqCJpLk/Reltio-Design-System-3.1--LTS-?node-id=11396-44160) — 318 primitive shades + 128 semantic tokens (Light/Dark).
- **SAP Fiori**: [`SAP Fiori for Web UI Kit (Community)`](https://www.figma.com/design/XywZ3yPdXzBL4MnKbzP7uI/SAP-Fiori-for-Web-UI-Kit--Community-?node-id=23018-4781) — 899 color tokens across 35 categories (Morning/Evening Horizon, two high-contrast modes).

## What's in this folder

| File | Purpose |
|---|---|
| `color-mapping.md` | Human-readable hot-swap reference (engineering + design). |
| `data/rds-primitives.json` | Reltio's raw color palette (Blue, Red, Gold, Aqua, Green-Emerald, Orange, Purple, Pink, Lime, Grayscale). |
| `data/rds-semantics.json` | Reltio's semantic intent tokens (Primary, Success, Error, Warning, etc.) in Light & Dark. |
| `data/fiori-tokens.json` | The Fiori tokens we explicitly chose to map (Main, Interaction, Text, Container, Semantic, Link, Focus, Shadow, Foreground, Accent, Shell, Button). |
| `data/hot-swap-map.json` | **The mapping** — every Fiori token → its RDS replacement, with confidence and notes. Machine-readable for automation. |
| `app/` | **Standalone web tool** (Vite + React + TS) that lets you pick which tokens to keep from Fiori, which to swap to RDS, and exports the result as CSS or JSON. See `app/README.md`. |

A live interactive canvas of the mapping is also available beside the chat in
Cursor — open `fiori-rds-color-mapping.canvas.tsx`.

### Quick start (web app)

```bash
cd app
npm install
npm run dev          # opens http://localhost:5173

# or build a static bundle to share with the team
npm run build        # → app/dist/
```

Your choices persist in `localStorage`, so reopening the tab restores the
session.

## The headline swap

| | Fiori | RDS 3.1 |
|---|---|---|
| Brand blue | `#0070F2` (Belize) | `#0000CC` (Reltio Cobalt — Brand/Blue/600) |
| Highlight | `#0064D9` | `#0000CC` |
| Information | `#0070F2` | `#0000CC` |
| Primary CTA | `#0070F2` | `#0000CC` |

Reltio's brand blue is **deeper and more saturated** than Fiori's; the swap will read as
darker and cooler on screen. Plan a contrast/accessibility pass on dense data screens
(charts, KPIs) before rollout.

## How to use the map

There are two delivery paths:

1. **Runtime override (recommended for fastest impact).** Override Fiori's SCSS/CSS
   variables in the Reltio app theme:

   ```css
   :root {
     --sapBrandColor: #0000CC;       /* RDS Brand/Blue/600 (Cobalt) */
     --sapHighlightColor: #0000CC;
     --sapInformativeColor: #0000CC;
     --sapButton_Emphasized_Background: #0000CC;
     --sapButton_Emphasized_Hover_Background: #000066;  /* RDS Blue/800 */
     /* ...full list in data/hot-swap-map.json */
   }
   ```

2. **Figma library re-alias (recommended for design alignment).** In the Fiori library,
   change each Horizon variable's value mode binding from a hard hex to a Reltio
   primitive alias (e.g. `Main/sapBrandColor` → `Brand Colors/Blue/opaque/600- cobalt`).
   This keeps the design system single-source-of-truth and ensures designers see the
   Reltio brand everywhere a Fiori component is used.

## Open questions for design review

1. **Warning hue** — Fiori uses orange-amber (`#E76500`), Reltio uses gold (`#FFCC00`).
   We have two valid swaps: keep Fiori's intent and pick Reltio Orange/500 (`#EE6611`),
   or align to Reltio brand and use Gold/500. Recommendation in `color-mapping.md`.
2. **Success green** — Fiori is forest green (`#256F3A`), Reltio Emerald is teal-leaning
   (`#449977`/`#2F6A52`). Both read as "success" but feel different. No clean win.
3. **Link color** — RDS distinguishes link blue (`#3333FF`, Blue/400) from CTA blue
   (`#0000CC`, Blue/600). Fiori uses the same blue for both. Decide whether to keep that
   distinction or collapse to Cobalt.
