# Fiori → RDS 3.1 Color Hot-Swap Mapping

> Generated 2026-05-19 directly from both Figma files via the Figma MCP. See
> `data/hot-swap-map.json` for the machine-readable version.

## Confidence legend

| Tag | Meaning |
|---|---|
| **high** | Visually and semantically equivalent — safe one-to-one swap. |
| **medium** | Same semantic role, different hue/saturation — acceptable with brand review. |
| **low** | Cross-hue or no perfect equivalent — QA in context before rollout. |

---

## 1. Reltio Design System 3.1 color palette (full list)

These are the **primitives** — the actual hex values Reltio designs from. Every RDS
semantic token resolves down to one of these. (Transparent variants exist for 200/600/900
at 10/30/50/70/90 alpha; omitted below for brevity.)

### Brand Colors

| Ramp | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Blue** (Reltio Cobalt is 600) | `#E5E5FF` | `#CCCCFF` | `#B2B2FF` | `#6161FF` | `#3333FF` | `#0A0AFF` | `#0000CC` | `#000099` | `#000066` | `#000033` |
| **Red** (default 500) | `#FEF6F6` | `#FDE7E7` | `#F9B8B8` | `#F47171` | `#F14E4E` | `#EE3333` | `#BD0F0F` | `#8E0B0B` | `#5E0808` | `#2F0404` |
| **Gold** (default 500) | `#FFFAE5` | `#FFF5CC` | `#FFEB99` | `#FFE066` | `#FFD733` | `#FFCC00` | `#FFAA00` | `#CC7700` | `#9E4F00` | `#3D1F00` |
| **Aqua** (default 500) | `#E5FFFF` | `#CCFFFF` | `#99FFFF` | `#66FFFF` | `#33FFFF` | `#00FFFF` | `#00CCCC` | `#009999` | `#006666` | `#003333` |

### Other Colors

| Ramp | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Green-Emerald** (default 600) | `#EDF7F3` | `#DCEFE7` | `#B8E0D0` | `#95D0B8` | `#72C0A1` | `#4EB189` | `#449977` | `#2F6A52` | `#1F4737` | `#10231B` |
| **Orange** (default 500) | `#FDF0E7` | `#FCE0CF` | `#F8C2A0` | `#F5A370` | `#F18541` | `#EE6611` | `#BE520E` | `#8F3D0A` | `#5F2907` | `#301403` |
| **Purple** (default 600) | `#E4D0FB` | `#C8A1F7` | `#C8A1F7` | `#AD72F3` | `#9143EF` | `#7614EB` | `#6611CC` | `#460891` | `#2F0561` | `#180330` |
| **Pink** (default 400) | `#FFE5F3` | `#FFCCE8` | `#FF99D1` | `#FF66B9` | `#FF44AA` | `#EC1389` | `#BD0F6E` | `#8E0B52` | `#5E0837` | `#2F041B` |
| **Lime** (default 300) | `#F7FFE5` | `#F0FFCC` | `#E0FF99` | `#CCFF55` | `#C2FF33` | `#B2FF00` | `#8FCC00` | `#6B9900` | `#476600` | `#243300` |

### Neutrals

| Ramp | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900D |
|---|---|---|---|---|---|---|---|---|---|---|
| **Grayscale** (purple-tinted) | `#F5F5FA` | `#E3E3F2` | `#BABADE` | `#8D8DC8` | `#7070A9` | `#56568F` | `#434370` | `#303050` | `#262640` | `#0E0E25` |
| **Pure** | White `#FFFFFF` · Black `#000000` |

---

## 2. The Brand Identity Swap

This is the heart of the migration. Every Fiori component that references brand blue
will inherit Reltio Cobalt.

| Fiori token | Fiori value | RDS replacement | RDS value | Confidence |
|---|---|---|---|---|
| `sapBrandColor` | `#0070F2` | `Brand/Blue/600` (Reltio Cobalt) | `#0000CC` | **high** |
| `sapHighlightColor` (Light) | `#0064D9` | `Brand/Blue/600` | `#0000CC` | **high** |
| `sapHighlightColor` (Dark) | `#4DB1FF` | `Brand/Blue/300` | `#6161FF` | **high** |
| `sapBaseColor` (Light) | `#FFFFFF` | `White` | `#FFFFFF` | **high** |
| `sapBaseColor` (Dark) | `#1D232A` | `Grayscale/900D` | `#0E0E25` | **high** |

---

## 3. Hot-swap map by category

### 3.1 Interaction

| Fiori token | Light | Dark | RDS replacement | RDS Light | RDS Dark | Conf |
|---|---|---|---|---|---|---|
| `sapSelectedColor` | `#0064D9` | `#4DB1FF` | Primary/Base | `#0000CC` | `#6161FF` | high |
| `sapActiveColor` | `#DEE2E5` | `#020303` | Grayscale/100 ↔ 900D | `#E3E3F2` | `#0E0E25` | high |
| `sapHoverColor` | `#EAECEE` | `#222B35` | Grayscale/50 ↔ 800 | `#F5F5FA` | `#262640` | high |
| `sapContent_Selected_TextColor` | `#0064D9` | `#4DB1FF` | Primary/Base | `#0000CC` | `#6161FF` | high |
| `sapContent_Selected_Hover_Background` | `#E3F0FF` | `#002B4D` | Brand/Blue/50 ↔ 900 | `#E5E5FF` | `#000033` | high |
| `sapContent_HelpColor` | `#188918` | `#5DC122` | Green-Emerald/600 | `#449977` | `#449977` | medium |
| `sapContent_DragAndDropActiveColor` | `#0064D9` | `#4DB1FF` | Primary/Base | `#0000CC` | `#6161FF` | high |

### 3.2 Text

| Fiori token | Light | Dark | RDS replacement | RDS Light | RDS Dark | Conf |
|---|---|---|---|---|---|---|
| `sapTextColor` / `sapTitleColor` / `sapContent_ForegroundTextColor` | `#131E29` | `#F5F6F7` | Fonts & Icons/Default | `#0E0E25` | `#E3E3F2` | high |
| `sapContent_LabelColor` | `#556B82` | `#8396A8` | Fonts & Icons/Descriptions | `#56568F` | `#BABADE` | high |
| `sapContent_ContrastTextColor` | `#FFFFFF` | `#1D232A` | White ↔ Grayscale/900D | `#FFFFFF` | `#0E0E25` | high |
| `sapContent_DisabledTextColor` | `#131E29` @ 60% | `#F5F6F7` @ 60% | Fonts & Icons/disabled | `#BABADE` | `#56568F` | high |
| `sapContent_MarkerTextColor` | `#046C7A` | `#64EDD2` | Brand/Aqua/700 ↔ 300 | `#009999` | `#66FFFF` | medium |

### 3.3 Container

| Fiori token | Light | Dark | RDS replacement | RDS Light | RDS Dark | Conf |
|---|---|---|---|---|---|---|
| `sapGroup_ContentBackground` | `#FFFFFF` | `#1D232A` | Background/Surface 1 | `#FFFFFF` | `#0E0E25` | high |
| `sapGroup_ContentBorderColor` | `#D9D9D9` | `#323C48` | Outline-Border/Surface Border 2 | `#E3E3F2` | `#56568F` | high |
| `sapGroup_TitleBorderColor` | `#A8B3BD` | `#758EA5` | Outline-Border/Surface Border 3 | `#BABADE` | `#434370` | high |
| `sapGroup_TitleTextColor` | `#1D2D3E` | `#F5F6F7` | Fonts & Icons/Default | `#0E0E25` | `#E3E3F2` | high |
| `sapBlockLayer_Background` | `#000000` | `#000000` | Black | `#000000` | `#000000` | high |

### 3.4 Semantic / Status

| Fiori token | Light | Dark | RDS replacement | RDS Light | RDS Dark | Conf |
|---|---|---|---|---|---|---|
| `sapNegativeColor` / `sapErrorColor` | `#AA0808` | `#FA6161` | Brand/Red/600 | `#BD0F0F` | `#EE3333` | high |
| `sapErrorBorderColor` | `#E90B0B` | `#FA6161` | Brand/Red/500 (Error/Default) | `#EE3333` | `#EE3333` | high |
| `sapErrorBackground` | `#FFEAF4` | `#350000` | Brand/Red/100 (Error/Soft fill) | `#FDE7E7` | `#2F0404` | medium |
| `sapPositiveColor` / `sapSuccessColor` | `#256F3A` | `#97DD40` | Green-Emerald/700 | `#2F6A52` | `#4EB189` | high |
| `sapSuccessBorderColor` | `#30914C` | `#6DAD1F` | Green-Emerald/600 | `#449977` | `#4EB189` | medium |
| `sapSuccessBackground` | `#F5FAE5` | `#11331A` | Green-Emerald/100 | `#DCEFE7` | `#10231B` | medium |
| `sapWarningColor` / `sapCriticalColor` | `#E76500` | `#FFDF72` | Orange/500 *(or Gold/700)* | `#EE6611` | `#FFE066` | medium |
| `sapWarningBorderColor` | `#DD6100` | `#F7BF00` | Orange/600 | `#BE520E` | `#CC7700` | medium |
| `sapWarningBackground` | `#FFF8D6` | `#382700` | Gold/100 (Warning/Soft fill) | `#FFF5CC` | `#3D1F00` | high |
| `sapInformativeColor` / `sapInformationColor` | `#0070F2` | `#4DB1FF` | Brand/Blue/600 (Reltio Cobalt) | `#0000CC` | `#6161FF` | high |
| `sapInformationBorderColor` | `#0070F2` | `#4DB1FF` | Brand/Blue/600 | `#0000CC` | `#6161FF` | high |
| `sapInformationBackground` | `#E1F4FF` | `#00144A` | Brand/Blue/50 ↔ Blue/900 | `#E5E5FF` | `#000033` | high |
| `sapNeutralColor` | `#788FA6` | `#A9B4BE` | Grayscale/400 | `#7070A9` | `#8D8DC8` | high |
| `sapNeutralBackground` | `#EFF1F2` | `#242E38` | Grayscale/50 ↔ Grayscale/800 | `#F5F5FA` | `#262640` | high |

### 3.5 Link

| Fiori token | Light | Dark | RDS replacement | RDS Light | RDS Dark | Conf |
|---|---|---|---|---|---|---|
| `sapLinkColor` (Hover / Active / Visited share the same value) | `#0064D9` | `#008FFF` | Fonts & Icons/Links & Text (`Blue/400`) **or** Brand/Blue/600 | `#3333FF` | `#B2B2FF` | high |
| `sapLink_InvertedColor` | `#A5CFFF` | `#BDE2FF` | Brand/Blue/200 | `#B2B2FF` | `#B2B2FF` | high |
| `sapLink_SubtleColor` | `#131E29` | `#EAECEE` | Fonts & Icons/Default | `#0E0E25` | `#E3E3F2` | high |

> RDS uses **Blue/400** (`#3333FF`) for links to differentiate them from the CTA Cobalt
> (`#0000CC`). If you want links to match buttons, swap to `Brand/Blue/600` instead.

### 3.6 Button — Emphasized (Primary CTA)

| Fiori token | Light | Dark | RDS replacement | RDS Light | RDS Dark | Conf |
|---|---|---|---|---|---|---|
| `sapButton_Emphasized_Background` | `#0070F2` | `#0070F2` | Primary/Base | `#0000CC` | `#0000CC` | high |
| `sapButton_Emphasized_BorderColor` | `#0070F2` | `#0070F2` | Primary/Base | `#0000CC` | `#0000CC` | high |
| `sapButton_Emphasized_TextColor` | `#FFFFFF` | `#FFFFFF` | White | `#FFFFFF` | `#FFFFFF` | high |
| `sapButton_Emphasized_Hover_Background` | `#0064D9` | `#0064D9` | Primary/Hover (Blue/800) | `#000066` | `#000066` | high |
| `sapButton_Emphasized_Active_TextColor` | `#0064D9` | `#4DB1FF` | Primary/Base | `#0000CC` | `#6161FF` | high |

### 3.7 Button — Negative / Critical / Attention

| Fiori token | Light | Dark | RDS replacement | RDS Light | RDS Dark | Conf |
|---|---|---|---|---|---|---|
| `sapButton_Negative_Background` | `#F53232` | `#FA6161` | Brand/Red/500 (Error/Default) | `#EE3333` | `#EE3333` | high |
| `sapButton_Negative_Hover_Background` | `#E90B0B` | `#FB7A7A` | Brand/Red/600 ↔ Red/300 | `#BD0F0F` | `#F47171` | high |
| `sapButton_Critical_Background` | `#E76500` | `#F7BF00` | Orange/500 ↔ Gold/600 | `#EE6611` | `#FFAA00` | medium |
| `sapButton_Critical_Hover_Background` | `#DD6100` | `#FFCF2B` | Orange/600 ↔ Gold/500 | `#BE520E` | `#FFCC00` | medium |
| `sapButton_Attention_Background` | `#FFF3B7` | `#382700` | Brand/Gold/200 ↔ Gold/900 | `#FFEB99` | `#3D1F00` | high |
| `sapButton_Attention_TextColor` | `#B44F00` | `#FFDF72` | Orange/700 ↔ Gold/300 | `#8F3D0A` | `#FFE066` | medium |

### 3.8 Focus / Shadow / Foreground

| Fiori token | Light | Dark | RDS replacement | RDS Light | RDS Dark | Conf |
|---|---|---|---|---|---|---|
| `sapContent_FocusColor` | `#0032A5` | `#9AD3FF` | Brand/Blue/800 ↔ Blue/200 | `#000066` | `#B2B2FF` | high |
| `sapContent_ContrastFocusColor` | `#FFFFFF` | `#000000` | White ↔ Black | `#FFFFFF` | `#000000` | high |
| `sapContent_ShadowColor` | `#223548` | `#000000` | Grayscale/700 ↔ Black | `#303050` | `#000000` | high |
| `sapContent_ContrastShadowColor` | `#FFFFFF` | `#FFFFFF` | White | `#FFFFFF` | `#FFFFFF` | high |
| `sapContent_ForegroundBorderColor` | `#758CA4` | `#A9B4BE` | Fonts & Icons/Placeholder | `#8D8DC8` | `#BABADE` | medium |
| `sapContent_ForegroundColor` | `#EFEFEF` | `#101418` | Grayscale/50 ↔ 900D | `#F5F5FA` | `#0E0E25` | high |

### 3.9 Shell (Top branding bar)

| Fiori token | Light | Dark | RDS replacement | RDS Light | RDS Dark | Conf |
|---|---|---|---|---|---|---|
| `sapShellColor` | `#FFFFFF` | `#1D232A` | Background/Surface 1 | `#FFFFFF` | `#0E0E25` | high |
| `sapShell_BorderColor` | `#D9D9D9` | `#2E3742` | Outline-Border/Surface Border 2 | `#E3E3F2` | `#56568F` | high |
| `sapShell_TextColor` | `#131E29` | `#F5F6F7` | Fonts & Icons/Default | `#0E0E25` | `#E3E3F2` | high |
| `sapShell_SubBrand_TextColor` | `#003E87` | `#4DB1FF` | Brand/Blue/800 ↔ Blue/300 | `#000066` | `#6161FF` | high |
| `sapShell_InteractiveBackground` | `#EFF1F2` | `#12171C` | Grayscale/50 ↔ 900D | `#F5F5FA` | `#0E0E25` | high |
| `sapShell_Active_TextColor` / `_Selected_TextColor` | `#0070F2` | `#4DB1FF` | Primary/Base | `#0000CC` | `#6161FF` | high |
| `sapShell_NegativeColor` | `#AA0808` | `#FA6161` | Brand/Red/600 | `#BD0F0F` | `#EE3333` | high |
| `sapShell_CriticalColor` | `#B44F00` | `#FFDF72` | Orange/700 ↔ Gold/300 | `#8F3D0A` | `#FFE066` | medium |
| `sapShell_PositiveColor` | `#256F3A` | `#97DD40` | Green-Emerald/700 | `#2F6A52` | `#4EB189` | high |
| `sapShell_InformativeColor` | `#0064D9` | `#4DB1FF` | Primary/Base | `#0000CC` | `#6161FF` | high |
| `sapShell_NeutralColor` | `#131E29` | `#F5F6F7` | Fonts & Icons/Default | `#0E0E25` | `#E3E3F2` | high |

> Shell has 16 `sapShell_Category_N_*` decorative colors used for app categorization
> tiles. These map 1:1 onto RDS Other Colors (Purple, Pink, Orange, Aqua, Lime). See
> `data/hot-swap-map.json` if you need the full per-category list — Reltio's launch
> apps will likely only use a subset.

### 3.10 Accent (Decorative / Chart palette)

Fiori provides 10 accent hues for data visualization. Map onto RDS's broader palette:

| Fiori token | Light | Dark | RDS replacement | RDS Light | RDS Dark | Conf |
|---|---|---|---|---|---|---|
| `sapAccentColor1` | `#D27700` | `#FFDF72` | Brand/Gold/700 ↔ Gold/300 | `#CC7700` | `#FFE066` | high |
| `sapAccentColor2` | `#AA0808` | `#FF8CB2` | Brand/Red/600 ↔ Pink/300 | `#BD0F0F` | `#FF66B9` | medium |
| `sapAccentColor3` | `#BA066C` | `#FECBDA` | Pink/600 ↔ Pink/100 | `#BD0F6E` | `#FFCCE8` | high |
| `sapAccentColor4` | `#A100C2` | `#FFAFED` | Purple/600 ↔ Pink/200 | `#6611CC` | `#FF99D1` | medium |
| `sapAccentColor5` | `#5D36FF` | `#D3B6FF` | Purple/500 ↔ Purple/200 | `#7614EB` | `#C8A1F7` | medium |
| `sapAccentColor6` | `#0057D2` | `#A6E0FF` | Brand/Blue/700 ↔ Blue/200 | `#000099` | `#B2B2FF` | high |
| `sapAccentColor7` | `#046C7A` | `#64EDD2` | Brand/Aqua/700 ↔ Aqua/300 | `#009999` | `#66FFFF` | high |
| `sapAccentColor8` | `#256F3A` | `#BDE986` | Green-Emerald/700 ↔ Lime/200 | `#2F6A52` | `#E0FF99` | high |
| `sapAccentColor9` | `#6C32A9` | `#B995E0` | Purple/700 ↔ Purple/300 | `#460891` | `#AD72F3` | high |
| `sapAccentColor10` | `#5B738B` | `#D5DADD` | Grayscale/500 ↔ Grayscale/200 | `#56568F` | `#BABADE` | high |

---

## 4. Design decisions to ratify

### 4.1 Warning hue — orange vs gold
Fiori warning (`#E76500`) is a **vivid orange-amber**. Reltio's Warning semantic token
is **Gold** (`#FFCC00`). These are perceptually different — orange feels more urgent.

- **Option A — Preserve perception**: Map `sapWarningColor` → `Other/Orange/500`
  (`#EE6611`). Closer to the Fiori reading; safe for status badges and alerts.
- **Option B — Align to Reltio brand**: Map `sapWarningColor` → `Brand/Gold/500`
  (`#FFCC00`). Reuses Reltio's gold accent and reinforces brand language.

`hot-swap-map.json` currently encodes **Option A** with a note pointing to Option B. The
right call depends on accessibility audits — gold-on-white is borderline for AA contrast
on text.

### 4.2 Success green
Fiori's success (`#256F3A`) is a **forest green**. Reltio's Emerald (`#449977` /
`#2F6A52`) is **teal-leaning**. Mapping is unambiguous but the green will read cooler
in the Reltio version. Acceptable; no perfect substitute.

### 4.3 Link blue vs CTA blue
RDS deliberately uses **Blue/400** (`#3333FF`) for `Links & Text` to differentiate
links from buttons (which use the deeper Cobalt `#0000CC`). Fiori collapses these into
one blue. Decide whether to:
- **Keep RDS distinction**: Links read brighter than buttons — better discoverability
  but breaks Fiori's expectation.
- **Match buttons**: Single-blue UX consistent with how Fiori components are designed.

### 4.4 Background tint
Fiori backgrounds (`#EFF1F2`, `#EAECEE`) are **cool neutral grays**. Reltio grays
(`#F5F5FA`, `#E3E3F2`) are **purple-tinted** (because Grayscale 500 is `#56568F` — close
to Reltio's Midnight blue family). The whole UI will read very slightly purple-warm.
Acceptable and on-brand.

---

## 5. Implementation playbook

1. **Audit which Fiori CSS variables you actually consume.** Fiori ships 899 color
   tokens; Reltio apps likely touch ~100. Run a grep across the app source for `--sap*`
   references and prioritize.
2. **Write a single override sheet** (e.g. `reltio-fiori-theme.css`) that sets each
   `--sapXxx` variable to its RDS hex. Load it after Fiori's theme.
3. **For Figma alignment**, re-alias the Horizon variables to RDS primitives so designers
   see the new look in the design files too. The Horizon collection has 4 modes (Morning,
   Evening, HC White, HC Black) — at minimum re-alias Morning + Evening.
4. **QA passes** to schedule:
   - Charts/data-viz (Accent palette, contrast against Surface 1)
   - Inline status messages (Success/Warning/Error backgrounds + text combos)
   - Focus rings on light + dark
   - Top shell + category tiles
5. **Don't forget icon SVGs.** Fiori UI5 icons use `currentColor` in most places — they
   will inherit the new brand blue automatically. SVGs with baked-in hex (`#0070F2`)
   need a manual replace.
