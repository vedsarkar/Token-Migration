// One-shot importer: takes raw Fiori token data (5 batches pulled via Figma MCP),
// filters out tokens already in SWAPS, computes the closest RDS primitive for each
// missing token (by CIE76 ΔE), and emits a TypeScript file we can import into data.ts.
//
// Run: node scripts/import-missing-fiori.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/* ---------- RDS palette (inlined from src/data.ts) ---------- */

const RDS_RAMPS = {
  'Brand / Blue':   [['50','#E5E5FF'],['100','#CCCCFF'],['200','#B2B2FF'],['300','#6161FF'],['400','#3333FF'],['500','#0A0AFF'],['600','#0000CC'],['700','#000099'],['800','#000066'],['900','#000033']],
  'Brand / Red':    [['50','#FEF6F6'],['100','#FDE7E7'],['200','#F9B8B8'],['300','#F47171'],['400','#F14E4E'],['500','#EE3333'],['600','#BD0F0F'],['700','#8E0B0B'],['800','#5E0808'],['900','#2F0404']],
  'Brand / Gold':   [['50','#FFFAE5'],['100','#FFF5CC'],['200','#FFEB99'],['300','#FFE066'],['400','#FFD733'],['500','#FFCC00'],['600','#FFAA00'],['700','#CC7700'],['800','#9E4F00'],['900','#3D1F00']],
  'Brand / Aqua':   [['50','#E5FFFF'],['100','#CCFFFF'],['200','#99FFFF'],['300','#66FFFF'],['400','#33FFFF'],['500','#00FFFF'],['600','#00CCCC'],['700','#009999'],['800','#006666'],['900','#003333']],
  'Green-Emerald':  [['50','#EDF7F3'],['100','#DCEFE7'],['200','#B8E0D0'],['300','#95D0B8'],['400','#72C0A1'],['500','#4EB189'],['600','#449977'],['700','#2F6A52'],['800','#1F4737'],['900','#10231B']],
  Orange:           [['50','#FDF0E7'],['100','#FCE0CF'],['200','#F8C2A0'],['300','#F5A370'],['400','#F18541'],['500','#EE6611'],['600','#BE520E'],['700','#8F3D0A'],['800','#5F2907'],['900','#301403']],
  Purple:           [['50','#E4D0FB'],['100','#C8A1F7'],['200','#C8A1F7'],['300','#AD72F3'],['400','#9143EF'],['500','#7614EB'],['600','#6611CC'],['700','#460891'],['800','#2F0561'],['900','#180330']],
  Pink:             [['50','#FFE5F3'],['100','#FFCCE8'],['200','#FF99D1'],['300','#FF66B9'],['400','#FF44AA'],['500','#EC1389'],['600','#BD0F6E'],['700','#8E0B52'],['800','#5E0837'],['900','#2F041B']],
  Lime:             [['50','#F7FFE5'],['100','#F0FFCC'],['200','#E0FF99'],['300','#CCFF55'],['400','#C2FF33'],['500','#B2FF00'],['600','#8FCC00'],['700','#6B9900'],['800','#476600'],['900','#243300']],
  Grayscale:        [['50','#F5F5FA'],['100','#E3E3F2'],['200','#BABADE'],['300','#8D8DC8'],['400','#7070A9'],['500','#56568F'],['600','#434370'],['700','#303050'],['800','#262640'],['900D','#0E0E25']],
};

const RDS_COLORS = [];
for (const [ramp, stops] of Object.entries(RDS_RAMPS)) {
  for (const [stop, hex] of stops) {
    RDS_COLORS.push({ id: `${ramp}/${stop}`, label: `${ramp} · ${stop}`, hex });
  }
}
RDS_COLORS.push({ id: 'Pure/White', label: 'Pure · White', hex: '#FFFFFF' });
RDS_COLORS.push({ id: 'Pure/Black', label: 'Pure · Black', hex: '#000000' });

/* ---------- ΔE76 in CIELAB ---------- */

function hexToRgb(hex) {
  const v = hex.replace('#', '');
  if (v.length < 6) return { r: 0, g: 0, b: 0 };
  return { r: parseInt(v.slice(0,2),16), g: parseInt(v.slice(2,4),16), b: parseInt(v.slice(4,6),16) };
}
function srgbToLinear(c) {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}
function hexToLab(hex) {
  const { r, g, b } = hexToRgb(hex);
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  const x = lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375;
  const y = lr * 0.2126729 + lg * 0.7151522 + lb * 0.0721750;
  const z = lr * 0.0193339 + lg * 0.1191920 + lb * 0.9503041;
  const xn = 0.95047, yn = 1.0, zn = 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(x / xn), fy = f(y / yn), fz = f(z / zn);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}
function deltaE76(hex1, hex2) {
  const a = hexToLab(hex1), b = hexToLab(hex2);
  const dL = a.L - b.L, da = a.a - b.a, db = a.b - b.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}
function closest(targetHex) {
  let best = RDS_COLORS[0], bestDe = Infinity;
  for (const c of RDS_COLORS) {
    const dE = deltaE76(targetHex, c.hex);
    if (dE < bestDe) { best = c; bestDe = dE; }
  }
  return { ...best, deltaE: Math.round(bestDe * 10) / 10 };
}

/* ---------- Tokens already mapped (skip these) ---------- */

const ALREADY_MAPPED = new Set([
  // Main
  'Main/sapBrandColor','Main/sapHighlightColor','Main/sapBaseColor',
  // Interaction
  'Interaction/sapSelectedColor','Interaction/sapActiveColor','Interaction/sapHoverColor','Interaction/sapContent_Selected_Background','Interaction/sapContent_Selected_TextColor','Interaction/sapContent_Selected_Hover_Background','Interaction/sapContent_Selected_ForegroundColor','Interaction/sapContent_HelpColor','Interaction/sapContent_DragAndDropActiveColor','Interaction/sapContent_SearchHighlightColor',
  // Text (7)
  'Text/sapTextColor','Text/sapTitleColor','Text/sapContent_ForegroundTextColor','Text/sapContent_LabelColor','Text/sapContent_MarkerTextColor','Text/sapContent_ContrastTextColor','Text/sapContent_DisabledTextColor',
  // Container (5)
  'Container/sapGroup_ContentBackground','Container/sapGroup_ContentBorderColor','Container/sapGroup_TitleBorderColor','Container/sapGroup_TitleTextColor','Container/sapBlockLayer_Background',
  // Semantic (18)
  'Semantic/sapNegativeColor','Semantic/sapErrorColor','Semantic/Border/sapErrorBorderColor','Semantic/Background/sapErrorBackground','Semantic/sapWarningColor','Semantic/sapCriticalColor','Semantic/Border/sapWarningBorderColor','Semantic/Background/sapWarningBackground','Semantic/sapPositiveColor','Semantic/sapSuccessColor','Semantic/Border/sapSuccessBorderColor','Semantic/Background/sapSuccessBackground','Semantic/sapInformativeColor','Semantic/sapInformationColor','Semantic/Border/sapInformationBorderColor','Semantic/Background/sapInformationBackground','Semantic/sapNeutralColor','Semantic/Background/sapNeutralBackground',
  // Link (6)
  'Link/sapLinkColor','Link/sapLink_Hover_Color','Link/sapLink_Active_Color','Link/sapLink_Visited_Color','Link/sapLink_InvertedColor','Link/sapLink_SubtleColor',
  // Button Emphasized (5)
  'Button/Emphasized/sapButton_Emphasized_Background','Button/Emphasized/sapButton_Emphasized_BorderColor','Button/Emphasized/sapButton_Emphasized_TextColor','Button/Emphasized/sapButton_Emphasized_Hover_Background','Button/Emphasized/sapButton_Emphasized_Active_TextColor',
  // Button Status (6)
  'Button/Negative/sapButton_Negative_Background','Button/Negative/sapButton_Negative_Hover_Background','Button/Critical/sapButton_Critical_Background','Button/Critical/sapButton_Critical_Hover_Background','Button/Attention/sapButton_Attention_Background','Button/Attention/sapButton_Attention_TextColor',
  // Focus (2)
  'Focus/sapContent_FocusColor','Focus/sapContent_ContrastFocusColor',
  // Shadow (2)
  'Shadow/sapContent_ShadowColor','Shadow/sapContent_ContrastShadowColor',
  // Foreground (2)
  'Foreground/sapContent_ForegroundBorderColor','Foreground/sapContent_ForegroundColor',
  // Shell (13)
  'Shell/sapShellColor','Shell/sapShell_BorderColor','Shell/sapShell_TextColor','Shell/sapShell_SubBrand_TextColor','Shell/sapShell_InteractiveBackground','Shell/sapShell_Active_TextColor','Shell/sapShell_Selected_TextColor','Shell/sapShell_Background','Shell/sapShell_NegativeColor','Shell/sapShell_CriticalColor','Shell/sapShell_PositiveColor','Shell/sapShell_InformativeColor','Shell/sapShell_NeutralColor',
  // Accent 1-10
  'Accent/sapAccentColor1','Accent/sapAccentColor2','Accent/sapAccentColor3','Accent/sapAccentColor4','Accent/sapAccentColor5','Accent/sapAccentColor6','Accent/sapAccentColor7','Accent/sapAccentColor8','Accent/sapAccentColor9','Accent/sapAccentColor10',
  // Legend full (43) — handled separately in SWAPS
  ...Array.from({length:20}, (_,i)=>`Legend/sapLegendColor${i+1}`),
  ...Array.from({length:20}, (_,i)=>`Legend/sapLegendBackgroundColor${i+1}`),
  'Legend/sapLegend_WorkingBackground','Legend/sapLegend_NonWorkingBackground','Legend/sapLegend_CurrentDateTime',
]);

/* ---------- Pulled data (from the 5 batches above) ---------- */
// Each element: [name, morning, evening, hcWhite, hcBlack]
// To keep this script self-contained, we embed the raw data as a separate file.

import RAW from './fiori-pull.json' with { type: 'json' };

/* ---------- Process ---------- */

const skipped = [];
const generated = {};
let totalIn = 0, totalOut = 0;

for (const row of RAW) {
  totalIn += 1;
  const [name, m, e, w, k] = row;
  if (!name) continue;
  if (ALREADY_MAPPED.has(name)) { skipped.push(name); continue; }
  // Sanity: skip if no Morning value (broken alias)
  if (!m || !m.startsWith('#')) { skipped.push(name + ' (no morning hex)'); continue; }

  // Auto-map: pick closest RDS to Morning for the "name" / Light value, and closest
  // to Evening for the Dark value. Mode-paired matching keeps both schemes coherent.
  const cLight = closest(m);
  const cDark = e && e.startsWith('#') ? closest(e) : cLight;

  // Category bucket
  const cat = name.split('/')[0];
  generated[cat] = generated[cat] ?? [];
  generated[cat].push({
    fiori: name,
    fioriLight: m,
    fioriDark: e || m,
    fioriHcWhite: w || m,
    fioriHcBlack: k || e || m,
    rds: cLight.id === cDark.id ? `Auto · ${cLight.label}` : `Auto · ${cLight.label} ↔ ${cDark.label}`,
    rdsLight: cLight.hex,
    rdsDark: cDark.hex,
    conf: 'medium', // overridden live by computeConfidence in the UI
    note: `Auto-mapped to closest RDS primitive by ΔE76 (Light ΔE ${cLight.deltaE.toFixed(1)}, Dark ΔE ${cDark.deltaE.toFixed(1)}). Refine via the RDS dropdown.`,
  });
  totalOut += 1;
}

/* ---------- Emit TS file ---------- */

function tsEscape(s) { return s.replace(/'/g, "\\'"); }
function emitEntry(e) {
  return `    { fiori: '${tsEscape(e.fiori)}', fioriLight: '${e.fioriLight}', fioriDark: '${e.fioriDark}', fioriHcWhite: '${e.fioriHcWhite}', fioriHcBlack: '${e.fioriHcBlack}', rds: '${tsEscape(e.rds)}', rdsLight: '${e.rdsLight}', rdsDark: '${e.rdsDark}', conf: 'medium', note: '${tsEscape(e.note)}' },`;
}

const categories = Object.keys(generated).sort();
const header = `/* eslint-disable */
/**
 * AUTO-GENERATED: do not hand-edit.
 * Source: scripts/import-missing-fiori.mjs · regenerate by re-running the script.
 *
 * ${totalOut} Fiori Horizon tokens that the hand-curated SWAPS in data.ts doesn't
 * cover. Each token is paired with the closest RDS primitive(s) (by ΔE76 in
 * CIELAB). Users can refine any row via the in-app RDS dropdown.
 */
import type { Mapping } from './data';

export const AUTO_SWAPS: Record<string, Mapping[]> = {
`;

const body = categories.map((cat) => {
  const items = generated[cat];
  return `  ${JSON.stringify(cat)}: [\n${items.map(emitEntry).join('\n')}\n  ],`;
}).join('\n');

const footer = `\n};\n`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '..', 'src', 'data-auto-mapped.ts');
writeFileSync(outPath, header + body + footer);

console.log(`Read ${totalIn} tokens from fiori-pull.json`);
console.log(`Skipped ${skipped.length} (already in SWAPS or missing hex)`);
console.log(`Generated ${totalOut} new entries across ${categories.length} categories`);
console.log(`Wrote ${outPath}`);
for (const cat of categories) {
  console.log(`  ${cat}: ${generated[cat].length}`);
}
