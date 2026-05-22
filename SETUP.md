# Setup — Fiori → RDS 3.1 Color Migration Tool

**This file is a self-contained runbook.** Read it top-to-bottom and execute each
command block in order. After each block, run the verification check and only
proceed when it passes.

> **For AI agents** (e.g. Cursor): your job here is to run shell commands and
> confirm the dev server starts. You do **not** need to write or modify any
> source — the repo is complete. If a step fails, consult the
> [Troubleshooting](#troubleshooting) section before improvising. When the dev
> server is up, report the local URL back to the user and stop.

---

## What you'll have at the end

- The repo cloned to your machine.
- The mapping tool running at **<http://localhost:3030/>**.
- A production build optionally available at `app/dist/`.

---

## 0. Prerequisites

| Tool      | Required version | macOS install                              | Linux / WSL install                                  |
| --------- | ---------------- | ------------------------------------------ | ---------------------------------------------------- |
| **Node**  | `≥ 20.0`         | `brew install node@20`                     | [nvm](https://github.com/nvm-sh/nvm) → `nvm install 20` |
| **npm**   | `≥ 10` (bundled with Node) | — | — |
| **git**   | any recent       | `xcode-select --install` or `brew install git` | distro package manager                            |

Check that all three are present and modern enough:

```bash
node -v       # expect v20.x or newer
npm -v        # expect 10.x or newer
git --version
```

**Native Windows note:** the commands below assume a POSIX shell (zsh / bash).
On Windows, run them inside **WSL** or **Git Bash**. Replace `lsof -ti tcp:3030 | xargs kill`
with `netstat -ano | findstr :3030` then `taskkill /F /PID <pid>` when needed.

**Browser note:** Chrome / Edge / Arc / Brave support the in-app eyedropper.
Safari and Firefox work for everything else but hide the eyedropper button.

---

## 1. Quick start (copy-paste, ~1 minute)

```bash
git clone https://github.com/vedsarkar/Token-Migration.git
cd Token-Migration/app
npm install
npm run dev
```

The last command stays running. When you see:

```
  VITE v6.x.x  ready in <n> ms
  ➜  Local:   http://localhost:3030/
```

…open <http://localhost:3030/> in your browser. **Done.**

---

## 2. Step-by-step (with verification)

### 2.1  Clone the repository

```bash
git clone https://github.com/vedsarkar/Token-Migration.git
cd Token-Migration
```

**Verify:**

```bash
ls
# Expect (order may vary):  README.md  SETUP.md  app/  color-mapping.md  data/
```

### 2.2  Install app dependencies

```bash
cd app
npm install
```

This installs the React + Vite + TypeScript toolchain plus runtime deps
(`react@19`, `vite@6`, `typescript@5`, `exceljs@4` for the styled XLSX export).
Total install footprint: ~110 MB in `app/node_modules/`.

**Verify:**

```bash
test -d node_modules && echo "ok" || echo "fail"
# Expect: ok
```

### 2.3  Start the dev server

```bash
npm run dev
```

Expected stdout (within ~1 second):

```
  VITE v6.4.2  ready in 150 ms
  ➜  Local:   http://localhost:3030/
```

The server is hard-bound to port **3030** (Vite `strictPort` — it will refuse
to fall back to a different port; see [Troubleshooting](#port-3030-is-already-in-use)
if you hit a conflict).

**Verify** (from a *different* shell, since `npm run dev` blocks the first):

```bash
curl -sf -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3030/
# Expect: HTTP 200
```

Open <http://localhost:3030/> in your browser. You should see the
"Fiori → RDS 3.1 Color Migration Map" hero with a long mapping table beneath.

### 2.4  (Optional) Build for sharing

```bash
npm run build
```

Produces a static bundle at `app/dist/`. Serve it with any static host, or
preview it locally:

```bash
npm run preview
# Vite serves the built bundle on http://localhost:3030/
```

---

## 3. A 60-second tour of the app

| Control | What it does |
| --- | --- |
| **Fiori theme mode** (top right) | Switch between Morning Horizon, Evening Horizon, High Contrast White, High Contrast Black. The whole table re-resolves with mode-specific Fiori values. |
| **Design system palette** | Swap the reference palette grid between RDS 3.1 and Fiori. |
| **Category dropdown** | Filter the 899 tokens by category (Main, Interaction, Text, Container, etc.). Multi-select. |
| **Search box** | Filter by token name or hex (e.g. `sapBrand`, `#0070`). |
| **Use RDS / Keep Fiori for visible** (bulk pills) | Flip the choice for every token currently visible after filtering. `Reset` clears all overrides. |
| **RDS suggestion** dropdown (per row) | Pick a different RDS primitive than the default suggestion, or apply a "Custom" blend created via the picker. |
| **Enhanced suggestion** chip (per row) | Click the small color chip to open the **Figma-style color picker** — HSV pad + hue & opacity sliders, Hex / RGB / HSL format dropdown, eyedropper, and a one-click "Reset to suggested midpoint". Tweaking the picker commits a blended hex live (rAF-throttled, only the active row re-renders). The +/- button is the fast-path for applying or removing the suggested midpoint without opening the picker. |
| **Choice pills** (Fiori / RDS) | Per-row source choice. The full hot-swap export only includes rows set to RDS. |
| **Conf. pill** | Live ΔE76 (CIELAB) between the Fiori value and the resolved RDS pick. Green ≤ 5, amber 5-15, red > 15. Hover for the exact ΔE and the design rationale. |
| **Output card** (bottom) | Live-updates as you make picks. Export formats: **CSS (all)**, **CSS (overrides only)**, **JSON**, or **Download spreadsheet** (multi-sheet styled XLSX). |

Your choices auto-save to `localStorage` so refreshing or closing the tab
preserves your work. The "Reset" pill is the only way to wipe them.

---

## 4. Troubleshooting

### Port 3030 is already in use

The dev server is hard-coded to port 3030 (Vite `strictPort: true`). Kill the
squatting process and restart:

```bash
lsof -ti tcp:3030 | xargs kill        # macOS / Linux
# Windows: netstat -ano | findstr :3030  →  taskkill /F /PID <pid>

npm run dev
```

### `ERR_CONNECTION_REFUSED` on http://localhost:3030/

The dev server died (machine slept, terminal closed, hot reload errored hard).
Just restart it:

```bash
cd app && npm run dev
```

### "Module 'stream' has been externalized for browser compatibility"

You'll see this in the browser console only if the Vite dependency cache is
stale — typically after a package upgrade or branch switch. Clear and restart:

```bash
rm -rf node_modules/.vite
npm run dev
```

### TypeScript or lint errors after pulling new code

Reinstall deps:

```bash
rm -rf node_modules package-lock.json
npm install
```

### The downloaded XLSX is named `.com.todesktop.<random>` and has no extension

You opened the app from Cursor's built-in browser, which holds downloads with a
hidden temp name. Either:

- Open <http://localhost:3030/> in your normal browser (Chrome/Safari/Firefox)
  and the download will land as `reltio-fiori-mapping-YYYYMMDD-HHMM.xlsx`, **or**
- Rename the temp file by hand:

  ```bash
  mv ~/Downloads/.com.todesktop.* ~/Downloads/reltio-fiori-mapping.xlsx
  ```

### Eyedropper button is missing in the picker

The browser doesn't expose the [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper).
This is the case in Firefox and Safari today. Hex / RGB / HSL inputs still work.

---

## 5. Repo layout

```
Token-Migration/
├── README.md                    Project overview + headline swap table
├── SETUP.md                     ← this file
├── color-mapping.md             Human-readable hot-swap reference (eng + design)
├── data/                        Raw Figma extracts
│   ├── rds-primitives.json
│   ├── rds-semantics.json
│   ├── fiori-tokens.json
│   └── hot-swap-map.json
└── app/                         Vite + React + TypeScript web app
    ├── package.json
    ├── vite.config.ts           Port 3030, strict
    ├── index.html
    ├── README.md                App-specific notes
    ├── scripts/                 Node scripts to regenerate auto-mapped data
    │   ├── fiori-pull.json
    │   ├── import-missing-fiori.mjs
    │   └── merge-hc-modes.mjs
    └── src/
        ├── App.tsx              Main component — table, hero, filters, exports
        ├── ColorPicker.tsx      HSV(A) picker with opacity, format dropdown, eyedropper
        ├── data.ts              Color math (ΔE76 CIELAB, blendHex), mapping types
        ├── data-auto-mapped.ts  767 auto-mapped Fiori tokens (generated)
        ├── spreadsheet.ts       Styled XLSX export via exceljs
        ├── ui.tsx               Popover, Select, MultiSelect, Tooltip, Pill, etc.
        ├── hooks.ts             useLocalStorage, useAppTheme
        ├── styles.css           Theme tokens (light + dark)
        ├── main.tsx             React entry point
        └── vite-env.d.ts
```

---

## 6. End-state checklist (for the agent to confirm before signing off)

- [ ] `git --version`, `node -v` (≥ 20), `npm -v` (≥ 10) all succeed.
- [ ] `Token-Migration/` directory exists and contains `app/`, `data/`, `README.md`.
- [ ] `app/node_modules/` exists.
- [ ] `npm run dev` is running and stays running.
- [ ] `curl -sf -o /dev/null -w "%{http_code}" http://localhost:3030/` prints `200`.
- [ ] The user can open <http://localhost:3030/> and see the mapping table.

When all six pass, the setup is complete.
