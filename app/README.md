# Reltio · Fiori → RDS 3.1 Color Mapper

A standalone web tool that mirrors the in-Cursor canvas: pick which Fiori
Horizon tokens to keep and which to swap to Reltio Design System 3.1, then
export the result as a drop-in CSS theme override or a JSON manifest.

Token names stay as the Fiori names (`sapBrandColor`, `sapNegativeColor`, …) so
existing UI5 component bindings keep working — only the value behind each name
changes.

## Run it

```bash
cd "Desktop/SAP Migration/app"
npm install
npm run dev
```

Vite opens the app at <http://localhost:5173>.

## Build for sharing

```bash
npm run build
```

Static assets land in `dist/`. Drop the folder onto any static host (Vercel,
Netlify, S3 + CloudFront, an internal share — whatever you use). The whole
thing is client-side: no API keys, no runtime config.

To smoke-test the build locally:

```bash
npm run preview
```

## What's in this app

- **Headline brand swap** — large side-by-side comparison of Fiori Belize Blue
  vs Reltio Cobalt.
- **RDS 3.1 palette reference** — every primitive ramp (Brand, Other, Grayscale)
  so you have the source colors to hand.
- **Hot-swap mapping table** — every Fiori token paired with its RDS suggestion.
  Per-row `Fiori | RDS` toggles. Filter by category and search by token name or
  hex. Bulk actions (Use RDS / Keep Fiori) apply to either the visible rows or
  the whole map.
- **Live export** — your choices feed straight into a `:root { … }` CSS block
  (or JSON manifest). Copy to clipboard or download as a file.
- **App theme toggle** — independent from the Fiori Light/Dark preview; flips
  the app chrome between light and dark mode.
- **State persistence** — all your toggles, filters, and choices are saved to
  `localStorage`. Closing and reopening the tab restores the session.

## Tech

Plain Vite + React 19 + TypeScript. No CSS framework, no UI kit — just inline
styles backed by CSS custom properties for theming. The whole app fits in
six source files under `src/`:

- `main.tsx` — React mount.
- `App.tsx` — the page (filters, table, export panel, decisions, checklist).
- `ui.tsx` — local recreations of the canvas primitives (`Card`, `Pill`,
  `Stack`, `Grid`, `Text`, `Stat`, `Callout`, etc.).
- `data.ts` — the SWAPS data, RDS ramps, and pure helpers (`buildExport`,
  `resolvedHex`, `leafName`, `getChoice`).
- `hooks.ts` — `useLocalStorage` and `useAppTheme`.
- `styles.css` — base styles + theme tokens for the two app themes.

## Updating the data

The mapping data lives in `src/data.ts` (`SWAPS` and `RDS_RAMPS`). It's also
mirrored in `../data/hot-swap-map.json` at the repo root. To extend the map:

1. Add new entries to the appropriate category in `SWAPS`.
2. If you added a new category, add it to the `Category` order — the keys are
   read in declaration order.
3. (Optional) Mirror the change into `../data/hot-swap-map.json` if you want
   the machine-readable artefact to stay in sync.

The rest of the app — stats, exports, filters — adapts automatically.
